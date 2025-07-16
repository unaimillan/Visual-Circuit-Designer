# from uuid import UUID
#
# from fastapi import APIRouter, Depends
# from fastapi_users import FastAPIUsers
#
# from backend.profile.models import UserDB
#
# temp_router = APIRouter()
#
# fastapi_users = FastAPIUsers[UserDB, UUID](
#     get_user_manager,
#     [auth_backend, refresh_backend],
# )
#
# get_current_user = fastapi_users.current_user(active=False, verified=False)
#
# @temp_router.get("/verify", tags=["auth"])
# async def verify_access_token(user: UserDB = Depends(get_current_user)):
#     return {
#         "valid": True,
#         "user_id": str(user.id),
#         "email": user.email,
#     }
#
