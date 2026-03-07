from datetime import datetime, timezone
import json

import pandas as pd
from pydantic import BaseModel
from sqlalchemy import create_engine, text
import uuid
from fastapi import APIRouter, UploadFile, HTTPException
from typing import Dict, List, Any
from .db import engine, project_engine


router = APIRouter(prefix="/data")

PENDING_UPLOADS: Dict[str,pd.DataFrame] = {}


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

    df = pd.DataFrame(pending_data["df"])
    filename = pending_data["filename"]
    # 1. Rename columns based on user mapping
    df = pd.DataFrame(df.rename(columns=config.column_map))

    # "Dimension" vs "Measure"
    dimensions = ['origin','development','index']
    mapped_cols = [v for v in config.column_map.values() if v != ""]
    measures = list(df.drop(mapped_cols,axis=1).columns)


    # 2. Add Dataset ID
    data_id = f"dat_{uuid.uuid4().hex[:8]}"

    pe = project_engine(project_id=config.project_id)

    # 1. Write to Metadata Table (`projects`)
    with pe.connect() as conn:
        conn.execute(
            text(
                """
                INSERT INTO project_tables (id, name, original_filename, row_count, table_type, measures_json)
                VALUES (:id, :name, :filename, :row_count, :table_type, :measures);
                """
            ),
            {
                "id": data_id,
                "name": config.dataset_name,
                "filename": filename,
                "row_count": len(df),
                "table_type": "claims",
                "measures": json.dumps(measures) # Store as ["Paid", "Incurred", "Reported"]
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
    uploaded_on: str
    row_count: int
    table_type: str
    measures: List[str]


class FetchTablesResponse(BaseModel):
    tables: List[TableMetaInfo]

@router.get('/fetch-tables',response_model=FetchTablesResponse)
async def fetch_tables(project_id: str):
    pe = project_engine(project_id)
    records = pd.read_sql('select * from project_tables',con=pe).to_dict(orient="records")
    for i,r in enumerate(records):
        records[i]['measures'] = json.loads(r['measures_json'])
        del records[i]['measures_json']
    return {
        "tables": records
    }
