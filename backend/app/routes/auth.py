from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.email_verification import (
    EmailVerificationTokenError,
    parse_email_verification_token,
    send_verification_email,
)
from app.jwt import create_access_token
from app.models import User
from app.schemas.auth import (
    LoginIn,
    RegisterIn,
    RegisterOut,
    ResendVerificationIn,
    ResendVerificationOut,
    TokenOut,
    VerifyEmailIn,
    VerifyEmailOut,
)
from app.security import hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=RegisterOut, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterIn, db: Session = Depends(get_db)):
    email = payload.email.lower().strip()
    username = payload.username.strip()

    existing_email = db.execute(
        select(User).where(User.email == email)
    ).scalar_one_or_none()
    if existing_email:
        raise HTTPException(status_code=409, detail="Email already in use")

    existing_username = db.execute(
        select(User).where(func.lower(User.username) == username.lower())
    ).scalar_one_or_none()
    if existing_username:
        raise HTTPException(status_code=409, detail="Username already in use")

    user = User(
        email=email,
        username=username,
        password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    dispatch = send_verification_email(user)
    if dispatch.verification_email_sent:
        message = "Account created. Check your email for the verification link."
    elif dispatch.dev_verification_url:
        message = (
            "Account created. SMTP is not configured, so you can use the local "
            "verification link shown below."
        )
    else:
        message = (
            "Account created, but we could not send the verification email yet. "
            "Request another verification link to try again."
        )

    return RegisterOut(
        message=message,
        email=user.email,
        verification_email_sent=dispatch.verification_email_sent,
        dev_verification_url=dispatch.dev_verification_url,
    )


@router.post("/login", response_model=TokenOut)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    email = payload.email.lower().strip()

    user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not user.is_email_verified:
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={
                "message": "Verify your email before logging in.",
                "requires_email_verification": True,
            },
        )

    user.last_login = datetime.now(timezone.utc)
    db.commit()

    token = create_access_token(subject=str(user.id))
    return TokenOut(access_token=token)


@router.post("/resend-verification", response_model=ResendVerificationOut)
def resend_verification(
    payload: ResendVerificationIn,
    db: Session = Depends(get_db),
):
    email = payload.email.lower().strip()
    user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()

    if user and not user.is_email_verified:
        send_verification_email(user)

    return ResendVerificationOut(
        message=(
            "If that account exists and still needs verification, a fresh "
            "verification link has been generated. If SMTP is not configured "
            "locally, check the backend log."
        )
    )


@router.post("/verify-email", response_model=VerifyEmailOut)
def verify_email(payload: VerifyEmailIn, db: Session = Depends(get_db)):
    try:
        user_id, token_email = parse_email_verification_token(payload.token)
    except EmailVerificationTokenError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    user = db.get(User, user_id)
    if not user or user.email != token_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification link is invalid or expired.",
        )

    already_verified = user.is_email_verified
    if not already_verified:
        user.is_email_verified = True

    user.last_login = datetime.now(timezone.utc)
    db.commit()
    db.refresh(user)

    message = (
        "Email already verified. You are now signed in."
        if already_verified
        else "Email verified. You are now signed in."
    )
    token = create_access_token(subject=str(user.id))
    return VerifyEmailOut(message=message, access_token=token)
