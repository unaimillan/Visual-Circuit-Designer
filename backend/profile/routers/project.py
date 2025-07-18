from fastapi import APIRouter, Depends, HTTPException
from backend.profile.database.db import get_project_db
from backend.profile.database.pgre_projects import PostgreSQLProjectDatabase
from backend.profile.schemas import Project, ProjectDB

router = APIRouter(prefix="/api/profile/{id}/project", tags=["projects"])


@router.post("", response_model=dict)
async def create_project(
        id: int,
        project: Project,
        project_db: PostgreSQLProjectDatabase = Depends(get_project_db)
):
    project_dict = project.model_dump()
    project_dict["owner_id"] = id
    await project_db.create(project_dict)
    return {"status": "project created"}


@router.get("", response_model=list[ProjectDB])
async def get_all_projects(
        id: int,
        project_db: PostgreSQLProjectDatabase = Depends(get_project_db)
):
    return await project_db.get_all(id)


@router.get("/{pid}", response_model=ProjectDB)
async def get_project(
        id: int,
        pid: int,
        project_db: PostgreSQLProjectDatabase = Depends(get_project_db)
):
    project = await project_db.get(id, pid)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.patch("/{pid}/name", response_model=dict)
async def update_project_name(
        id: int,
        pid: int,
        data: dict,
        project_db: PostgreSQLProjectDatabase = Depends(get_project_db)
):
    if "name" not in data:
        raise HTTPException(status_code=400, detail="Name is required")

    await project_db.update(id, pid, {"name": data["name"]})
    return {"status": "name updated"}


@router.patch("/{pid}/circuit", response_model=dict)
async def update_project_circuit(
        id: int,
        pid: int,
        data: dict,
        project_db: PostgreSQLProjectDatabase = Depends(get_project_db)
):
    if "circuit" not in data:
        raise HTTPException(status_code=400, detail="Circuit data is required")

    await project_db.update(id, pid, {"circuit": data["circuit"]})
    return {"status": "circuit updated"}


@router.patch("/{pid}/custom_nodes", response_model=dict)
async def update_custom_nodes(
        id: int,
        pid: int,
        data: dict,
        project_db: PostgreSQLProjectDatabase = Depends(get_project_db)
):
    if "custom_nodes" not in data:
        raise HTTPException(status_code=400, detail="Custom nodes data is required")

    await project_db.update(id, pid, {"custom_nodes": data["custom_nodes"]})
    return {"status": "custom_nodes updated"}


@router.delete("/{pid}", response_model=dict)
async def delete_project(
        id: int,
        pid: int,
        project_db: PostgreSQLProjectDatabase = Depends(get_project_db)
):
    await project_db.delete(id, pid)
    return {"status": "project deleted"}