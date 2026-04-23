import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.modules.payments.schemas import PaymentResponse

class LeaseBase(BaseModel):
    tenant_id: uuid.UUID
    property_id: uuid.UUID
    start_date: datetime
    end_date: datetime
    monthly_rent: int
    due_day: int = 1
    status: str = "ACTIVE"

class LeaseCreate(LeaseBase):
    request_id: uuid.UUID | None = None

class LeaseUpdate(BaseModel):
    end_date: datetime | None = None
    monthly_rent: int | None = None
    status: str | None = None
    next_payment_date: datetime | None = None

class LeaseResponse(LeaseBase):
    id: uuid.UUID
    request_id: uuid.UUID | None = None
    next_payment_date: datetime | None = None
    created_at: datetime
    
    # Metadata for frontend
    property_title: str | None = None
    property_image: str | None = None
    tenant_name: str | None = None
    
    # Financial Ledger
    payments: list[PaymentResponse] = []
    
    model_config = ConfigDict(from_attributes=True)
