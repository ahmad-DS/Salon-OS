from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_admin
from app.db.dependencies import get_db
from app.db.models.admin import Admin
from app.schemas.appointment import (
    AdminAppointmentResponse,
    AppointmentResponse,
    UpdateAppointmentStatusRequest,
)
from app.services.appointment_service import AppointmentService


router = APIRouter(
    prefix="/api/admin/appointments",
    tags=["Admin - Appointments"],
)

@router.get(
    "",
    response_model=list[AdminAppointmentResponse],
)
def get_admin_appointments(
    date: date,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = AppointmentService(db)

    return service.get_admin_appointments(date)


@router.patch(
    "/{appointment_id}/status",
    response_model=AppointmentResponse,
)
def update_appointment_status(
    appointment_id: int,
    request: UpdateAppointmentStatusRequest,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = AppointmentService(db)

    try:
        return service.update_appointment_status(
            appointment_id=appointment_id,
            new_status=request.status,
        )

    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )