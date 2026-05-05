from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.analysis import router as analysis_router

app = FastAPI(title="No-Click API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis_router)


@app.get("/")
async def root():
    return {"message": "No-Click API is running"}
