from uuid import UUID
from fastapi import APIRouter, HTTPException, Depends
from backend.auth.db import db, user_db
from backend.profile.schemas import UserProfile, UpdateName, UpdateEmail, UpdatePassword
from backend.profile.utils import get_current_user_id

router = APIRouter(prefix="/api/profile", tags=["profile"])

@router.get("/{id}")
async def get_profile(id: str):
    try:
        user = await user_db.get(UUID(id))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/{id}/name")
async def update_name(id: str, body: UpdateName): # user_id: str = Depends(get_current_user_id)):
    # if id != user_id:
    #     raise HTTPException(status_code=403, detail="You can only modify your own profile")
    user = await user_db.get(UUID(id))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.name = body.name
    await user_db.update(user)
    return {"status": "name updated"}

@router.patch("/{id}/email")
async def update_email(id: str, body: UpdateEmail):
    user = await user_db.get(UUID(id))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.email = body.email
    await user_db.update(user)
    return {"status": "email updated"}

@router.patch("/{id}/password")
async def update_password(id: str, body: UpdatePassword):
    # fastapi-users UserManager
    # return {"status": "password updated"}
    raise HTTPException(status_code=400, detail="Password not supported")

@router.delete("/{id}")
async def delete_profile(id: str):
    user = await user_db.get(UUID(id))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await user_db.delete(user)
    return {"status": "deleted"}