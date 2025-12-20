from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "RentWise API"
    database_url: str = "sqlite:///./rentwise.db"


settings = Settings()