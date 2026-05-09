from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from app.database import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True, nullable=True)   # 익명 사용자 히스토리 추적
    platform = Column(String, default="general")             # naver | insta | coupang | other
    model_used = Column(String, default="gemini")            # gemini | huggingface

    original_content = Column(Text)
    blog_title = Column(String)

    ad_probability = Column(Integer)
    trust_score = Column(Integer)

    highlighted_phrases = Column(JSON)
    hidden_negatives = Column(JSON)
    hidden_intent = Column(Text)
    overall_verdict = Column(Text)
    real_summary = Column(Text)

    saved_cost = Column(String)
    saved_time = Column(String)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
