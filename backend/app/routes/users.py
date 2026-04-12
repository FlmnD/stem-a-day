from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, update
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_verified_user
from app.email_verification import send_verification_email
from app.models import User
from app.schemas.user import GlucoseAdd, PlantsAdd, UserRead, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_verified_user)):
    return current_user


@router.patch("/me", response_model=UserRead)
def update_me(
    patch: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
):
    data = patch.model_dump(exclude_unset=True)
    should_send_verification_email = False

    if "is_email_verified" in data:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed to change email verification",
        )

    if "email" in data:
        new_email = data["email"].lower().strip()
        if new_email != current_user.email:
            existing_email = db.execute(
                select(User).where(
                    User.email == new_email,
                    User.id != current_user.id,
                )
            ).scalar_one_or_none()
            if existing_email:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Email already in use",
                )

            current_user.email = new_email
            current_user.is_email_verified = False
            current_user.refresh_token_version += 1
            should_send_verification_email = True

    if "password" in data:
        from app.security import hash_password

        current_user.password = hash_password(data["password"])
        current_user.refresh_token_version += 1

    if "streak" in data:
        current_user.streak = data["streak"]

    if "glucose" in data:
        current_user.glucose = data["glucose"]

    db.commit()
    db.refresh(current_user)

    if should_send_verification_email:
        send_verification_email(current_user)

    return current_user


@router.post("/me/plants", response_model=UserRead)
def add_plant_me(
    payload: PlantsAdd,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
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
    current_user: User = Depends(get_current_verified_user),
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
    current_user: User = Depends(get_current_verified_user),
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
