from fastapi import Depends, HTTPException, Header
import httpx

async def get_current_user_id(authorization: str = Header(...)) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    token = authorization.removeprefix("Bearer ").strip()

    async with httpx.AsyncClient() as client:
        response = await client.get("http://auth-backend:8000/auth/verify", headers={"Authorization": f"Bearer {token}"})

    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return response.json().get("user_id")