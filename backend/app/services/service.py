from typing import Optional
from sqlalchemy.orm import Session

from app.db.models.service import Service
from app.repositories.service_repository import ServiceRepository
from app.schemas.admin_service import (
    CreateServiceRequest,
    UpdateServiceRequest,
)


class ServiceService:

    def __init__(self, db: Session):
        self.repository = ServiceRepository(db)

    def get_active_services(self):
        return self.repository.get_active_services()

    def get_all_services(self):
        return self.repository.get_all_services()

    def create_service(
        self,
        request: CreateServiceRequest,
    ) -> Service:

        service = Service(
            name=request.name,
            description=request.description,
            price=request.price,
            duration_minutes=request.duration_minutes,
            is_active=True,
        )

        return self.repository.create(service)

    def update_service(
        self,
        service_id: int,
        request: UpdateServiceRequest,
    ) -> Optional[Service]:

        service = self.repository.get_by_id(service_id)

        if not service:
            return None

        if request.name is not None:
            service.name = request.name

        if request.description is not None:
            service.description = request.description

        if request.price is not None:
            service.price = request.price

        if request.duration_minutes is not None:
            service.duration_minutes = request.duration_minutes

        if request.is_active is not None:
            service.is_active = request.is_active

        return self.repository.update(service)