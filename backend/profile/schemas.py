from pydantic import EmailStr
from typing import Optional
from uuid import UUID
from fastapi_users import schemas

class UserProfile(schemas.BaseModel):
    id: UUID
    name: str
    email: EmailStr

class UpdateName(schemas.BaseModel):
    name: str

class UpdateEmail(schemas.BaseModel):
    email: EmailStr

class UpdatePassword(schemas.BaseModel):
    password: str
    
class Project(schemas.BaseModel):
    pid: UUID
    name: str
    date_created: str
    circuit: dict
    verilog: str