from sqlalchemy import select
from app.database import SessionLocal
from app.models import Plant

PLANTS = [
    Plant(id="fern", name="Emerald Fern", price=50, image_url=None),
    Plant(id="cactus", name="Golden Cactus", price=120, image_url=None),
    Plant(id="bonsai", name="Mini Bonsai", price=300, image_url=None),
]

db = SessionLocal()
try:
    existing = set(db.execute(select(Plant.id)).scalars().all())
    for p in PLANTS:
        if p.id not in existing:
            db.add(p)
    db.commit()
finally:
    db.close()

print("Seeded plants.")
