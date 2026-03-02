from datetime import datetime, timezone

import pandas as pd
from pydantic import BaseModel
from sqlalchemy import create_engine, text
import uuid
from fastapi import APIRouter, UploadFile, HTTPException
from typing import Dict, List, Any


engine = create_engine('sqlite:///workbench.db')
router = APIRouter(prefix="/project")


class ProjectMetaInfo(BaseModel):
    id: str
    name: str
    original_filename: str
    created_at: str
    last_modified: str
    row_count: int

@router.get('/get-metadata',response_model=ProjectMetaInfo)
async def get_metadata(id: str):
    records = pd.read_sql(text("SELECT * FROM projects where id= :id"),
        params={ "id": id }, con=engine).to_dict('records')
    project = records[0] if records else None
    return project