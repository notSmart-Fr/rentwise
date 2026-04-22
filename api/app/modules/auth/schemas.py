from pydantic import BaseModel, EmailStr, Field

from app.modules.auth.enums import UserRole

class RegisterRequest(BaseModel):
    role: UserRole
    full_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: str | None = None
    password: str = Field(min_length=6, max_length=72)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class MeResponse(BaseModel):
    id: str
    is_owner: bool
    is_tenant: bool
    role: str # For backward compatibility
    full_name: str
    email: EmailStr
    phone: str | None = None
    avatar_url: str | None = None
    is_verified: bool

class GoogleLoginRequest(BaseModel):
    id_token: str
    role: UserRole | None = None

class UserUpdateSchema(BaseModel):
    full_name: str | None = Field(None, min_length=2, max_length=100)
    phone: str | None = None
    # avatar_url is usually handled separately via upload endpoint
