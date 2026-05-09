from logging.config import fileConfig
import os
import sys

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# 1. 우리의 app 폴더를 경로에 추가
sys.path.append(os.path.join(os.getcwd()))

# 2. 우리의 모델과 Base를 임포트
from app.database import Base, SQLALCHEMY_DATABASE_URL
from app.models.analysis import Analysis  # 모델을 여기에 등록해야 인식함

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# 3. database.py와 동일한 절대경로 DB URL 사용 (상대경로 버그 방지)
config.set_main_option("sqlalchemy.url", SQLALCHEMY_DATABASE_URL)

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# 4. 우리의 메타데이터 설정 (자동 생성용)
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "pyformat"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
