from fastapi import FastAPI
from app.core.config import settings

from app.db.session import engine
from app.db.base import Base

# IMPORTANT: import models so SQLAlchemy knows them
from app.modules.auth.model import User  # noqa: F401
from app.modules.properties.model import Property  # noqa: F401

from app.modules.auth.router import router as auth_router
from app.modules.properties.router import owner_router, public_router

app = FastAPI(title=settings.app_name)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(owner_router)
app.include_router(public_router)

@app.get("/")
def root():
    return {"message": "RentWise API is running. Visit /docs"}

@app.get("/health")
def health():
    return {"status": "ok"}