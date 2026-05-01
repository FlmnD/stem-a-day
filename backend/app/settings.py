from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str

    APP_BASE_URL: str = "http://localhost:3000"

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRES_MINUTES: int = 60
    JWT_REFRESH_TOKEN_EXPIRES_DAYS: int = 30
    EMAIL_VERIFICATION_TOKEN_EXPIRES_MINUTES: int = 60 * 24
    PASSWORD_RESET_TOKEN_EXPIRES_MINUTES: int = 60

    EMAIL_FROM: str = "STEM a Day <no-reply@stemaday.local>"
    SMTP_HOST: str | None = None
    SMTP_PORT: int = 587
    SMTP_USERNAME: str | None = None
    SMTP_PASSWORD: str | None = None
    SMTP_USE_TLS: bool = True
    SMTP_USE_SSL: bool = False
    SMTP_TIMEOUT_SECONDS: int = 10

    model_config = SettingsConfigDict(extra="ignore")


settings = Settings()
