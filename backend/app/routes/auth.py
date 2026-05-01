from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from jose import JWTError
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.email_verification import (
    EmailVerificationTokenError,
    PasswordResetTokenError,
    parse_email_verification_token,
    parse_password_reset_token,
    send_password_reset_email,
    send_verification_email,
)
from app.jwt import (
    REFRESH_TOKEN_TYPE,
    create_access_token,
    create_refresh_token,
    decode_typed_token,
)
from app.models import User
from app.schemas.auth import (
    ForgotPasswordIn,
    ForgotPasswordOut,
    LoginIn,
    RefreshTokenIn,
    RegisterIn,
    RegisterOut,
    ResendVerificationIn,
    ResendVerificationOut,
    ResetPasswordIn,
    ResetPasswordOut,
    TokenOut,
    VerifyEmailIn,
    VerifyEmailOut,
)
from app.security import hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


def issue_session_tokens(user: User) -> TokenOut:
    return TokenOut(
        access_token=create_access_token(subject=str(user.id)),
        refresh_token=create_refresh_token(
            subject=str(user.id),
            refresh_token_version=user.refresh_token_version,
        ),
    )


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
    if dispatch.email_sent:
        message = "Account created. Check your email for the verification link."
    elif dispatch.dev_action_url:
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
        verification_email_sent=dispatch.email_sent,
        dev_verification_url=dispatch.dev_action_url,
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
    db.refresh(user)

    return issue_session_tokens(user)


@router.post("/refresh", response_model=TokenOut)
def refresh_session(payload: RefreshTokenIn, db: Session = Depends(get_db)):
    cred_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired refresh token",
    )

    try:
        token_payload = decode_typed_token(payload.refresh_token, REFRESH_TOKEN_TYPE)
        sub = token_payload.get("sub")
        token_version = int(token_payload.get("refresh_token_version"))
        user_id = int(sub)
    except (JWTError, TypeError, ValueError):
        raise cred_exc

    user = db.get(User, user_id)
    if not user or user.refresh_token_version != token_version:
        raise cred_exc

    if not user.is_email_verified:
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={
                "message": "Verify your email before renewing your session.",
                "requires_email_verification": True,
            },
        )

    return issue_session_tokens(user)


@router.post("/resend-verification", response_model=ResendVerificationOut)
def resend_verification(
    payload: ResendVerificationIn,
    db: Session = Depends(get_db),
):
    email = payload.email.lower().strip()
    user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()

    dispatch = None
    if user and not user.is_email_verified:
        dispatch = send_verification_email(user)

    return ResendVerificationOut(
        message=(
            "If that account exists and still needs verification, a fresh "
            "verification link has been generated. If SMTP is not configured "
            "locally, check the backend log."
        ),
        dev_verification_url=dispatch.dev_action_url if dispatch else None,
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
    tokens = issue_session_tokens(user)
    return VerifyEmailOut(message=message, **tokens.model_dump())


@router.post("/forgot-password", response_model=ForgotPasswordOut)
def forgot_password(payload: ForgotPasswordIn, db: Session = Depends(get_db)):
    email = payload.email.lower().strip()
    user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()

    dispatch = send_password_reset_email(user) if user else None
    message = (
        "If that account exists, a password reset email has been sent. "
        "If SMTP is not configured locally, check the backend log."
    )
    if dispatch and dispatch.dev_action_url:
        message = (
            "If that account exists, a password reset email has been sent. "
            "SMTP is not configured, so you can use the local reset link shown below."
        )

    return ForgotPasswordOut(
        message=message,
        dev_reset_url=dispatch.dev_action_url if dispatch else None,
    )


@router.post("/reset-password", response_model=ResetPasswordOut)
def reset_password(payload: ResetPasswordIn, db: Session = Depends(get_db)):
    try:
        user_id, token_email = parse_password_reset_token(payload.token)
    except PasswordResetTokenError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    user = db.get(User, user_id)
    if not user or user.email != token_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password reset link is invalid or expired.",
        )

    user.password = hash_password(payload.password)
    user.is_email_verified = True
    user.refresh_token_version += 1
    user.last_login = datetime.now(timezone.utc)
    db.commit()
    db.refresh(user)

    tokens = issue_session_tokens(user)
    return ResetPasswordOut(
        message="Password reset complete. You are now signed in.",
        **tokens.model_dump(),
    )
