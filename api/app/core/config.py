from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "RentWise API"
    database_url: str = "sqlite:///./rentwise.db"

    jwt_secret: str
    jwt_alg: str = "HS256"
    access_token_minutes: int = 60 * 24

    # SMTP Settings (Gmail)
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 465
    
    # Frontend URL for links in emails
    frontend_url: str = "http://localhost:5173"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
