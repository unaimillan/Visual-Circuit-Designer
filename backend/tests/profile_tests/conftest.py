import httpx
import pytest_asyncio

from backend.auth.main import app as auth_app
from backend.profile.main import app as profile_app
from backend.auth.db import user_collection


@pytest_asyncio.fixture
async def auth_client():
    transport = httpx.ASGITransport(app=auth_app)
    return httpx.AsyncClient(transport=transport, base_url="http://test")

@pytest_asyncio.fixture
async def profile_client():
    transport = httpx.ASGITransport(app=profile_app)
    return httpx.AsyncClient(transport=transport, base_url="http://test")

@pytest_asyncio.fixture(autouse=True)
async def cleanup(auth_client):
    await user_collection.delete_many({})
    yield
    await user_collection.delete_many({})
    await auth_client.aclose()

@pytest_asyncio.fixture
async def registered_user(auth_client):
    user_data = {
        "name": "Test User",
        "username": "testuser",
        "email": "test@example.com",
        "password": "TestPassword123"
    }
    response = await auth_client.post("/auth/register", json=user_data)
    assert response.status_code == 201

    return user_data, response.json()