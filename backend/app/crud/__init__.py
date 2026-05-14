from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.analysis import Analysis
from app.schemas.analysis import AnalysisResponse


def save_analysis(
    db: Session,
    response: AnalysisResponse,
    platform: str,
    model_used: str,
    session_id: Optional[str],
) -> Analysis:
    db_obj = Analysis(
        session_id=session_id,
        platform=platform,
        model_used=model_used,
        original_content=response.original_content,
        blog_title=response.blog_title,
        ad_probability=response.ad_probability,
        trust_score=response.trust_score,
        highlighted_phrases=[p.model_dump() for p in response.highlighted_phrases],
        hidden_negatives=[n.model_dump() for n in response.hidden_negatives],
        hidden_intent=response.hidden_intent,
        overall_verdict=response.overall_verdict,
        real_summary=response.real_summary,
        saved_cost=response.saved_cost,
        saved_time=response.saved_time,
        dimension_scores=response.dimension_scores,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def get_analysis(db: Session, analysis_id: int) -> Optional[Analysis]:
    return db.query(Analysis).filter(Analysis.id == analysis_id).first()


def get_history(db: Session, session_id: str, limit: int = 10, skip: int = 0) -> List[Analysis]:
    return (
        db.query(Analysis)
        .filter(Analysis.session_id == session_id)
        .order_by(Analysis.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def count_history(db: Session, session_id: str) -> int:
    return (
        db.query(Analysis)
        .filter(Analysis.session_id == session_id)
        .count()
    )
