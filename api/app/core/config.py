from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "RentWise API"
    database_url: str = "sqlite:///./rentwise.db"

    jwt_secret: str
    jwt_alg: str = "HS256"
    access_token_minutes: int = 60 * 24

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
