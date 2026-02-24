from sqlalchemy import select, func
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas.auth import RegisterIn, LoginIn, TokenOut
from app.security import hash_password, verify_password
from app.jwt import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenOut, status_code=status.HTTP_201_CREATED)
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

    token = create_access_token(subject=str(user.id))
    return TokenOut(access_token=token)


@router.post("/login", response_model=TokenOut)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    email = payload.email.lower().strip()

    user = db.execute(select(User).where(
        User.email == email)).scalar_one_or_none()
    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(
            status_code=401, detail="Incorrect email or password")

    user.last_login = datetime.now(timezone.utc)
    db.commit()

    token = create_access_token(subject=str(user.id))
    return TokenOut(access_token=token)
