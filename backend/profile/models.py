from uuid import UUID
from pydantic import BaseModel, EmailStr


class UserDB(BaseModel):
    id: UUID
    name: str
    username: str
    email: EmailStr
    hashed_password: str
    is_active: bool = True
    is_superuser: bool = False
    is_verified: bool = False