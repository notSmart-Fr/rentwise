from pydantic import BaseModel, Field

class PropertyCreateRequest(BaseModel):
    title: str = Field(min_length=3, max_length=120)
    description: str | None = Field(default=None, max_length=1000)
    city: str = Field(min_length=2, max_length=80)
    area: str = Field(min_length=2, max_length=80)
    address_text: str | None = Field(default=None, max_length=255)
    rent_amount: int = Field(ge=0)
    bedrooms: int | None = Field(default=None, ge=0)
    bathrooms: int | None = Field(default=None, ge=0)

class PropertyUpdateRequest(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=120)
    description: str | None = Field(default=None, max_length=1000)
    city: str | None = Field(default=None, min_length=2, max_length=80)
    area: str | None = Field(default=None, min_length=2, max_length=80)
    address_text: str | None = Field(default=None, max_length=255)
    rent_amount: int | None = Field(default=None, ge=0)
    bedrooms: int | None = Field(default=None, ge=0)
    bathrooms: int | None = Field(default=None, ge=0)

class AvailabilityRequest(BaseModel):
    is_available: bool

class PropertyResponse(BaseModel):
    id: str
    owner_id: str
    title: str
    description: str | None
    city: str
    area: str
    address_text: str | None
    rent_amount: int
    bedrooms: int | None
    bathrooms: int | None
    is_available: bool