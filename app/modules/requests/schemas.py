from datetime import datetime
from pydantic import BaseModel, Field

class RequestCreate(BaseModel):
    message: str | None = Field(default=None, max_length=500)

class RequestResponse(BaseModel):
    id: str
    property_id: str
    property_title: str | None = None
    tenant_id: str
    tenant_name: str | None = None
    tenant_email: str | None = None
    owner_id: str
    status: str
    message: str | None
    created_at: datetime
