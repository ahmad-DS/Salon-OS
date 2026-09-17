from typing import Optional
from pydantic import BaseModel, Field


class CreateServiceRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    description: Optional[str] = None
    price: int = Field(gt=0)
    duration_minutes: int = Field(gt=0)


class UpdateServiceRequest(BaseModel):
    name: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    description: Optional[str] = None

    price: Optional[int] = Field(
        default=None,
        gt=0,
    )

    duration_minutes: Optional[int] = Field(
        default=None,
        gt=0,
    )

    is_active: Optional[bool] = None