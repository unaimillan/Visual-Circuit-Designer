from backend.profile.config import MONGO_URI
from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient(MONGO_URI)
db = client["visual-circuit-designer"]
user_collection = db["Projects"]
