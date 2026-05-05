from pydantic import BaseModel, HttpUrl, Field
from typing import List, Optional

class HighlightedPhrase(BaseModel):
    text: str
    type: str  # exaggeration | sponsor_denial | negative_avoidance

class HiddenNegative(BaseModel):
    inferred: str
    confidence: int  # 0-100
    reasoning: str

class AnalysisRequest(BaseModel):
    url: HttpUrl

class AnalysisResponse(BaseModel):
    ad_probability: int = Field(..., ge=0, le=100)
    trust_score: int = Field(..., ge=0, le=100)
    highlighted_phrases: List[HighlightedPhrase]
    hidden_negatives: List[HiddenNegative]
    real_summary: str
    saved_cost: str
    saved_time: str
    original_url: str
    blog_title: str

class AnalysisResult(BaseModel):
    status: str
    data: Optional[AnalysisResponse] = None
    error: Optional[str] = None
