from datetime import datetime, timezone

import pandas as pd
from pydantic import BaseModel
from sqlalchemy import create_engine, text
import uuid
from fastapi import APIRouter, UploadFile, HTTPException
from typing import Dict, List, Any


engine = create_engine('sqlite:///workbench.db')

with engine.connect() as conn:
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            original_filename TEXT,
            created_at TIMESTAMP,
            last_modified TIMESTAMP,
            row_count INTEGER
        )
    """))
    conn.commit()

router = APIRouter(prefix="/data", tags=["data"])

PENDING_UPLOADS = {}

class UploadPreviewResponse(BaseModel):
    upload_id: str
    headers: List[str]
    preview_rows: List[Dict[str,Any]]

@router.post('/upload-preview', response_model=UploadPreviewResponse)
async def upload_preview(file: UploadFile):
    try:
        df = pd.read_csv(file.file)
        preview = df.head(3).to_dict(orient='records')
        upload_id = str(uuid.uuid4())
        PENDING_UPLOADS[upload_id] = {
            "df": df,
            "filename": file.filename
        }
        return {
            "upload_id": upload_id,
            "headers": df.columns.tolist(),
            "preview_rows": preview
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class MappingConfig(BaseModel):
    upload_id: str
    project_name: str
    column_map: Dict[str,str] # {"origin": "Accident Year", "development": "Development Year", "paid": "Cumulative Paid"}
class ConfirmIngestResponse(BaseModel):
    project_id: str
    message: str

@router.post("/confirm-ingest", response_model=ConfirmIngestResponse)
async def confirm_ingest(config: MappingConfig):
    pending_data = PENDING_UPLOADS.get(config.upload_id)
    if pending_data is None:
        raise HTTPException(status_code=400, detail="Upload expired")

    df = pending_data['df']
    filename = pending_data['filename']
    # 1. Rename columns based on user mapping 
    df = df.rename(columns= config.column_map)
    
    # 2. Add Project ID
    project_id = f"proj_{uuid.uuid4().hex[:8]}"

    # 1. Write to Metadata Table (`projects`)
    with engine.connect() as conn:
        conn.execute(
            text("""
                INSERT INTO projects (id, name, original_filename, created_at, row_count, last_modified)
                VALUES (:id, :name, :filename, :created_at, :row_count, :last_modified)
            """),
            {
                "id": project_id,
                "name": config.project_name,
                "filename": filename,
                "created_at": datetime.now(timezone.utc),
                "row_count": len(df),
                "last_modified": datetime.now(timezone.utc),
            }
        )
        conn.commit()

    df['project_id'] = project_id
    
    # 3. Ensure all required columns exist
    required = ['origin', 'development', 'paid', 'lob']
    for col in required:
        if col not in df.columns:
            df[col] = 0
            # raise HTTPException(status_code=400, detail=f"Missing required column: {col}")
            
    # 4. Save to Master
    df[required + ['project_id']].to_sql('claims_master', con=engine, if_exists='append', index=False)
    
    # Clean up memory
    del PENDING_UPLOADS[config.upload_id] 

    return {"project_id": project_id, "message": "Data ingested successfully"}


class ProjectMetaInfo(BaseModel):
    id: str
    name: str
    original_filename: str
    created_at: str
    last_modified: str
    row_count: int

class FetchTablesResponse(BaseModel):
    projects: List[ProjectMetaInfo]

@router.get('/fetch-projects',response_model=FetchTablesResponse)
async def fetch_projects():
    try:
        projects = pd.read_sql(f"SELECT * FROM projects", con=engine).to_dict('records')
        return {'projects': projects}
    except:
        return {'projects': []}