from datetime import datetime, timezone

import pandas as pd
from pydantic import BaseModel
from sqlalchemy import create_engine, text
import uuid
from fastapi import APIRouter, UploadFile, HTTPException
from typing import Dict, List, Any
from .db import engine, project_engine


router = APIRouter(prefix="/data")

PENDING_UPLOADS = {}


class UploadPreviewResponse(BaseModel):
    upload_id: str
    headers: List[str]
    preview_rows: List[Dict[str, Any]]


@router.post("/upload-preview", response_model=UploadPreviewResponse)
async def upload_preview(file: UploadFile):
    try:
        df = pd.read_csv(file.file)
        preview = df.head(3).to_dict(orient="records")
        upload_id = str(uuid.uuid4())
        PENDING_UPLOADS[upload_id] = {"df": df, "filename": file.filename}
        return {
            "upload_id": upload_id,
            "headers": df.columns.tolist(),
            "preview_rows": preview,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class MappingConfig(BaseModel):
    project_id: str
    upload_id: str
    dataset_name: str
    column_map: Dict[
        str, str
    ]  # {"origin": "Accident Year", "development": "Development Year", "paid": "Cumulative Paid"}


class ConfirmIngestResponse(BaseModel):
    dataset_id: str
    message: str


@router.post("/confirm-ingest", response_model=ConfirmIngestResponse)
async def confirm_ingest(config: MappingConfig):
    pending_data = PENDING_UPLOADS.get(config.upload_id)
    if pending_data is None:
        raise HTTPException(status_code=400, detail="Upload expired")

    df = pending_data["df"]
    filename = pending_data["filename"]
    # 1. Rename columns based on user mapping
    df = df.rename(columns=config.column_map)

    # 2. Add Dataset ID
    data_id = f"dat_{uuid.uuid4().hex[:8]}"

    pe = project_engine(project_id=config.project_id)

    # 1. Write to Metadata Table (`projects`)
    with pe.connect() as conn:
        conn.execute(
            text(
                """
                INSERT INTO project_tables (id, name, original_filename, row_count, table_type)
                VALUES (:id, :name, :filename, :row_count, :table_type);
                """
            ),
            {
                "id": data_id,
                "name": config.dataset_name,
                "filename": filename,
                "row_count": len(df),
                "table_type": "claims",
            },
        )
        conn.commit()

    # 3. Default Lob
    if "lob" not in df.columns:
        df['lob'] = 'default'

    # 4. Save to Master
    df.to_sql(data_id, con=pe, index=False)

    # Clean up memory
    del PENDING_UPLOADS[config.upload_id]

# TODAY: It stopped right here....
    return {"dataset_id": data_id, "message": "Data ingested successfully"}


class TableMetaInfo(BaseModel):
    id: str
    name: str
    original_filename: str
    row_count: int
    table_type: str


class FetchTablesResponse(BaseModel):
    tables: List[TableMetaInfo]

@router.get('/fetch-tables',response_model=FetchTablesResponse)
async def fetch_tables(project_id: str):
    pe = project_engine(project_id)
    records = pd.read_sql('select id, name, original_filename, row_count, table_type from project_tables',con=pe).to_dict('records')
    print(records)
    return {
        "tables": records
    }
