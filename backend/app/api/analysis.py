from fastapi import APIRouter, HTTPException, Depends, Query, Request
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.schemas.analysis import AnalysisRequest, AnalysisResult, AnalysisResponse
from app.services.ai_engine import ai_engine
from app.crud import save_analysis, get_analysis, get_history
from app.database import get_db
from app.core.config import settings
from typing import Any, List

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


@router.post("/analyze", response_model=AnalysisResult)
@limiter.limit(settings.RATE_LIMIT)
async def analyze_blog(request: Request, body: AnalysisRequest, db: Session = Depends(get_db)) -> Any:
    """
    블로그/리뷰 본문 텍스트를 분석하여 광고 패턴 및 숨겨진 단점을 추론합니다.
    """
    try:
        analysis_data = await ai_engine.analyze_blog_content(
            content=body.content,
            platform=body.platform,
            model=body.model,
            api_key=body.api_key,
        )

        if "error" in analysis_data:
            return AnalysisResult(status="error", error=analysis_data["error"])

        blog_title = analysis_data.pop("blog_title", "제목 추론 불가")

        response_data = AnalysisResponse(
            **analysis_data,
            blog_title=blog_title,
            original_content=body.content,
        )

        save_analysis(
            db=db,
            response=response_data,
            platform=body.platform,
            model_used=body.model,
            session_id=body.session_id,
        )

        return AnalysisResult(status="success", data=response_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history", response_model=AnalysisResult)
def get_analysis_history(
    session_id: str = Query(..., description="히스토리 조회할 세션 ID"),
    limit: int = Query(20, ge=1, le=100, description="조회 개수 (기본 20, 최대 100)"),
    db: Session = Depends(get_db),
) -> Any:
    """
    session_id 기준으로 최근 분석 히스토리를 반환합니다.
    """
    try:
        records = get_history(db=db, session_id=session_id, limit=limit)
        history = [
            AnalysisResponse(
                blog_title=r.blog_title or "제목 없음",
                ad_probability=r.ad_probability,
                trust_score=r.trust_score,
                highlighted_phrases=r.highlighted_phrases or [],
                hidden_negatives=r.hidden_negatives or [],
                hidden_intent=r.hidden_intent or "",
                overall_verdict=r.overall_verdict or "",
                real_summary=r.real_summary or "",
                saved_cost=r.saved_cost or "",
                saved_time=r.saved_time or "",
                original_content=r.original_content or "",
            )
            for r in records
        ]
        return AnalysisResult(status="success", data=history if history else [])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{analysis_id}", response_model=AnalysisResult)
def get_analysis_by_id(
    analysis_id: int,
    db: Session = Depends(get_db),
) -> Any:
    """
    ID로 특정 분석 결과를 조회합니다.
    """
    try:
        record = get_analysis(db=db, analysis_id=analysis_id)
        if not record:
            return AnalysisResult(status="error", error="해당 분석 결과를 찾을 수 없습니다.")

        response_data = AnalysisResponse(
            blog_title=record.blog_title or "제목 없음",
            ad_probability=record.ad_probability,
            trust_score=record.trust_score,
            highlighted_phrases=record.highlighted_phrases or [],
            hidden_negatives=record.hidden_negatives or [],
            hidden_intent=record.hidden_intent or "",
            overall_verdict=record.overall_verdict or "",
            real_summary=record.real_summary or "",
            saved_cost=record.saved_cost or "",
            saved_time=record.saved_time or "",
            original_content=record.original_content or "",
        )
        return AnalysisResult(status="success", data=response_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
