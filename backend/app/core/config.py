from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # App Settings
    PROJECT_NAME: str = "No-Click"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/analysis"

    # AI Engines API Keys
    GEMINI_API_KEY: Optional[str] = None
    CLAUDE_API_KEY: Optional[str] = None
    EXAONE_API_KEY: Optional[str] = None

    # Database Settings
    DATABASE_URL: str = "sqlite:///./noclick.db"

    # Naver Blog Scraper Settings (Placeholder)
    NAVER_CLIENT_ID: Optional[str] = None
    NAVER_CLIENT_SECRET: Optional[str] = None

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

settings = Settings()
