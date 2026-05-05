from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional, List
from pathlib import Path

# config.py 위치 기준으로 backend/.env 절대경로
_ENV_FILE = Path(__file__).resolve().parent.parent.parent / ".env"

class Settings(BaseSettings):
    PROJECT_NAME: str = "No-Click"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/analysis"

    # Gemini API 키 (쉼표로 구분해서 여러 개 입력 가능)
    # 예: GEMINI_API_KEYS=AIza111,AIza222,AIza333
    GEMINI_API_KEYS: str = ""

    CLAUDE_API_KEY: Optional[str] = None
    HUGGINGFACE_API_KEY: Optional[str] = None

    # AI 호출 안정화/성능 튜닝
    AI_MAX_INPUT_CHARS: int = 3000
    AI_REQUEST_TIMEOUT_SECONDS: int = 25
    AI_MAX_RETRIES: int = 2
    AI_RETRY_BASE_DELAY_SECONDS: float = 0.7
    AI_CONCURRENCY_LIMIT: int = 8
    AI_CACHE_TTL_SECONDS: int = 300
    GEMINI_KEY_COOLDOWN_SECONDS: int = 120

    DATABASE_URL: str = "sqlite:///./noclick.db"

    NAVER_CLIENT_ID: Optional[str] = None
    NAVER_CLIENT_SECRET: Optional[str] = None

    model_config = SettingsConfigDict(env_file=str(_ENV_FILE), case_sensitive=True, extra="ignore")

    @property
    def gemini_api_keys(self) -> List[str]:
        return [k.strip() for k in self.GEMINI_API_KEYS.split(",") if k.strip()]

settings = Settings()
