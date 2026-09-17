from datetime import date, time

from pydantic import BaseModel


class AvailabilitySlot(BaseModel):
    start_time: time
    end_time: time
    available: bool


class AvailabilityResponse(BaseModel):
    date: date
    service_id: int
    service_name: str
    duration_minutes: int
    slots: list[AvailabilitySlot]