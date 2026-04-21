from sqlalchemy.orm import Session
from app.core.security import hash_password, verify_password, create_access_token
from app.core.config import settings
from app.modules.auth.enums import UserRole
import uuid
from google.oauth2 import id_token
from google.auth.transport import requests
from app.modules.auth.model import User
from app.modules.auth.repository import UserRepository

class AuthService:
    def __init__(self) -> None:
        self.repo = UserRepository()

    def register(self, db: Session, role: str, full_name: str, email: str, phone: str | None, password: str) -> User:
        existing = self.repo.get_by_email(db, email)
        if existing:
            raise ValueError("Email already registered")

        # Airbnb Style: Everyone is both an owner and a tenant
        user = User(
            is_owner=True,
            is_tenant=True,
            full_name=full_name,
            email=email,
            phone=phone,
            password_hash=hash_password(password),
            is_verified=False,
        )
        return self.repo.create(db, user)

    def login(self, db: Session, email: str, password: str) -> str:
        user = self.repo.get_by_email(db, email)
        if not user:
            raise ValueError("ACCOUNT_NOT_FOUND")
        
        if not verify_password(password, user.password_hash):
            raise ValueError("INCORRECT_PASSWORD")

        # subject is user id as string
        subject = str(user.id)
        return create_access_token(subject=subject)

    def reset_password(self, db: Session, email: str, new_password: str):
        user = self.repo.get_by_email(db, email)
        if not user:
            raise ValueError("User not found")
        
        user.password_hash = hash_password(new_password)
        self.repo.create(db, user) # Repository.create uses db.add and commit, which works for updates too in this repo structure

    def google_login(self, db: Session, id_token_str: str, role: str | None = None) -> str:
        try:
            # 1. Verify Google ID Token
            id_info = id_token.verify_oauth2_token(
                id_token_str, requests.Request(), settings.google_client_id
            )

            email = id_info.get("email")
            full_name = id_info.get("name", "")

            if not email:
                raise ValueError("INVALID_GOOGLE_TOKEN")

            # 2. Check if user exists
            user = self.repo.get_by_email(db, email)

            if not user:
                # Airbnb Style: Everyone is both an owner and a tenant
                # We generate a random password because traditional login might still be used 
                random_pass = str(uuid.uuid4())
                user = User(
                    is_owner=True,
                    is_tenant=True,
                    full_name=full_name,
                    email=email,
                    password_hash=hash_password(random_pass),
                    is_verified=True, # Google verified account
                )
                user = self.repo.create(db, user)

            # 3. Create Access Token
            return create_access_token(subject=str(user.id))

        except ValueError as e:
            raise e
        except Exception as e:
            print(f"Google Auth Error: {e}")
            raise ValueError("GOOGLE_AUTH_FAILED")
