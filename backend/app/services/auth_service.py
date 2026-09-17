from typing import Optional
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.db.models.admin import Admin
from app.repositories.admin_repository import AdminRepository


class AuthService:

    def __init__(self, db: Session):
        self.repository = AdminRepository(db)

    def authenticate(
        self,
        email: str,
        password: str,
    ) -> Optional[str]:

        admin = self.repository.get_by_email(email)

        if not admin:
            return None

        if not verify_password(
            password,
            admin.password_hash,
        ):
            return None

        return create_access_token(admin.id)

    def create_admin(
        self,
        name: str,
        email: str,
        password: str,
    ) -> Admin:

        admin = Admin(
            name=name,
            email=email,
            password_hash=hash_password(password),
        )

        return self.repository.create(admin)