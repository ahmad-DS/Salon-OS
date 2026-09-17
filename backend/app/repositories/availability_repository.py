from datetime import date, time

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models.appointment import Appointment


class AvailabilityRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_appointments_for_date(
        self,
        appointment_date: date,
    ) -> list[Appointment]:

        statement = (
            select(Appointment)
            .where(
                Appointment.appointment_date == appointment_date,
                Appointment.status != "cancelled",
            )
            .order_by(Appointment.start_time)
        )

        return list(self.db.scalars(statement))