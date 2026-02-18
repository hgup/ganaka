from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from routers import tests


app = FastAPI()
app.include_router(tests.router, prefix="/tests", tags=["Calculation"])

@app.get("/")
async def root():
    return {
        "message": "System Online"
    }