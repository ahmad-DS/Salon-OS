from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.appointment import (
    AppointmentResponse,
    CreateAppointmentRequest,
    CustomerAppointmentResponse
)
from app.services.appointment_service import (
    AppointmentService,
)


router = APIRouter(
    prefix="/api/appointments",
    tags=["Appointments"],
)


@router.post(
    "",
    response_model=AppointmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_appointment(
    request: CreateAppointmentRequest,
    db: Session = Depends(get_db),
):
    service = AppointmentService(db)

    try:
        return service.create_appointment(request)

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.get(
    "",
    response_model=list[CustomerAppointmentResponse],
)
def get_customer_appointments(
    phone: str,
    db: Session = Depends(get_db),
):
    service = AppointmentService(db)

    try:
        return service.get_customer_appointments(phone)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )