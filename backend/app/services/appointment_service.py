from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.db.models.appointment import Appointment
from app.db.models.customer import Customer
from app.repositories.appointment_repository import AppointmentRepository
from app.repositories.customer_repository import CustomerRepository
from app.repositories.service_repository import ServiceRepository
from app.schemas.appointment import CreateAppointmentRequest


class AppointmentService:

    def __init__(self, db: Session):
        self.db = db

        self.appointment_repository = (
            AppointmentRepository(db)
        )

        self.customer_repository = (
            CustomerRepository(db)
        )

        self.service_repository = (
            ServiceRepository(db)
        )

    def create_appointment(
        self,
        request: CreateAppointmentRequest,
    ):

        service = self.service_repository.get_by_id(
            request.service_id
        )

        if not service:
            raise ValueError("Service not found")

        if not service.is_active:
            raise ValueError(
                "Service is no longer available"
            )

        # Validate that appointment starts on a 30-minute boundary.
        if request.start_time.minute not in (0, 30):
            raise ValueError(
                "Appointment must start at 00 or 30 minutes"
            )

        start_datetime = datetime.combine(
            request.appointment_date,
            request.start_time,
        )

        end_datetime = (
            start_datetime
            + timedelta(minutes=service.duration_minutes)
        )

        end_time = end_datetime.time()

        if end_datetime.hour >= 20:
            raise ValueError(
                "Appointment extends beyond salon hours"
            )

        overlapping = (
            self.appointment_repository.find_overlapping(
                appointment_date=request.appointment_date,
                start_time=request.start_time,
                end_time=end_time,
            )
        )

        if overlapping:
            raise ValueError(
                "This time slot is no longer available"
            )

        customer = (
            self.customer_repository.get_by_phone(
                request.phone
            )
        )

        if not customer:
            customer = Customer(
                name=request.name,
                phone=request.phone,
            )

            self.customer_repository.create(customer)

        else:
            customer.name = request.name

        appointment = Appointment(
            customer_id=customer.id,
            service_id=service.id,
            appointment_date=request.appointment_date,
            start_time=request.start_time,
            end_time=end_time,
            status="pending",
            price_at_booking=service.price,
            duration_at_booking=service.duration_minutes,
        )

        self.appointment_repository.create(
            appointment
        )

        self.db.commit()
        self.db.refresh(appointment)

        return appointment