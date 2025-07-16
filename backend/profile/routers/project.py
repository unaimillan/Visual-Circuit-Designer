from fastapi import APIRouter
from backend.profile.db import db
from backend.profile.schemas import Project

router = APIRouter(prefix="/api/profile/{id}/project", tags=["projects"])

@router.post("")
async def create_project(id: str, project: Project):
    await db.projects.insert_one({**project.model_dump(), "owner_id": id})
    return {"status": "project created"}

@router.get("")
async def get_all_projects(id: str):
    projects = await db.projects.find({"owner_id": id}).to_list(100)
    return projects

@router.get("/{pid}")
async def get_project(id: str, pid: str):
    project = await db.projects.find_one({"owner_id": id, "pid": pid})
    return project

@router.get("/{pid}/name")
async def get_project_name(id: str, pid: str):
    proj = await db.projects.find_one({"owner_id": id, "pid": pid}, {"name": 1})
    return {"name": proj["name"]}

@router.get("/{pid}/date-created")
async def get_project_date(id: str, pid: str):
    proj = await db.projects.find_one({"owner_id": id, "pid": pid}, {"date_created": 1})
    return {"date_created": proj["date_created"]}

@router.patch("/{pid}/name")
async def update_project_name(id: str, pid: str, data: dict):
    await db.projects.update_one({"owner_id": id, "pid": pid}, {"$set": {"name": data["name"]}})
    return {"status": "name updated"}

@router.patch("/{pid}/circuit")
async def update_project_circuit(id: str, pid: str, data: dict):
    await db.projects.update_one({"owner_id": id, "pid": pid}, {"$set": {"circuit": data}})
    return {"status": "circuit updated"}

@router.patch("/{pid}/verilog")
async def update_project_verilog(id: str, pid: str, data: dict):
    await db.projects.update_one({"owner_id": id, "pid": pid}, {"$set": {"verilog": data["verilog"]}})
    return {"status": "verilog updated"}

@router.delete("/{pid}")
async def delete_project(id: str, pid: str):
    await db.projects.delete_one({"owner_id": id, "pid": pid})
    return {"status": "project deleted"}