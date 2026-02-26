from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, update, delete
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import User, Plant, UserPlant

router = APIRouter(prefix="/plants", tags=["plants"])


def xp_needed_for_level(level: int) -> int:
    return 100 + (level - 1) * 50


def xp_cost_per_point(level: int) -> int:
    return 1 + (level - 1) // 3 


@router.get("/catalog")
def catalog(db: Session = Depends(get_db)):
    plants = db.execute(select(Plant).order_by(
        Plant.price.asc())).scalars().all()
    return plants


@router.get("/inventory")
def inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = db.execute(
        select(UserPlant, Plant)
        .join(Plant, Plant.id == UserPlant.plant_id)
        .where(UserPlant.user_id == current_user.id)
        .order_by(Plant.price.asc())
    ).all()

    out = []
    for up, p in rows:
        need = xp_needed_for_level(up.level)
        out.append({
            "plant_id": up.plant_id,
            "name": p.name,
            "price": p.price,
            "image_url": p.image_url,
            "level": up.level,
            "level_xp": up.level_xp,
            "xp_needed": need,
            "accessories": up.accessories,
            "acquired_at": up.acquired_at,
        })
    return out


@router.post("/buy/{plant_id}")
def buy_plant(
    plant_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plant = db.get(Plant, plant_id)
    if not plant:
        raise HTTPException(404, "Plant not found")

    owned = db.get(
        UserPlant, {"user_id": current_user.id, "plant_id": plant_id})
    if owned:
        raise HTTPException(409, "You already own this plant")

    if current_user.glucose < plant.price:
        raise HTTPException(400, "Not enough glucose")

    db.execute(
        update(User)
        .where(User.id == current_user.id)
        .values(glucose=User.glucose - plant.price)
    )

    db.add(UserPlant(user_id=current_user.id, plant_id=plant_id))
    db.commit()
    return {"ok": True}


@router.post("/{plant_id}/sell")
def sell_plant(
    plant_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plant = db.get(Plant, plant_id)
    if not plant:
        raise HTTPException(404, "Plant not found")

    owned = db.get(
        UserPlant, {"user_id": current_user.id, "plant_id": plant_id})
    if not owned:
        raise HTTPException(404, "You do not own this plant")

    db.execute(
        delete(UserPlant).where(
            UserPlant.user_id == current_user.id,
            UserPlant.plant_id == plant_id
        )
    )

    db.execute(
        update(User)
        .where(User.id == current_user.id)
        .values(glucose=User.glucose + plant.price)
    )

    db.commit()
    return {"ok": True, "refund": plant.price}


@router.post("/{plant_id}/upgrade")
def upgrade_plant(
    plant_id: str,
    payload: dict,  # {"spend": int}
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    spend = int(payload.get("spend", 0))
    if spend <= 0:
        raise HTTPException(400, "spend must be > 0")

    up = db.get(UserPlant, {"user_id": current_user.id, "plant_id": plant_id})
    if not up:
        raise HTTPException(404, "You do not own this plant")

    user = db.get(User, current_user.id)
    if user.glucose < spend:
        raise HTTPException(400, "Not enough glucose")

    cost_per_xp = xp_cost_per_point(up.level)
    gained_xp = spend // cost_per_xp
    if gained_xp <= 0:
        raise HTTPException(
            400,
            f"Spend too small. At level {up.level}, 1 XP costs {cost_per_xp} glucose."
        )

    used = gained_xp * cost_per_xp
    db.execute(
        update(User)
        .where(User.id == user.id)
        .values(glucose=User.glucose - used)
    )

    up.level_xp += gained_xp
    while up.level_xp >= xp_needed_for_level(up.level):
        up.level_xp -= xp_needed_for_level(up.level)
        up.level += 1

    db.commit()
    return {
        "ok": True,
        "used": used,
        "gained_xp": gained_xp,
        "level": up.level,
        "level_xp": up.level_xp,
        "xp_needed": xp_needed_for_level(up.level),
    }
