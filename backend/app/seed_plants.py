from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Plant

PLANT_CATALOG: Sequence[dict[str, str | int | None]] = (
    {"id": "fern", "name": "Emerald Fern", "price": 50, "image_url": None},
    {"id": "cactus", "name": "Golden Cactus", "price": 120, "image_url": None},
    {"id": "bonsai", "name": "Mini Bonsai", "price": 300, "image_url": None},
)


def seed_plants(db: Session | None = None) -> int:
    owns_session = db is None
    session = db or SessionLocal()
    added = 0

    try:
        existing = set(session.execute(select(Plant.id)).scalars().all())
        for plant_data in PLANT_CATALOG:
            plant_id = str(plant_data["id"])
            if plant_id in existing:
                continue

            session.add(Plant(**plant_data))
            added += 1

        session.commit()
        return added
    finally:
        if owns_session:
            session.close()


if __name__ == "__main__":
    added = seed_plants()
    print(f"Seeded plants. Added {added} new plant(s).")
