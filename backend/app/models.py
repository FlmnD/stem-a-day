from sqlalchemy.sql import func
from sqlalchemy import String, Integer, ForeignKey, TIMESTAMP, ARRAY, UniqueConstraint
from datetime import datetime
from sqlalchemy import ARRAY, TIMESTAMP, BigInteger, CheckConstraint, String, Boolean, Integer, func, text
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class User(Base):
    __tablename__ = "users"

    __table_args__ = (
        CheckConstraint(
            "char_length(username) BETWEEN 5 AND 20",
            name="ck_users_username_len",
        ),
        CheckConstraint(
            "username ~ '^[A-Za-z0-9](?:[A-Za-z0-9_-]{3,18})[A-Za-z0-9]$'",
            name="ck_users_username_format",
        ),
    )

    id: Mapped[int] = mapped_column(
        BigInteger, primary_key=True, autoincrement=True
    )

    email: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )

    # Password hash
    password: Mapped[str] = mapped_column(
        String(255), nullable=False
    )

    username: Mapped[str] = mapped_column(
        String(20),
        unique=True,
        index=True,
        nullable=False,
    )

    streak: Mapped[int] = mapped_column(
        Integer, nullable=False, default=0, server_default=text("0")
    )

    glucose: Mapped[int] = mapped_column(
        BigInteger, nullable=False, default=0, server_default=text("0")
    )

    is_email_verified: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False, server_default=text("false")
    )

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    last_login: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    plants: Mapped[list[str]] = mapped_column(
        ARRAY(String(64)),
        nullable=False,
        default=list,
        server_default=text("'{}'"),
    )


class Plant(Base):
    __tablename__ = "plants"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    image_url: Mapped[str | None] = mapped_column(String(512))


class UserPlant(Base):
    __tablename__ = "user_plants"

    user_id: Mapped[int] = mapped_column(ForeignKey(
        "users.id", ondelete="CASCADE"), primary_key=True)
    plant_id: Mapped[str] = mapped_column(ForeignKey(
        "plants.id", ondelete="RESTRICT"), primary_key=True)

    level: Mapped[int] = mapped_column(
        Integer, nullable=False, server_default="1")
    level_xp: Mapped[int] = mapped_column(
        Integer, nullable=False, server_default="0")

    accessories: Mapped[list[str]] = mapped_column(
        ARRAY(String(64)), nullable=False, server_default=text("'{}'")
    )

    acquired_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False, server_default=func.now()
    )

    __table_args__ = (
        UniqueConstraint("user_id", "plant_id", name="uq_user_plant"),
    )
