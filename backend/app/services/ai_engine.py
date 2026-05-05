import google.generativeai as genai
import json
import logging
from typing import Dict, Any
from app.core.config import settings
from app.core.prompts import AD_DETECTION_PROMPT

logger = logging.getLogger(__name__)

class AIEngine:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            # 최신 Gemini 3.0 Flash-preview 모델 사용
            self.model = genai.GenerativeModel('gemini-3.0-flash-preview-001')
        else:
            logger.warning("GEMINI_API_KEY가 설정되지 않았습니다.")
            self.model = None

    async def analyze_blog_content(self, content: str) -> Dict[str, Any]:
        """
        블로그 본문을 Gemini API로 분석하여 결과를 반환합니다.
        """
        if not self.model:
            return {"error": "AI 엔진이 구성되지 않았습니다. API 키를 확인해주세요."}

        try:
            # 프롬프트와 본문 결합
            full_prompt = f"{AD_DETECTION_PROMPT}\n\n[분석할 블로그 본문]\n{content}"
            
            # 비동기 호출 (Gemini SDK의 경우 지원 여부에 따라 threading이나 전용 비동기 client 사용 가능)
            # 여기서는 가장 표준적인 generate_content를 사용합니다.
            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    response_mime_type="application/json", # JSON 출력 강제
                )
            )
            
            # JSON 파싱
            if response.text:
                return json.loads(response.text)
            else:
                return {"error": "AI 응답이 비어있습니다."}

        except Exception as e:
            logger.error(f"AI 분석 중 오류 발생: {str(e)}")
            # 429 에러 등 발생 시 처리 로직을 여기에 추가하거나 상위에서 핸들링
            return {"error": f"AI 분석 중 오류가 발생했습니다: {str(e)}"}

# 싱글톤 패턴으로 엔진 인스턴스 생성
ai_engine = AIEngine()
