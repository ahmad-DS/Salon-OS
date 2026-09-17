from datetime import date, datetime, time, timedelta

from sqlalchemy.orm import Session

from app.repositories.availability_repository import AvailabilityRepository
from app.repositories.service_repository import ServiceRepository
from app.schemas.availability import (
    AvailabilityResponse,
    AvailabilitySlot,
)


SALON_OPEN_TIME = time(10, 0)
SALON_CLOSE_TIME = time(20, 0)
SLOT_INTERVAL_MINUTES = 30


class AvailabilityService:
    def __init__(self, db: Session):
        self.service_repository = ServiceRepository(db)
        self.availability_repository = AvailabilityRepository(db)

    def get_availability(
        self,
        service_id: int,
        appointment_date: date,
    ) -> AvailabilityResponse:

        # 1. Find service
        service = self.service_repository.get_by_id(service_id)

        if not service:
            raise ValueError("Service not found")

        if not service.is_active:
            raise ValueError("Service is no longer available")

        # 2. Get existing appointments
        appointments = (
            self.availability_repository
            .get_appointments_for_date(appointment_date)
        )

        # 3. Generate slots
        slots = []

        current_start = datetime.combine(
            appointment_date,
            SALON_OPEN_TIME,
        )

        salon_close = datetime.combine(
            appointment_date,
            SALON_CLOSE_TIME,
        )

        while True:
            current_end = current_start + timedelta(
                minutes=service.duration_minutes
            )

            # Service must finish before/at salon closing time
            if current_end > salon_close:
                break

            start_time = current_start.time()
            end_time = current_end.time()

            # 4. Check overlap
            available = True

            for appointment in appointments:

                if (
                    appointment.start_time < end_time
                    and appointment.end_time > start_time
                ):
                    available = False
                    break

            slots.append(
                AvailabilitySlot(
                    start_time=start_time,
                    end_time=end_time,
                    available=available,
                )
            )

            # Move to next 30-minute start time
            current_start += timedelta(
                minutes=SLOT_INTERVAL_MINUTES
            )

        return AvailabilityResponse(
            date=appointment_date,
            service_id=service.id,
            service_name=service.name,
            duration_minutes=service.duration_minutes,
            slots=slots,
        )