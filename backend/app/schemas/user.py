from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)


class UserRead(BaseModel):
    id: int
    email: EmailStr
    streak: int
    glucose: int
    is_email_verified: bool
    created_at: datetime
    updated_at: datetime
    last_login: datetime
    plants: list[str]

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(default=None, min_length=8)
    streak: Optional[int] = None
    glucose: Optional[int] = None
    is_email_verified: Optional[bool] = None


class PlantsAdd(BaseModel):
    plant_id: str = Field(min_length=1, max_length=64)


class PlantsRemove(BaseModel):
    plant_id: str = Field(min_length=1, max_length=64)


class PlantsReplace(BaseModel):
    plants: list[str] = Field(default_factory=list)
