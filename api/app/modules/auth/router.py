import uuid
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi.security import OAuth2PasswordRequestForm
from app.persistence.deps import get_db
from app.core.security import decode_token
from app.modules.auth.schemas import RegisterRequest, LoginRequest, TokenResponse, MeResponse, GoogleLoginRequest
from app.modules.auth.service import AuthService
from app.modules.auth.model import User
from app.modules.auth.deps import oauth2_scheme, get_current_user
from app.core.security import decode_token, create_reset_token, decode_reset_token
from app.core.emails import send_password_reset_email
from app.core.config import settings
from app.modules.auth.schemas import UserUpdateSchema
from app.utils.storage import storage

router = APIRouter(prefix="/auth", tags=["auth"])

service = AuthService()

@router.post("/register", response_model=MeResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    try:
        user = service.register(db, payload.role, payload.full_name, payload.email, payload.phone, payload.password)
        return MeResponse(
            id=str(user.id),
            is_owner=user.is_owner,
            is_tenant=user.is_tenant,
            role="OWNER" if user.is_owner else "TENANT", # Legacy
            full_name=user.full_name,
            email=user.email,
            phone=user.phone,
            is_verified=user.is_verified,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))



@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    try:
        # Swagger calls this "username", we treat it as email
        token = service.login(db, form_data.username, form_data.password)
        return TokenResponse(access_token=token)
    except ValueError as e:
        # Use exact error code for frontend processing
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/google", response_model=TokenResponse)
def google_login(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    try:
        token = service.google_login(db, payload.id_token, payload.role)
        return TokenResponse(access_token=token)
    except ValueError as e:
        error_msg = str(e)
        if error_msg == "ROLE_REQUIRED":
            # 403 Forbidden is a good way to signal "More info needed"
            raise HTTPException(status_code=403, detail="ROLE_REQUIRED")
        raise HTTPException(status_code=401, detail=error_msg)

@router.post("/forgot-password")
def forgot_password(payload: dict, db: Session = Depends(get_db)):
    email = payload.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    
    # We check if user exists first to decide whether to send email
    # but for security we often return the same message.
    # However, since we are doing smart errors, we can be more open here or keep it generic.
    user = service.repo.get_by_email(db, email)
    if user:
        token = create_reset_token(email)
        reset_link = f"{settings.frontend_url}/reset-password?token={token}"
        send_password_reset_email(email, reset_link)
    
    # Return 200 even if email doesn't exist to prevent enumeration here 
    # (Smart errors are for login, forgot-password is best kept generic)
    return {"message": "If an account exists with this email, a reset link has been sent."}

@router.post("/reset-password")
def reset_password(payload: dict, db: Session = Depends(get_db)):
    token = payload.get("token")
    new_password = payload.get("password")
    if not token or not new_password:
        raise HTTPException(status_code=400, detail="Token and password are required")
    
    try:
        email = decode_reset_token(token)
        service.reset_password(db, email, new_password)
        return {"message": "Password updated successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me", response_model=MeResponse)
def me(current: User = Depends(get_current_user)):
    return MeResponse(
        id=str(current.id),
        is_owner=current.is_owner,
        is_tenant=current.is_tenant,
        role="OWNER" if current.is_owner else "TENANT", # Legacy
        full_name=current.full_name,
        email=current.email,
        phone=current.phone,
        avatar_url=current.avatar_url,
        is_verified=current.is_verified,
    )

@router.patch("/me", response_model=MeResponse)
def update_profile(payload: UserUpdateSchema, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    user = service.update_profile(db, current.id, payload.model_dump(exclude_unset=True))
    return MeResponse(
        id=str(user.id),
        is_owner=user.is_owner,
        is_tenant=user.is_tenant,
        role="OWNER" if user.is_owner else "TENANT",
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        avatar_url=user.avatar_url,
        is_verified=user.is_verified,
    )

@router.post("/avatar")
async def upload_avatar(file: UploadFile = File(...), db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    # 1. Upload to storage
    avatar_url = await storage.upload(file, folder="avatars")
    
    # 2. Update user record
    service.update_profile(db, current.id, {"avatar_url": avatar_url})
    
    return {"avatar_url": avatar_url}

@router.post("/verify")
async def request_verification(
    doc_type: str = Form(...), 
    file: UploadFile = File(...), 
    db: Session = Depends(get_db), 
    current: User = Depends(get_current_user)
):
    # 1. Upload document
    doc_url = await storage.upload(file, folder="verifications")
    
    # 2. Create request
    req = service.create_verification_request(db, current.id, doc_type, doc_url)
    
    return {"status": "PENDING", "request_id": str(req.id)}

@router.get("/verify/status")
def check_verification_status(
    db: Session = Depends(get_db), 
    current: User = Depends(get_current_user)
):
    req = service.get_verification_status(db, current.id)
    if not req:
        return {"status": "NONE"}
    
    return {
        "status": req.status,
        "submitted_at": req.submitted_at.isoformat(),
        "notes": req.reviewer_notes
    }


