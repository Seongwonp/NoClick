from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pathlib import Path
from app.core.config import settings

# database.py 기준으로 backend/ 폴더에 noclick.db 고정
_DB_PATH = Path(__file__).resolve().parent.parent / "noclick.db"
_DEFAULT_URL = f"sqlite:///{_DB_PATH}"

SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL if settings.DATABASE_URL != "sqlite:///./noclick.db" else _DEFAULT_URL

if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
