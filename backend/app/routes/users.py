from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import update

from app.database import get_db
from app.models import User
from app.schemas.user import UserRead, UserUpdate, PlantsAdd, GlucoseAdd
from app.deps import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserRead)
def update_me(
    patch: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = patch.model_dump(exclude_unset=True)

    # Block changing of email verification
    if "is_email_verified" in data:
        raise HTTPException(
            status_code=403, detail="Not allowed to change email verification")

    if "email" in data:
        current_user.email = data["email"].lower().strip()

    if "password" in data:
        from app.security import hash_password
        current_user.password = hash_password(data["password"])

    if "streak" in data:
        current_user.streak = data["streak"]

    if "glucose" in data:
        current_user.glucose = data["glucose"]

    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/me/plants", response_model=UserRead)
def add_plant_me(
    payload: PlantsAdd,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pid = payload.plant_id

    if pid not in current_user.plants:
        current_user.plants.append(pid)
        db.commit()
        db.refresh(current_user)

    return current_user


@router.delete("/me/plants/{plant_id}", response_model=UserRead)
def remove_plant_me(
    plant_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if plant_id in current_user.plants:
        current_user.plants.remove(plant_id)
        db.commit()
        db.refresh(current_user)

    return current_user


@router.post("/me/glucose/add", response_model=UserRead)
def add_coins_me(
    payload: GlucoseAdd,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = (
        update(User)
        .where(User.id == current_user.id)
        .values(glucose=User.glucose + payload.amount)
        .returning(User)
    )
    updated_user = db.execute(stmt).scalar_one()
    db.commit()
    return updated_user
