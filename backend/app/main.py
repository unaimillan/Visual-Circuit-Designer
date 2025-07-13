from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, APIRouter
from fastapi_users import FastAPIUsers
from pymongo.errors import DuplicateKeyError
from starlette.responses import JSONResponse

from ..app.schema import UserCreate, UserRead, UserUpdate
from ..app.models import UserDB
from ..app.db import user_collection
from ..app.users.mongo_users import MongoUserDatabase
from ..app.users.manager import MyUserManager, auth_backend
from uuid import UUID

user_db = MongoUserDatabase(user_collection)

async def get_user_db():
    yield user_db

async def get_user_manager(db=Depends(get_user_db)):
    yield MyUserManager(db)

fastapi_users = FastAPIUsers[UserDB, UUID](
    get_user_manager,
    [auth_backend],
)

app = FastAPI()
router = APIRouter()

@app.exception_handler(DuplicateKeyError)
async def mongo_duplicate_handler(request, exc):
    detail = "Duplicate key error"
    if "email" in str(exc):
        detail = "Email already exists"
    if "username" in str(exc):
        detail = "Username already exists"
    return JSONResponse(
        status_code=400,
        content={"detail": detail},
    )

app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"]
)

app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"]
)

app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"]
)

async def create_indexes():
    await user_collection.create_index("email", unique=True)
    await user_collection.create_index("username", unique=True)

@asynccontextmanager
async def startup():
    await create_indexes()