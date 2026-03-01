from fastapi import APIRouter, UploadFile, HTTPException
from pydantic import BaseModel
import pandas as pd
import chainladder as cl
import uuid
import numpy as np
from typing import List, Optional

router = APIRouter()

# MOCK STORAGE (Maps session_id -> DataFrame)
DATA_STORE = {} 

def clean_for_json(data):
    """Safely converts pandas NaNs and Infs to Python None for JSON compliance"""
    # 1. Convert Infinities to NaN
    cleaned = data.replace([np.inf, -np.inf], np.nan)
    # 2. Cast to Python object type (allows mixing floats and None)
    cleaned = cleaned.astype(object)
    # 3. Replace all NaNs with Python None
    cleaned = cleaned.where(pd.notna(cleaned), None)
    return cleaned

class AggregationParams(BaseModel):
    session_id: str
    lob: str
    origin_col: str = "origin"
    dev_col: str = "development"
    value_col: str = "paid"

class TriangleResponse(BaseModel):
    triangle: List[List[Optional[float]]]
    origin_indexes: List[str]
    dev_indexes: List[str]
    ldfs: List[Optional[float]] # Added LDFs to the response

@router.post("/upload-claims")
async def upload_claims(file: UploadFile):

    print(DATA_STORE.keys())
    try:
        df = pd.read_csv(file.file)
        session_id = str(uuid.uuid4())
        
        # Save granular data to the session
        DATA_STORE[session_id] = df
        
        return {
            "session_id": session_id, 
            "rows": len(df), 
            "lobs": df['lob'].unique().tolist()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/aggregate-triangle", response_model=TriangleResponse)
async def get_triangle(params: AggregationParams):
    df = DATA_STORE.get(params.session_id)
    if df is None:
        raise HTTPException(status_code=404, detail="Session expired")

    # 1. Filter to the selected LOB
    subset = df[df['lob'] == params.lob]
    
    try:
        # 2. The Chainladder Magic
        # Convert the granular pandas dataframe directly into a chainladder Triangle
        tri = cl.Triangle(
            subset, 
            origin=params.origin_col, 
            development=params.dev_col, 
            columns=params.value_col,
            cumulative=True
        )
        
        # 3. Calculate Age-to-Age Factors (LDFs) instantly
        dev = cl.Development().fit(tri)
        
        # 4. Extract data for JSON serialization
        # .to_frame() converts the chainladder triangle back to a 2D pandas DataFrame
        tri_df = clean_for_json(tri.to_frame())
        
        # Replace NaNs with None for standard JSON
        tri_json = tri_df.where(pd.notnull(tri_df), None).values.tolist()
        
        if len(dev.ldf_) > 0:
            ldf_series = dev.ldf_.to_frame().iloc[0]
            ldf_clean = clean_for_json(ldf_series)
            ldf_list = ldf_clean.tolist()
        else:
            ldf_list = []
        # Extract LDFs (simplifying to a 1D list for the frontend)
        # .ldf_ returns a triangle shape, we grab the first row of factors

        return {
            "triangle": tri_json,
            "origin_indexes": tri_df.index.astype(str).tolist(),
            "dev_indexes": tri_df.columns.astype(str).tolist(),
            "ldfs": ldf_list
        }
        
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=f"Chainladder processing error: {str(e)}")