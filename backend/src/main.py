from fastapi import FastAPI
import uvicorn
from operations.router import router as router_operation

app = FastAPI(
    title="Biogenom App"
)

app.include_router(router_operation)

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)