from sqlalchemy import String, Integer, text, Boolean
from sqlalchemy.dialects.postgresql import TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column, declarative_base
from sqlalchemy.sql.schema import Column

Base = declarative_base()


class User(Base):
    __tablename__ = "users"  # Изменяем на множественное число

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(50), nullable=False)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'), nullable=False)
    password_hash: Mapped[str] = mapped_column("password_hash", String(length=1024),
                                                 nullable=False)  # Сопоставление с БД
    salt: Mapped[str] = mapped_column(String(64), nullable=False)

    # @property
    # def is_active(self) -> bool:
    #     return True  # Все пользователи активны
    #
    # @property
    # def is_superuser(self) -> bool:
    #     return False  # Нет суперпользователей
    #
    # @property
    # def is_verified(self) -> bool:
    #     return True  # Считаем всех пользователей верифицированными
