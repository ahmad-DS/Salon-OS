from typing import Optional
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models.admin import Admin


class AdminRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str) -> Optional[Admin]:
        statement = (
            select(Admin)
            .where(Admin.email == email)
        )

        return self.db.scalar(statement)

    def get_by_id(self, admin_id: int) -> Optional[Admin]:
        statement = (
            select(Admin)
            .where(Admin.id == admin_id)
        )

        return self.db.scalar(statement)

    def create(self, admin: Admin) -> Admin:
        self.db.add(admin)
        self.db.commit()
        self.db.refresh(admin)

        return admin