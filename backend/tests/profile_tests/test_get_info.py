import pytest
from fastapi import status

from backend.profile.main import app

@pytest.mark.asyncio
async def test_get_info(test_client, registered_user):
    user_data, user = registered_user

    print("Registered routes:")
    for route in app.routes:
        if hasattr(route, "path"):
            print(f"{route.path}")

    login_response = await test_client.post(
        "/auth/login",
        data={
            "username": user_data["email"],
            "password": user_data["password"]
        }
    )
    token = login_response.json().get("access_token")
    assert login_response.status_code == status.HTTP_200_OK

    response = await test_client.get(
        "/api/profile",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    print(response.json())