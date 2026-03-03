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
