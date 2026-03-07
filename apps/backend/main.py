from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from routers import project, data, dashboard, workflow

from sqlalchemy import create_engine, text

app = FastAPI()
app.include_router(data.router, tags=["project"])
app.include_router(project.router, tags=["project"])
app.include_router(dashboard.router, tags=["dashboard"])
app.include_router(workflow.router, tags=["project"])



@app.get("/")
async def root():
    return {
        "message": "System Online"
    }