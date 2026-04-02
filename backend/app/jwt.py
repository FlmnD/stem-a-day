from datetime import datetime, timedelta, timezone
from typing import Any

from jose import jwt

from app.settings import settings


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
        token_type="access",
    )


def create_email_verification_token(subject: str, email: str) -> str:
    return create_token(
        subject=subject,
        expires_minutes=settings.EMAIL_VERIFICATION_TOKEN_EXPIRES_MINUTES,
        token_type="email_verification",
        extra_claims={"email": email},
    )


def decode_token(token: str) -> dict[str, Any]:
    return jwt.decode(
        token,
        settings.JWT_SECRET_KEY,
        algorithms=[settings.JWT_ALGORITHM],
    )
