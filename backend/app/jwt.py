from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt

from app.settings import settings

ACCESS_TOKEN_TYPE = "access"
REFRESH_TOKEN_TYPE = "refresh"
EMAIL_VERIFICATION_TOKEN_TYPE = "email_verification"
PASSWORD_RESET_TOKEN_TYPE = "password_reset"


def create_token(
    subject: str,
    expires_minutes: int,
    token_type: str,
    extra_claims: dict[str, Any] | None = None,
) -> str:
    issued_at = datetime.now(timezone.utc)
    to_encode = {
        "sub": subject,
        "exp": issued_at + timedelta(minutes=expires_minutes),
        "iat": issued_at,
        "token_type": token_type,
    }

    if extra_claims:
        to_encode.update(extra_claims)

    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_access_token(subject: str) -> str:
    return create_token(
        subject=subject,
        expires_minutes=settings.JWT_ACCESS_TOKEN_EXPIRES_MINUTES,
        token_type=ACCESS_TOKEN_TYPE,
    )


def create_refresh_token(subject: str, refresh_token_version: int) -> str:
    return create_token(
        subject=subject,
        expires_minutes=settings.JWT_REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60,
        token_type=REFRESH_TOKEN_TYPE,
        extra_claims={"refresh_token_version": refresh_token_version},
    )


def create_email_verification_token(subject: str, email: str) -> str:
    return create_token(
        subject=subject,
        expires_minutes=settings.EMAIL_VERIFICATION_TOKEN_EXPIRES_MINUTES,
        token_type=EMAIL_VERIFICATION_TOKEN_TYPE,
        extra_claims={"email": email},
    )


def create_password_reset_token(subject: str, email: str) -> str:
    return create_token(
        subject=subject,
        expires_minutes=settings.PASSWORD_RESET_TOKEN_EXPIRES_MINUTES,
        token_type=PASSWORD_RESET_TOKEN_TYPE,
        extra_claims={"email": email},
    )


def decode_token(token: str) -> dict[str, Any]:
    return jwt.decode(
        token,
        settings.JWT_SECRET_KEY,
        algorithms=[settings.JWT_ALGORITHM],
    )


def decode_typed_token(token: str, expected_token_type: str) -> dict[str, Any]:
    payload = decode_token(token)
    if payload.get("token_type") != expected_token_type:
        raise JWTError("Unexpected token type")
    return payload
