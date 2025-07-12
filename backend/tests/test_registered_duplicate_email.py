import pytest
from fastapi import status


@pytest.mark.asyncio
async def test_register_duplicate_email(test_client, registered_user):
    _, user = registered_user
    response = await test_client.post("/auth/register", json={
        "name": "Duplicate User",
        "username": "duplicate",
        "email": user["email"],  # Same email
        "password": "AnotherPassword123"
    })

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "email" in response.json()["detail"]