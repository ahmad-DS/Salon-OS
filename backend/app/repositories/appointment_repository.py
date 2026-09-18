from typing import Optional
from datetime import date, time

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models.appointment import Appointment
from app.db.models.customer import Customer
from app.db.models.service import Service


class AppointmentRepository:

    def __init__(self, db: Session):
        self.db = db

    def find_overlapping(
        self,
        appointment_date: date,
        start_time: time,
        end_time: time,
    ) -> Optional[Appointment]:

        statement = (
            select(Appointment)
            .where(
                Appointment.appointment_date == appointment_date,
                Appointment.status != "cancelled",
                Appointment.start_time < end_time,
                Appointment.end_time > start_time,
            )
        )

        return self.db.scalar(statement)

    def create(
        self,
        appointment: Appointment,
    ) -> Appointment:

        self.db.add(appointment)
        self.db.flush()

        return appointment


    def get_by_customer_phone(
        self,
        phone: str,
    ) -> list[tuple[Appointment, Service]]:
        statement = (
            select(Appointment, Service)
            .join(Customer, Appointment.customer_id == Customer.id)
            .join(Service, Appointment.service_id == Service.id)
            .where(Customer.phone == phone)
            .order_by(
                Appointment.appointment_date.desc(),
                Appointment.start_time.desc(),
            )
        )

        return list(self.db.execute(statement).all())