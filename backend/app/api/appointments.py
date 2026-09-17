from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.appointment import (
    AppointmentResponse,
    CreateAppointmentRequest,
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