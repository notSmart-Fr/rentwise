import uuid
from datetime import date
from pydantic import BaseModel, ConfigDict
class LeaseCreateSchema(BaseModel):
    tenant_id: uuid.UUID
    property_id: uuid.UUID
    start_date: date
    end_date: date
    monthly_rent: int
class LeaseUpdateSchema(BaseModel):
    start_date: date | None = None
    end_date: date | None = None
    monthly_rent: int | None = None
class LeaseResponseSchema(BaseModel):
    id: uuid.UUID
    tenant_id: uuid.UUID
    property_id: uuid.UUID
    start_date: date
    end_date: date
    monthly_rent: int
    
    model_config = ConfigDict(from_attributes=True)
