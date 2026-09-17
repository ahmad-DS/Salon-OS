from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_admin
from app.db.dependencies import get_db
from app.db.models.admin import Admin
from app.schemas.admin_service import (
    CreateServiceRequest,
    UpdateServiceRequest,
)
from app.schemas.service import ServiceResponse
from app.services.service import ServiceService


router = APIRouter(
    prefix="/api/admin/services",
    tags=["Admin - Services"],
)


@router.get(
    "",
    response_model=list[ServiceResponse],
)
def get_services(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = ServiceService(db)

    return service.get_all_services()


@router.post(
    "",
    response_model=ServiceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_service(
    request: CreateServiceRequest,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = ServiceService(db)

    return service.create_service(request)


@router.patch(
    "/{service_id}",
    response_model=ServiceResponse,
)
def update_service(
    service_id: int,
    request: UpdateServiceRequest,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = ServiceService(db)

    updated_service = service.update_service(
        service_id,
        request,
    )

    if not updated_service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found",
        )

    return updated_service