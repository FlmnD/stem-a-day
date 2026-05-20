from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, update
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_verified_user
from app.email_verification import send_verification_email
from app.game_rewards import GAME_REWARD_GLUCOSE
from app.models import User, UserPlant
from app.schemas.game_reward import GameRewardClaimIn, GameRewardClaimOut
from app.schemas.user import GlucoseAdd, PlantsAdd, UserRead, UserUpdate
from app.streaks import get_effective_streak, get_last_streak_activity_on, get_next_streak_after_activity

router = APIRouter(prefix="/users", tags=["users"])


def build_user_read(db: Session, user: User) -> UserRead:
    plant_ids = db.execute(
        select(UserPlant.plant_id)
        .where(UserPlant.user_id == user.id)
        .order_by(UserPlant.acquired_at.asc())
    ).scalars().all()

    payload = UserRead.model_validate(user).model_dump()
    payload["streak"] = get_effective_streak(
        user,
        datetime.now(timezone.utc).date(),
    )
    payload["plants"] = list(plant_ids)
    return UserRead(**payload)


@router.get("/me", response_model=UserRead)
def me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
):
    return build_user_read(db, current_user)


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

    if "streak" in data or "glucose" in data:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed to change streak or glucose directly",
        )

    db.commit()
    db.refresh(current_user)

    if should_send_verification_email:
        send_verification_email(current_user)

    return build_user_read(db, current_user)


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
    activity_date = datetime.now(timezone.utc).date()
    streak_incremented = get_last_streak_activity_on(current_user) != activity_date

    values: dict[str, object] = {
        "glucose": User.glucose + payload.amount,
    }
    if streak_incremented:
        values["streak"] = get_next_streak_after_activity(current_user, activity_date)
        values["last_streak_activity_on"] = activity_date

    stmt = update(User).where(User.id == current_user.id).values(**values)
    db.execute(stmt)
    db.commit()
    db.refresh(current_user)

    return build_user_read(db, current_user)


@router.post("/me/games/complete", response_model=GameRewardClaimOut)
def claim_game_reward(
    payload: GameRewardClaimIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
):
    reward_glucose = GAME_REWARD_GLUCOSE[payload.game_id]
    activity_date = datetime.now(timezone.utc).date()
    current_streak = get_effective_streak(current_user, activity_date)
    next_streak = get_next_streak_after_activity(current_user, activity_date)
    streak_incremented = get_last_streak_activity_on(current_user) != activity_date

    values: dict[str, object] = {
        "glucose": User.glucose + reward_glucose,
    }
    if streak_incremented:
        values["streak"] = next_streak
        values["last_streak_activity_on"] = activity_date

    stmt = (
        update(User)
        .where(User.id == current_user.id)
        .values(**values)
        .returning(User.glucose)
    )
    updated_glucose = db.execute(stmt).scalar_one_or_none()

    if updated_glucose is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not update the current user reward.",
        )

    db.commit()

    return GameRewardClaimOut(
        game_id=payload.game_id,
        reward_glucose=reward_glucose,
        glucose_balance=updated_glucose,
        streak=next_streak if streak_incremented else current_streak,
        streak_incremented=streak_incremented,
    )
