from datetime import date, time

from pydantic import BaseModel, Field


class CreateAppointmentRequest(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=100,
    )

    phone: str = Field(
        min_length=10,
        max_length=20,
    )

    service_id: int = Field(
        gt=0,
    )

    appointment_date: date

    start_time: time

class AppointmentResponse(BaseModel):
    id: int

    customer_id: int
    service_id: int

    appointment_date: date

    start_time: time
    end_time: time

    status: str

    price_at_booking: int
    duration_at_booking: int

    model_config = {
        "from_attributes": True
    }

class CustomerAppointmentResponse(BaseModel):
    id: int
    service_id: int
    service_name: str
    appointment_date: date
    start_time: time
    end_time: time
    status: str
    price: int
    duration_minutes: int