from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from routers import tests,reserving, workflow, data, project


app = FastAPI()
# app.include_router(tests.router, prefix="/tests", tags=["Calculation"])
# app.include_router(reserving.router, prefix="/reserving", tags=["Reserving"])
# app.include_router(workflow.router, prefix="/workflow", tags=["Workflow"])
app.include_router(data.router, tags=["reserving"])
app.include_router(project.router, tags=["reserving"])

@app.get("/")
async def root():
    return {
        "message": "System Online"
    }