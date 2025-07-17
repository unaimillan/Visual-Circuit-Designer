import pytest
from fastapi import status


@pytest.mark.asyncio
async def test_get_info(auth_client, registered_user, profile_client):
    user_data, user = registered_user

    login_response = await auth_client.post(
        "/auth/login",
        data={
            "username": user_data["email"],
            "password": user_data["password"]
        }
    )
    token = login_response.json().get("access_token")
    assert login_response.status_code == status.HTTP_200_OK

    verify_response = await auth_client.get(
        "/auth/verify",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert verify_response.status_code == status.HTTP_200_OK
    id = verify_response.json()["user_id"]
    assert verify_response.json()["email"] == user_data["email"]

    response = await profile_client.get(
        f"/api/profile/{id}",
        headers={"Authorization": f"Bearer {token}"}
    )

    print(response.json())
    assert response.status_code == status.HTTP_200_OK
