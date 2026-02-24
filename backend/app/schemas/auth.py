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
                "Username must be 5–20 chars, use letters/numbers/_/-, "
                "and cannot start or end with _ or -."
            )
        return v



class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
