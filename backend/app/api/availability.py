from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.availability import AvailabilityResponse
from app.services.availability_service import AvailabilityService


router = APIRouter(
    prefix="/api/availability",
    tags=["Availability"],
)


@router.get("", response_model=AvailabilityResponse)
def get_availability(
    service_id: int,
    date: date,
    db: Session = Depends(get_db),
):
    service = AvailabilityService(db)

    try:
        return service.get_availability(
            service_id=service_id,
            appointment_date=date,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )