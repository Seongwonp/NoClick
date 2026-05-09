from pydantic import BaseModel, Field
from typing import List, Optional, Union

class HighlightedPhrase(BaseModel):
    text: str
    type: str  # exaggeration | sponsor_denial | negative_avoidance

class HiddenNegative(BaseModel):
    inferred: str
    confidence: int  # 0-100
    reasoning: str

class AnalysisRequest(BaseModel):
    content: str = Field(..., min_length=10, description="분석할 텍스트 본문")
    platform: str = Field("general", description="플랫폼 종류: naver | insta | coupang | other")
    model: str = Field("gemini", description="AI 모델 선택: gemini | huggingface")
    session_id: Optional[str] = Field(None, description="익명 사용자 세션 ID (히스토리 추적용)")
    api_key: Optional[str] = Field(None, exclude=True, description="사용자 Gemini API 키 (선택사항, 사용 후 즉시 폐기)")

class AnalysisResponse(BaseModel):
    original_content: str
    ad_probability: int = Field(..., ge=0, le=100)
    trust_score: int = Field(..., ge=0, le=100)
    highlighted_phrases: List[HighlightedPhrase]
    hidden_negatives: List[HiddenNegative]
    hidden_intent: str
    overall_verdict: str
    real_summary: str
    saved_cost: str
    saved_time: str
    blog_title: str

class AnalysisResult(BaseModel):
    status: str
    data: Optional[Union[AnalysisResponse, List[AnalysisResponse]]] = None
    error: Optional[str] = None
