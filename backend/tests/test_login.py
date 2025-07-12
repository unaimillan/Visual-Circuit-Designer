import pytest
from fastapi import status


@pytest.mark.asyncio
async def test_login_success(test_client, registered_user):
    user_data, user = registered_user

    # Используем form-data вместо json для OAuth2
    print("User in DB:", user)
    print("Attempting login with:", user_data["email"], user_data["password"])

    response = await test_client.post(
        "/auth/jwt/login",
        data={
            "username": user_data["email"],
            "password": user_data["password"]
        }
    )

    print("Response:", response.status_code, response.text)


    assert response.status_code == status.HTTP_200_OK
    print("Response:", response.text)
    print("Cookies:", response.cookies)
    assert "refresh_token" in response.cookies
