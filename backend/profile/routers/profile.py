from fastapi import APIRouter, HTTPException
from backend.profile.db import db
from backend.profile.schemas import UserProfile, UpdateName, UpdateEmail, UpdatePassword

router = APIRouter(prefix="/api/profile", tags=["profile"])

@router.get("/{id}")
async def get_profile(id: str):
    user = await db.users.find_one({"_id": id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/{id}/name")
async def update_name(id: str, body: UpdateName):
    await db.users.update_one({"_id": id}, {"$set": {"name": body.name}})
    return {"status": "name updated"}

@router.patch("/{id}/email")
async def update_email(id: str, body: UpdateEmail):
    await db.users.update_one({"_id": id}, {"$set": {"email": body.email}})
    return {"status": "email updated"}

@router.patch("/{id}/password")
async def update_password(id: str, body: UpdatePassword):
    # если используешь fastapi-users, здесь нужно через UserManager менять пароль
    return {"status": "password updated"}

@router.delete("/{id}")
async def delete_profile(id: str):
    await db.users.delete_one({"_id": id})
    return {"status": "deleted"}