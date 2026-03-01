from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class ReservingRequest(BaseModel):
    triangle: List[List[Optional[float]]]

class ReservingResponse(BaseModel):
    ibnr: float
    ldfs: List[float]


@router.post("/calculate-reserves", response_model=ReservingResponse)
async def calculate(data: ReservingRequest):
    current_claims = sum(filter(None, [cell for row in data.triangle for cell in row]))
    
    return {
        "ibnr": current_claims * 0.15, # Mock result
        "ldfs": [2.5, 1.2, 1.05, 1.0]
    }

