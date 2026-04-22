from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "RentWise API"
    database_url: str = "postgresql+psycopg://rentwise:rentwise@localhost:5432/rentwise"

    jwt_secret: str = "dev-secret-key-123"
    jwt_alg: str = "HS256"
    access_token_minutes: int = 60 * 24 * 30 # 30 Days

    # SMTP Settings (Gmail)
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 465
    
    # Frontend URL for links in emails
    frontend_url: str = "http://localhost:5173"

    google_client_id: str = ""
    
    # Storage Settings
    storage_type: str = "local" # local or gcs
    gcs_bucket: str = ""
    gcs_credentials: str = "" # Path to JSON or JSON string

    # CORS Settings
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"


    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
