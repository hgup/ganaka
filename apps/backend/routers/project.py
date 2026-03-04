from datetime import datetime, timezone
import os
import uuid
import pandas as pd
from pydantic import BaseModel
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from fastapi import APIRouter, UploadFile, HTTPException
from typing import Dict, List, Any
from .db import project_engine, engine

router = APIRouter(prefix="/project")


class ProjectMetaInfo(BaseModel):
    id: str
    name: str
    created_at: str
    last_modified: str


@router.post("/create-project", response_model=ProjectMetaInfo)
async def create_project(name: str):

    # LATER Think of a better way to avoid duplicate project-id by chance
    project_id = f"proj_{uuid.uuid4().hex[:8]}"

    pe = project_engine(project_id)
    with pe.connect() as conn:
        conn.execute(
            text(
                """
                INSERT INTO project_meta (id, name)
                VALUES (:id, :name)
                """
            ),
            {
                "id": project_id,
                "name": name,
            },
        )
        conn.commit()

    with engine.connect() as conn:
        conn.execute(
            text(
                """
                INSERT INTO projects (id, name)
                VALUES (:id, :name)
                """
            ),
            {
                "id": project_id,
                "name": name,
            },
        )
        conn.commit()

    return {
        "id": project_id,
        "name": name,
        "created_at": str(datetime.now(timezone.utc)),
        "last_modified": str(datetime.now(timezone.utc)),
    }


@router.get("/get-metadata", response_model=ProjectMetaInfo)
async def get_metadata(project_id: str):

    with engine.connect() as conn:
        conn.execute(
            text(
                """
            UPDATE projects
            SET last_modified = CURRENT_TIMESTAMP
            WHERE id= :id;
            """
            ),
            {"id": project_id},
        )
        conn.commit()

    records = pd.read_sql(
        text("SELECT * FROM projects where id= :id"),
        params={"id": project_id},
        con=engine,
    ).to_dict("records")
    project = records[0] if records else None
    return project


# In your FastAPI router file
from pydantic import BaseModel
import json


class CanvasSaveRequest(BaseModel):
    project_id: str
    canvas_json: str  # We will send the stringified JSON from the frontend


class CanvasSaveResponseModel(BaseModel):
    message: str


@router.put("/save-canvas", response_model=CanvasSaveResponseModel)
async def save_canvas(payload: CanvasSaveRequest):
    # 1. Grab the specific project's database engine from our registry
    pe = project_engine(project_id=payload.project_id)

    # 2. Update the canvas_json column
    with pe.connect() as conn:
        conn.execute(
            text(
                """
                UPDATE project_meta 
                SET canvas_json = :canvas_json
                -- Assuming there's only one row per file, but good practice to be safe
            """
            ),
            {"canvas_json": payload.canvas_json},
        )
        conn.commit()

    return {"message": "Canvas saved successfully"}

class FetchCanvasResponse(BaseModel):
    canvas_json: str

@router.get('/fetch-canvas',response_model=FetchCanvasResponse)
async def fetch_canvas(project_id: str):
    pe = project_engine(project_id)
    records = pd.read_sql(
        text("SELECT canvas_json FROM project_meta where id= :id"),
        params={"id": project_id},
        con=pe,
    ).to_dict("records")
    project = records[0] if records else None
    return project
