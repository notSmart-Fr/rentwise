from pydantic import BaseModel, Field

class PaymentCreateRequest(BaseModel):
    amount: int = Field(ge=0)
    method: str = Field(pattern="^(CASH|BKASH|NAGAD|BANK)$")
    reference: str | None = Field(default=None, max_length=100)
    status: str = Field(default="PAID", pattern="^(PENDING|PAID)$")

class PaymentResponse(BaseModel):
    id: str
    request_id: str
    owner_id: str
    tenant_id: str
    amount: int
    method: str
    reference: str | None
    status: str

class PaymentUpdateRequest(BaseModel):
    amount: int | None = Field(default=None, gt=0)
    method: str | None = Field(default=None, pattern="^(CASH|BKASH|NAGAD|BANK)$")
    reference: str | None = Field(default=None, max_length=100)
    status: str | None = Field(default=None, pattern="^(PENDING|PAID)$")
    