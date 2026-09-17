from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ServiceResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: int
    duration_minutes: int
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )