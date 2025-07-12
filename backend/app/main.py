from fastapi import FastAPI, Depends
from fastapi_users import FastAPIUsers
from ..app.schema import UserCreate, UserRead, UserUpdate
from ..app.models import UserDB
from ..app.db import user_collection
from ..app.users.mongo_users import MongoUserDatabase
from ..app.users.manager import MyUserManager, auth_backend, get_jwt_strategy
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
    fastapi_users.get_users_router(UserRead, UserUpdate, UserDB),
    prefix="/users",
    tags=["users"]
)