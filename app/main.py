from fastapi import FastAPI
from app.core.config import settings

app = FastAPI(title=settings.app_name)


@app.get("/")
def root():
    return {"message": "RentWise API is running. Visit /docs"}


@app.get("/health")
def health():
    return {"status": "ok"}