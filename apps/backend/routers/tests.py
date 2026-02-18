from fastapi import APIRouter, HTTPException
from pydantic import BaseModel


router = APIRouter()

class CalculationRequest(BaseModel):
    input_value: float
    modifier: float

class CalculationResponse(BaseModel):
    success: bool
    result: float | None
    message: str


@router.post("/multiply", response_model=CalculationResponse)
async def multiply(request: CalculationRequest):
    try:
        if request.modifier == 0:
            raise ValueError("Cannot be zero")
        result = request.input_value * request.modifier

        return {
            "success": True,
            "result": result,
            "message": "Calculation Completed"
        }
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
