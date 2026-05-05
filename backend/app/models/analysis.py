from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, JSON
from sqlalchemy.sql import func
from app.database import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)
    blog_title = Column(String)
    ad_probability = Column(Integer)
    trust_score = Column(Integer)
    
    # 분석 결과 데이터 (JSON 형태로 저장)
    highlighted_phrases = Column(JSON)
    hidden_negatives = Column(JSON)
    real_summary = Column(String)
    
    saved_cost = Column(String)
    saved_time = Column(String)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 크롬 확장 프로그램 사용자 식별용 (필요시)
    user_id = Column(String, index=True, nullable=True)
