import base64
import json

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

def decode_jwt(token: str):
    try:
        payload_part = token.split('.')[1]
        padded = payload_part + '=' * (-len(payload_part) % 4)
        decoded_bytes = base64.urlsafe_b64decode(padded)
        payload = json.loads(decoded_bytes)
        return payload
    except Exception as e:
        raise ValueError(f"Invalid token format: {e}")