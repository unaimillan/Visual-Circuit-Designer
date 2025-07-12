import httpx
import pytest
from ..app.main import app
from ..app.db import user_collection


@pytest.mark.asyncio
async def test_register_user():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/auth/register", json={
            "name": "Test User",
            "username": "bruh",
            "email": "test@example.com",
            "password": "TestPassword123"
        })

    assert response.status_code == 201
    data = response.json()
    assert "id" in data

    user = await user_collection.find_one({"email": "test@example.com"})
    assert user is not None