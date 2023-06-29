import sys
from os.path import dirname as up

project_dir = up(up(up(__file__)))
sys.path.append(project_dir)

from fastapi import FastAPI
import uvicorn
from starlette.staticfiles import StaticFiles

from backend.database.backup import backup
from operations.router import router as router_operation
from fastapi_utils.tasks import repeat_every

app = FastAPI(
    title="Biogenom App"
)

app.include_router(router_operation)


@app.on_event("startup")
@repeat_every(seconds=60*60*24)
async def get_backup():
    await backup()

app.mount("/", StaticFiles(directory="../../frontend/static", html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=7294)
