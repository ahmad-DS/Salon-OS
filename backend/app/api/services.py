from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.service import ServiceResponse
from app.services.service import ServiceService


router = APIRouter(
    prefix="/api/services",
    tags=["Services"],
)


@router.get(
    "",
    response_model=list[ServiceResponse],
)
def get_services(
    db: Session = Depends(get_db),
):
    service = ServiceService(db)

    return service.get_active_services()