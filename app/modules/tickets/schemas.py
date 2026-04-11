import uuid
from datetime import datetime
from pydantic import BaseModel, Field

class TicketBase(BaseModel):
    title: str = Field(..., max_length=200)
    priority: str = Field(default="LOW", max_length=20)

class TicketCreate(TicketBase):
    property_id: uuid.UUID
    initial_message: str = Field(..., min_length=1, max_length=1000)

class TicketUpdateStatus(BaseModel):
    status: str = Field(..., max_length=20)

class TicketResponse(TicketBase):
    id: uuid.UUID
    tenant_id: uuid.UUID
    property_id: uuid.UUID
    owner_id: uuid.UUID
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
