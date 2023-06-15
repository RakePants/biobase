from fastapi import FastAPI
import uvicorn
from starlette.staticfiles import StaticFiles

from backend.src.operations.router import router

app = FastAPI(
    title="Biogenom App"
)

app.include_router(router)

app.mount("/", StaticFiles(directory="C:/Users/emely/OneDrive/Desktop/Проектная практика/biobase/frontend/static", html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)