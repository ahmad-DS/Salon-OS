from typing import Optional
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models.customer import Customer


class CustomerRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_by_phone(self, phone: str) -> Optional[Customer]:
        statement = (
            select(Customer)
            .where(Customer.phone == phone)
        )

        return self.db.scalar(statement)

    def create(self, customer: Customer) -> Customer:
        self.db.add(customer)
        self.db.flush()

        return customer