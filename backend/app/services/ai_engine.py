from google import genai
from google.genai import types
import json
import logging
from typing import Dict, Any, Optional
from app.core.config import settings
from app.core.prompts import AD_DETECTION_PROMPT

logger = logging.getLogger(__name__)

MAX_INPUT_CHARS = 3000
GEMINI_MODEL = "gemini-3-flash-preview"


class AIEngine:
    def __init__(self):
        self._keys = settings.gemini_api_keys
        self._exhausted_keys: set = set()

    def _next_key(self) -> Optional[str]:
        for key in self._keys:
            if key not in self._exhausted_keys:
                return key
        return None

    def _exhaust_key(self, key: str):
        self._exhausted_keys.add(key)
        logger.warning(f"Gemini 키 소진 처리 (끝 4자리: ...{key[-4:]})")

    async def analyze_blog_content(self, content: str, api_key: Optional[str] = None) -> Dict[str, Any]:
        truncated = content[:MAX_INPUT_CHARS]
        full_prompt = f"{AD_DETECTION_PROMPT}\n\n[분석할 블로그 본문]\n{truncated}"

        # 사용자가 직접 키를 제공한 경우 → 해당 키로만 1회 호출 후 폐기
        if api_key:
            result = await self._call_gemini(full_prompt, api_key)
            if result.get("_rate_limited"):
                return {"error": "제공하신 API 키의 사용량이 초과되었거나 모델에 접근할 수 없습니다."}
            return result

        # 서버 키 로테이션
        while True:
            key = self._next_key()
            if not key:
                return {"error": "모든 Gemini API 키의 일일 한도가 초과되었습니다. HuggingFace 모드를 이용해주세요."}

            result = await self._call_gemini(full_prompt, key)

            if result.get("_rate_limited"):
                self._exhaust_key(key)
                continue

            return result

    async def _call_gemini(self, prompt: str, api_key: str) -> Dict[str, Any]:
        try:
            client = genai.Client(api_key=api_key)

            response = await client.aio.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                ),
            )

            if not response.text:
                return {"error": "AI 응답이 비어있습니다."}

            return json.loads(response.text)

        except Exception as e:
            error_str = str(e)
            logger.error(f"Gemini 호출 오류 (전체): {error_str}")
            if "429" in error_str or "quota" in error_str.lower() or "rate" in error_str.lower():
                return {"_rate_limited": True}
            return {"error": f"AI 분석 중 오류: {error_str}"}


ai_engine = AIEngine()
