from typing import List
import pandas as pd
from pydantic import BaseModel
from .db import engine
from .project import ProjectMetaInfo
from fastapi import APIRouter


router = APIRouter()


class FetchTablesResponse(BaseModel):
    projects: List[ProjectMetaInfo]

@router.get("/fetch-projects", response_model=FetchTablesResponse)
async def fetch_projects():
    try:
        projects = pd.read_sql(f"SELECT * FROM projects", con=engine).to_dict("records")
        return {"projects": projects}
    except:
        return {"projects": []}