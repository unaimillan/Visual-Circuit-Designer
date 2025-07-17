import pytest
from fastapi import status


@pytest.mark.asyncio
async def test_get_info(auth_client, registered_user, profile_client):
    user_data, user = registered_user

    login_response = await auth_client.post(
        "http://auth:8080/api/auth/login",
        data={
            "username": user_data["email"],
            "password": user_data["password"]
        }
    )
    token = login_response.json().get("access_token")
    assert login_response.status_code == status.HTTP_200_OK

    # verify_response = await auth_client.get(
    #     "/auth/verify",
    #     headers={"Authorization": f"Bearer {token}"}
    # )
    # assert verify_response.status_code == status.HTTP_200_OK
    # id = verify_response.json()["user_id"]

    new_email = "newemail@example.com"
    update_response = await profile_client.patch(
        f"/api/profile/{str(user['id'])}/email",
        json={"email": new_email},
        headers={"Authorization": f"Bearer {token}"}
    )

    assert update_response.status_code == status.HTTP_200_OK
    assert update_response.json()["status"] == "email updated"

    profile_response = await profile_client.get(
        f"/api/profile/{str(user['id'])}",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert profile_response.status_code == status.HTTP_200_OK
    assert profile_response.json()["email"] == new_email
