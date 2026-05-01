import re

from pydantic import BaseModel, EmailStr, Field, field_validator


USERNAME_RE = re.compile(r"^[A-Za-z0-9](?:[A-Za-z0-9_-]{3,18})[A-Za-z0-9]$")


class RegisterIn(BaseModel):
    email: EmailStr
    password: str
    username: str = Field(..., min_length=5, max_length=20)

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        v = v.strip()
        if not USERNAME_RE.fullmatch(v):
            raise ValueError(
                "Username must be 5-20 chars, use letters/numbers/_/-, "
                "and cannot start or end with _ or -."
            )
        return v


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class RegisterOut(BaseModel):
    message: str
    email: EmailStr
    verification_email_sent: bool
    dev_verification_url: str | None = None


class ResendVerificationIn(BaseModel):
    email: EmailStr


class ResendVerificationOut(BaseModel):
    message: str
    dev_verification_url: str | None = None


class VerifyEmailIn(BaseModel):
    token: str = Field(min_length=1)


class ForgotPasswordIn(BaseModel):
    email: EmailStr


class ForgotPasswordOut(BaseModel):
    message: str
    dev_reset_url: str | None = None


class RefreshTokenIn(BaseModel):
    refresh_token: str = Field(min_length=1)


class ResetPasswordIn(BaseModel):
    token: str = Field(min_length=1)
    password: str = Field(min_length=8)


class TokenOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class VerifyEmailOut(TokenOut):
    message: str


class ResetPasswordOut(TokenOut):
    message: str
