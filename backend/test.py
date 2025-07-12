from datetime import datetime, timedelta, timezone
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import Column, Integer, String, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from jose import JWTError, jwt

# === Settings ===
DATABASE_URL = "postgresql://user:password@localhost:5432/mydb"
SECRET_KEY = "YOUR_SECRET_KEY"  # замените на надёжный ключ
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# === Database ===
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
app = FastAPI()


# === Models ===
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)


class TokenBlacklist(Base):
    __tablename__ = "token_blacklist"
    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, unique=True, index=True, nullable=False)
    blacklisted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc).replace(tzinfo=None))
    expires_at = Column(DateTime, nullable=False)


# === Schemas ===
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


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class VerifyResponse(BaseModel):
    valid: bool
    email: str | None = None


# === Dependency ===
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# === Utilities ===
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_token(data: dict, expires_delta: timedelta) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])


def is_token_blacklisted(token: str, db: Session) -> bool:
    """Check if token is in blacklist"""
    blacklisted_token = db.query(TokenBlacklist).filter_by(token=token).first()
    if blacklisted_token:
        # Check if blacklisted token has expired (cleanup)
        # Convert to naive datetime for comparison with database
        current_time = datetime.now(timezone.utc).replace(tzinfo=None)
        if blacklisted_token.expires_at < current_time:
            db.delete(blacklisted_token)
            db.commit()
            return False
        return True
    return False


def add_token_to_blacklist(token: str, db: Session):
    """Add token to blacklist"""
    try:
        payload = decode_token(token)
        exp_timestamp = payload.get("exp")
        if exp_timestamp:
            expires_at = datetime.fromtimestamp(exp_timestamp, tz=timezone.utc).replace(tzinfo=None)
        else:
            # If no exp claim, set a reasonable expiration
            expires_at = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=1)

        blacklist_entry = TokenBlacklist(
            token=token,
            expires_at=expires_at
        )
        db.add(blacklist_entry)
        db.commit()
    except JWTError:
        # If token is invalid, still add it to blacklist with short expiration
        blacklist_entry = TokenBlacklist(
            token=token,
            expires_at=datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(hours=1)
        )
        db.add(blacklist_entry)
        db.commit()


def verify_token_not_blacklisted(token: str, db: Session):
    """Verify token is not blacklisted, raise exception if it is"""
    if is_token_blacklisted(token, db):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been invalidated",
            headers={"WWW-Authenticate": "Bearer"}
        )


# === Registration ===
@app.post(
    "/api/auth/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter_by(email=user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists"
        )
    user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        password_hash=hash_password(user_in.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# === Login ===
@app.post(
    "/api/auth/login",
    response_model=Token
)
def login(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(get_db)
):
    user = db.query(User).filter_by(email=form_data.username).first()
    if not user or not verify_password(
            form_data.password,
            user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    access_token = create_token(
        data={"sub": user.email, "type": "access"},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    refresh_token = create_token(
        data={"sub": user.email, "type": "refresh"},
        expires_delta=timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }


# === Token Refresh ===
@app.post(
    "/api/auth/refresh",
    response_model=Token,
    status_code=status.HTTP_200_OK
)
def refresh_token(
        refresh_request: RefreshTokenRequest,
        db: Session = Depends(get_db)
):
    """Refresh access token using refresh token"""
    try:
        # Verify refresh token is not blacklisted
        verify_token_not_blacklisted(refresh_request.refresh_token, db)

        # Decode and validate refresh token
        payload = decode_token(refresh_request.refresh_token)
        email: str = payload.get("sub")
        token_type: str = payload.get("type")

        if not email or token_type != "refresh":
            raise JWTError("Invalid token type")

        # Verify user exists
        user = db.query(User).filter_by(email=email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Add current refresh token to blacklist
        add_token_to_blacklist(refresh_request.refresh_token, db)

        # Generate new tokens
        new_access_token = create_token(
            data={"sub": user.email, "type": "access"},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        new_refresh_token = create_token(
            data={"sub": user.email, "type": "refresh"},
            expires_delta=timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        )

        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token
        }

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
            headers={"WWW-Authenticate": "Bearer"}
        )


# === Token Verification ===
@app.post(
    "/api/auth/verify",
    response_model=VerifyResponse,
    status_code=status.HTTP_200_OK
)
def verify(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        # Check if token is blacklisted
        verify_token_not_blacklisted(token, db)

        payload = decode_token(token)
        email: str = payload.get("sub")
        token_type: str = payload.get("type")

        if not email or token_type != "access":
            raise JWTError("Invalid token type")

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return {"valid": True, "email": email}


# === Protected Endpoint Example ===
@app.get(
    "/api/auth/me",
    response_model=UserResponse
)
def read_users_me(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
):
    try:
        # Check if token is blacklisted
        verify_token_not_blacklisted(token, db)

        payload = decode_token(token)
        email: str = payload.get("sub")
        token_type: str = payload.get("type")

        if not email or token_type != "access":
            raise JWTError("Invalid token type")

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )

    user = db.query(User).filter_by(email=email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


# === Logout (Optional) ===
@app.post(
    "/api/auth/logout",
    status_code=status.HTTP_200_OK
)
def logout(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
):
    """Logout user by blacklisting current access token"""
    try:
        # Verify token format
        payload = decode_token(token)
        email: str = payload.get("sub")
        if not email:
            raise JWTError("Invalid token")

        # Add token to blacklist
        add_token_to_blacklist(token, db)

        return {"message": "Successfully logged out"}

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"}
        )


# === Cleanup expired blacklisted tokens (optional background task) ===
@app.post("/api/auth/cleanup-tokens")
def cleanup_expired_tokens(db: Session = Depends(get_db)):
    """Remove expired tokens from blacklist"""
    # Convert to naive datetime for database comparison
    current_time = datetime.now(timezone.utc).replace(tzinfo=None)
    expired_tokens = db.query(TokenBlacklist).filter(
        TokenBlacklist.expires_at < current_time
    ).all()

    for token in expired_tokens:
        db.delete(token)

    db.commit()
    return {"message": f"Cleaned up {len(expired_tokens)} expired tokens"}


# === Initialize DB Tables ===
if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000
    )