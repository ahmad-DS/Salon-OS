from app.core.security import hash_password
from app.db.database import SessionLocal
from app.db.models.admin import Admin


def create_admin():
    db = SessionLocal()

    try:
        email = "owner@salon.com"

        existing = (
            db.query(Admin)
            .filter(Admin.email == email)
            .first()
        )

        if existing:
            print("Admin already exists.")
            return

        admin = Admin(
            name="Salon Owner",
            email=email,
            password_hash=hash_password("ChangeMe123!"),
        )

        db.add(admin)
        db.commit()

        print("Admin created successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    create_admin()