from app.db.database import SessionLocal
from app.db.models.service import Service


services = [
    Service(
        name="Classic Haircut",
        description="Classic men's haircut and styling",
        price=300,
        duration_minutes=30,
    ),
    Service(
        name="Haircut + Beard",
        description="Haircut with beard trimming and styling",
        price=500,
        duration_minutes=45,
    ),
    Service(
        name="Hair Spa",
        description="Deep conditioning and hair treatment",
        price=800,
        duration_minutes=60,
    ),
    Service(
        name="Beard Styling",
        description="Beard trimming and styling",
        price=200,
        duration_minutes=20,
    ),
]


def seed():
    db = SessionLocal()

    try:
        existing = db.query(Service).count()

        if existing > 0:
            print("Services already exist.")
            return

        db.add_all(services)
        db.commit()

        print("Services seeded successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    seed()