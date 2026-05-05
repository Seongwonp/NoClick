import sys
import os

# 현재 디렉토리를 sys.path에 추가하여 app 모듈을 찾을 수 있게 함
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
<<<<<<< HEAD
from app.api.analysis import router as analysis_router

app = FastAPI(title="No-Click API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis_router)
=======
from app.core.config import settings
from app.api.analysis import router as analysis_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url="/openapi.json"
)
>>>>>>> bcd8c0d76f978a2c170f40987b625ea7fda68239

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API 라우터 등록
app.include_router(analysis_router, prefix="/api/analysis", tags=["analysis"])

@app.get("/")
async def root():
<<<<<<< HEAD
    return {"message": "No-Click API is running"}
=======
    return {
        "message": "No-Click API is running",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
>>>>>>> bcd8c0d76f978a2c170f40987b625ea7fda68239
