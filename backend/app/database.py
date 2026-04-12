from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.settings import settings

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def bootstrap_database() -> None:
    Base.metadata.create_all(bind=engine)

    with engine.begin() as connection:
        inspector = inspect(connection)
        if "users" not in inspector.get_table_names():
            return

        user_columns = {column["name"] for column in inspector.get_columns("users")}
        if "is_email_verified" not in user_columns:
            connection.execute(
                text(
                    "ALTER TABLE users "
                    "ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN NOT NULL DEFAULT FALSE"
                )
            )

        if "refresh_token_version" not in user_columns:
            connection.execute(
                text(
                    "ALTER TABLE users "
                    "ADD COLUMN IF NOT EXISTS refresh_token_version INTEGER NOT NULL DEFAULT 0"
                )
            )

        if "daily_question_answered_on" not in user_columns:
            connection.execute(
                text(
                    "ALTER TABLE users "
                    "ADD COLUMN IF NOT EXISTS daily_question_answered_on DATE"
                )
            )

        if "daily_debug_offset_days" not in user_columns:
            connection.execute(
                text(
                    "ALTER TABLE users "
                    "ADD COLUMN IF NOT EXISTS daily_debug_offset_days INTEGER NOT NULL DEFAULT 0"
                )
            )

        if "daily_question_state" not in inspector.get_table_names():
            return

        state_columns = {
            column["name"] for column in inspector.get_columns("daily_question_state")
        }
        if "recent_question_indexes" not in state_columns:
            connection.execute(
                text(
                    "ALTER TABLE daily_question_state "
                    "ADD COLUMN IF NOT EXISTS recent_question_indexes INTEGER[] NOT NULL DEFAULT '{}'"
                )
            )

        if "debug_offset_days" not in state_columns:
            connection.execute(
                text(
                    "ALTER TABLE daily_question_state "
                    "ADD COLUMN IF NOT EXISTS debug_offset_days INTEGER NOT NULL DEFAULT 0"
                )
            )

        connection.execute(
            text(
                "INSERT INTO daily_question_state "
                "(id, effective_date, current_question_index, recent_question_indexes, debug_offset_days) "
                "VALUES (1, NULL, NULL, '{}', 0) "
                "ON CONFLICT (id) DO NOTHING"
            )
        )


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
