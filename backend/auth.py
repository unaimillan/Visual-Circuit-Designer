# auth.py или main.py

from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import Column, Integer, String, create_engine, select
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel, EmailStr, Field
from passlib.context import CryptContext

DATABASE_URL = "postgresql://user:password@localhost:5432/mydb"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
app = FastAPI()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str | None = None


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str | None

    class Config:
        orm_mode = True


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


@app.post("/api/auth/register", response_model=UserResponse, status_code=201)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # === вариант 1: filter_by ===
    existing = db.query(User).filter_by(email=user_in.email).first()
    # === вариант 2: Core-style select ===
    # stmt = select(User).where(User.email == user_in.email)
    # existing = db.execute(stmt).scalar_one_or_none()

    if existing:
        raise HTTPException(status_code=409, detail="User already exists")

    user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        password_hash=hash_password(user_in.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# Чтобы создать таблицы при первом запуске:
if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
