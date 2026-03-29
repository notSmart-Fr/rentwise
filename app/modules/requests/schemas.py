from pydantic import BaseModel, Field

class RequestCreate(BaseModel):
    message: str | None = Field(default=None, max_length=500)

class RequestResponse(BaseModel):
    id: str
    property_id: str
    tenant_id: str
    owner_id: str
    status: str
    message: str | None
