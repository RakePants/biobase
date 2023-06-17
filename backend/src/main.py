from fastapi import FastAPI
import uvicorn
from starlette.staticfiles import StaticFiles

from operations.router import router as router_operation

app = FastAPI(
    title="Biogenom App"
)

app.include_router(router_operation)

app.mount("/", StaticFiles(directory="C:/Users/RakePants/psuProjects/biobase/frontend/static", html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=1337)