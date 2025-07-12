from fastapi_users.db.base import BaseUserDatabase
from ..models import UserDB
from motor.motor_asyncio import AsyncIOMotorCollection
from uuid import UUID, uuid4
from typing import Optional, Any, Coroutine


class MongoUserDatabase(BaseUserDatabase[UserDB, UUID]):
    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection

    async def get(self, id: UUID) -> Optional[UserDB]:
        user = await self.collection.find_one({"id": str(id)})
        return UserDB(**user) if user else None

    async def get_by_email(self, email: str) -> Optional[UserDB]:
        user = await self.collection.find_one({"email": email})
        return self._convert_to_userdb(dict(user)) if user else None

    async def create(self, user: dict) -> dict:
        if "id" not in user:
            print("[mongo_users] User does not have an ID, generating one...")
            user["id"] = str(uuid4())
        user.setdefault("is_active", True)
        user.setdefault("is_superuser", False)
        user.setdefault("is_verified", False)
        await self.collection.insert_one(user)
        return user

    async def update(self, user: UserDB) -> UserDB:
        await self.collection.replace_one({"id": str(user.id)}, user.dict())
        return user

    async def delete(self, user: UserDB) -> None:
        await self.collection.delete_one({"id": str(user.id)})

    async def _convert_to_userdb(self, user_dict: dict) -> UserDB:
        # Convert MongoDB document to UserDB
        user_dict["id"] = UUID(user_dict["id"]) if isinstance(user_dict.get("id"), str) else user_dict.get("id")
        return UserDB(**user_dict)