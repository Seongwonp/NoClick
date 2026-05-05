from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.analysis import AnalysisRequest, AnalysisResult, AnalysisResponse
from app.services.ai_engine import ai_engine
from app.database import get_db
from typing import Any

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResult)
async def analyze_blog(request: AnalysisRequest, db: Session = Depends(get_db)) -> Any:
    """
    제공된 블로그 본문 텍스트를 분석하여 광고 패턴 및 숨겨진 단점을 추론합니다.
    """
    try:
        # AI 엔진 호출 (Gemini 3.0 Flash-preview)
        analysis_data = await ai_engine.analyze_blog_content(request.content)
        
        if "error" in analysis_data:
            return AnalysisResult(status="error", error=analysis_data["error"])

        # 성공 시 응답 데이터 구성
        # URL이 제공되지 않았을 경우 처리
        response_data = AnalysisResponse(
            **analysis_data,
            original_url=str(request.url) if request.url else "URL 미제공",
            blog_title=analysis_data.get("blog_title", "분석된 블로그 제목")
        )
        
        # TODO: 분석 결과를 DB에 저장 (CRUD 활용)
        
        return AnalysisResult(status="success", data=response_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
