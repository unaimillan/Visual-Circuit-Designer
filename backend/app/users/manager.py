from uuid import UUID, uuid4
from fastapi_users.manager import BaseUserManager, UUIDIDMixin
from ..models import UserDB
from fastapi_users.authentication import JWTStrategy, AuthenticationBackend, CookieTransport
from ..config import SECRET
from ..schema import UserCreate


class MyUserManager(UUIDIDMixin, BaseUserManager[UserDB, UUID]):
    async def on_after_register(self, user: UserDB, request=None):
        print(f"User registered: {user}")

    async def create(self, user_create: UserCreate, safe: bool = False, request=None) -> UserDB:
        # Ensure all required fields are included
        user_id = uuid4()

        # Prepare user data
        user_dict = user_create.model_dump()
        user_dict["id"] = str(user_id)
        user_dict["hashed_password"] = self.password_helper.hash(user_create.password)

        user_dict["is_active"] = True
        user_dict["is_superuser"] = False
        user_dict["is_verified"] = False
        user_dict.pop("password", None)

        created_user = await self.user_db.create(user_dict)
        return await self.get(created_user["id"])

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=3600)

cookie_transport = CookieTransport(cookie_name="refresh_token", cookie_max_age=3600, cookie_secure=False)

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)