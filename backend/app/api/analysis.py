from fastapi import APIRouter, HTTPException
from app.schemas.analysis import AnalysisRequest, AnalysisResult, AnalysisResponse
from typing import Any

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResult)
async def analyze_blog(request: AnalysisRequest) -> Any:
    """
    네이버 블로그 URL을 분석하여 광고 패턴 및 숨겨진 단점을 추론합니다.
    """
    try:
        # TODO: 성원님이 집중할 AI 엔진(services/ai_engine.py) 호출 로직이 들어갈 곳
        
        # Mock Data (아미, 예솔님이 바로 작업할 수 있도록 새 스펙에 맞춤)
        mock_data = AnalysisResponse(
            ad_probability=89,
            trust_score=11,
            highlighted_phrases=[
                {"text": "사장님이 너무 친절하셔서 감동했어요", "type": "exaggeration"},
                {"text": "원고료를 받지 않은 솔직한 후기입니다", "type": "sponsor_denial"}
            ],
            hidden_negatives=[
                {
                    "inferred": "주차 공간이 매우 협소함",
                    "confidence": 95,
                    "reasoning": "본문에 '대중교통 이용 권장' 문구가 반복되고 건물 외관 사진에 주차장이 보이지 않음"
                },
                {
                    "inferred": "대기 시간이 상당히 김",
                    "confidence": 80,
                    "reasoning": "글의 서두에 '드디어 방문했다'는 표현과 내부가 좁다는 언급이 있음"
                }
            ],
            real_summary="협찬으로 작성된 글이며, 맛은 평이하나 공간이 좁고 대기가 길 가능성이 매우 높음.",
            saved_cost="15,000원",
            saved_time="40분",
            original_url=str(request.url),
            blog_title="[망원] 진짜 나만 알고 싶은 맛집 후기"
        )
        
        return AnalysisResult(status="success", data=mock_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
