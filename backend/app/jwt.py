from datetime import datetime, timedelta, timezone
from jose import jwt
from app.settings import settings


def create_access_token(subject: str) -> str:
    expire = datetime.now(
        timezone.utc) + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRES_MINUTES)
    to_encode = {
        "sub": subject,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
