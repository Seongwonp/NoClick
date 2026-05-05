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
        # AI 엔진 호출 (사용자 키 있으면 우선 사용, 없으면 서버 키 로테이션)
        analysis_data = await ai_engine.analyze_blog_content(
            content=request.content,
            api_key=request.api_key,
        )
        
        if "error" in analysis_data:
            return AnalysisResult(status="error", error=analysis_data["error"])

        blog_title = analysis_data.pop("blog_title", "제목 추론 불가")

        response_data = AnalysisResponse(
            **analysis_data,
            blog_title=blog_title,
        )
        
        # TODO: 분석 결과를 DB에 저장 (CRUD 활용)
        
        return AnalysisResult(status="success", data=response_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
