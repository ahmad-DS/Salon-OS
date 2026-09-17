from typing import Optional
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models.service import Service


class ServiceRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_active_services(self) -> list[Service]:
        statement = (
            select(Service)
            .where(Service.is_active.is_(True))
            .order_by(Service.name)
        )

        return list(self.db.scalars(statement))

    def get_all_services(self) -> list[Service]:
        statement = (
            select(Service)
            .order_by(Service.name)
        )

        return list(self.db.scalars(statement))

    def get_by_id(self, service_id: int) -> Optional[Service]:
        statement = (
            select(Service)
            .where(Service.id == service_id)
        )

        return self.db.scalar(statement)

    def create(self, service: Service) -> Service:
        self.db.add(service)
        self.db.commit()
        self.db.refresh(service)

        return service

    def update(self, service: Service) -> Service:
        self.db.commit()
        self.db.refresh(service)

        return service