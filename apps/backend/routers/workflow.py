# In your FastAPI router
from typing import Literal

from pydantic import BaseModel
import chainladder as cl
import pandas as pd
from fastapi import APIRouter
from sqlalchemy import text

from .db import project_engine


router = APIRouter(prefix="/methods")


class MethodConfigRequest(BaseModel):
    project_id: str
    method_type: str  # 'chainladder', 'bf', etc.
    source_table: str  # e.g., 'dat_a1b2c3d4'
    column_name: str
    config: dict  # e.g., {'averageMethod': 'volume', 'nPeriods': 'all'}


class MethodResults(BaseModel):
    total_ibnr: float
    projected_ultimate: float


class MethodResponse(BaseModel):
    status: Literal["success", "error"]
    results: MethodResults


@router.post("/run-method", response_model=MethodResponse)
async def run_actuarial_method(payload: MethodConfigRequest):
    pe = project_engine(payload.project_id)

    # 1. Read the specific data asset from the project's DB
    df = pd.read_sql_table(payload.source_table, con=pe)

    # 2. Convert to cl.Triangle
    # We mapped these exact column names during the ingest phase!
    triangle = cl.Triangle(
        df,
        origin="origin",
        development="development",
        columns=payload.column_name,  # let this be choosable #LATER...
        cumulative=True,
    )

    # 3. Execute the specific method
    avg_method = payload.config.get("averageMethod", "volume")
    n_periods = payload.config.get("nPeriods", "all")
    g = Ganaka(n_periods, avg_method)
    g.estimate_dev_factors(triangle)

    match (payload.method_type):
        case "chainladder":
            results = g.run_chainladder(triangle)

    return {
        "status": "success",
        "results": results,
    }


class Ganaka:

    def __init__(self, n_periods: str, avg_method: str):

        self.avg_method = avg_method

        # Handle the 'all' string from the frontend
        if n_periods == "all":
            self.n_periods = -1  # This is the default
        else:
            self.n_periods = int(n_periods)


    def estimate_dev_factors(self, triangle: cl.Triangle):
        self.dev = cl.Development(average=self.avg_method, n_periods=self.n_periods).fit(triangle)

    def run_chainladder(self,triangle:cl.Triangle):

        # Calculate development factors
        model = cl.Chainladder()
        fitted = model.fit(self.dev.transform(triangle))

        # Extract the total IBNR and Ultimate
        # .sum() rolls up all origin years into a single scalar value
        total_ibnr = float(fitted.ibnr_.sum())
        total_ultimate = float(fitted.ultimate_.sum())

        # Don't roll up values! #LATER
        return {"total_ibnr": total_ibnr, "projected_ultimate": total_ultimate}
