from huggingface_hub import AsyncInferenceClient
import json
import re
import logging
import asyncio
from typing import Dict, Any
from app.core.config import settings
from app.core.prompts import get_prompt

logger = logging.getLogger(__name__)

HF_MODEL = "Qwen/Qwen2.5-7B-Instruct"
RETRY_DELAY = 5  # 콜드 스타트 대기 (초)


def _extract_json(text: str) -> Dict[str, Any]:
    """AI 응답에서 JSON 블록 추출 — HF는 JSON 강제가 안 되므로 파싱 안전장치 필요"""
    # 1차: 그대로 파싱
    try:
        return json.loads(text.strip())
    except Exception:
        pass

    # 2차: 텍스트에서 { } 블록 추출
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except Exception:
            pass

    # 3차: ```json 코드블록 추출
    match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except Exception:
            pass

    logger.error(f"JSON 파싱 실패. 원본 응답:\n{text[:300]}")
    return {"error": "AI 응답을 JSON으로 파싱할 수 없습니다."}


class HuggingFaceEngine:
    def __init__(self):
        self._api_key = settings.HUGGINGFACE_API_KEY
        self._client: AsyncInferenceClient | None = None
        self._semaphore = asyncio.Semaphore(max(1, settings.AI_CONCURRENCY_LIMIT))

    def _get_client(self) -> AsyncInferenceClient:
        if self._client is None:
            self._client = AsyncInferenceClient(api_key=self._api_key)
        return self._client

    async def analyze_blog_content(self, content: str, platform: str = "general") -> Dict[str, Any]:
        if not self._api_key:
            return {"error": "HUGGINGFACE_API_KEY가 설정되지 않았습니다."}

        truncated = content[:settings.AI_MAX_INPUT_CHARS]
        prompt = get_prompt(platform)
        full_prompt = f"{prompt}\n\n[분석할 본문]\n{truncated}"

        max_attempts = max(1, settings.AI_MAX_RETRIES + 1)
        for attempt in range(1, max_attempts + 1):
            result = await self._call_hf(full_prompt, attempt)

            if result.get("_cold_start"):
                logger.warning(f"콜드 스타트 감지, {RETRY_DELAY}초 후 재시도 ({attempt}/{max_attempts})")
                await asyncio.sleep(RETRY_DELAY)
                continue

            return result

        return {"error": "HuggingFace 모델 로딩 시간 초과. 잠시 후 다시 시도해주세요."}

    async def _call_hf(self, prompt: str, attempt: int) -> Dict[str, Any]:
        try:
            client = self._get_client()
            timeout = max(1, settings.AI_REQUEST_TIMEOUT_SECONDS)

            async with self._semaphore:
                response = await asyncio.wait_for(
                    client.chat.completions.create(
                        model=HF_MODEL,
                        messages=[{"role": "user", "content": prompt}],
                        max_tokens=800,
                        temperature=0.2,
                    ),
                    timeout=timeout,
                )

            raw_text = response.choices[0].message.content
            return _extract_json(raw_text)

        except Exception as e:
            error_str = str(e)
            logger.error(f"HuggingFace 호출 오류 (시도 {attempt}): {error_str}")

            if "503" in error_str or "loading" in error_str.lower():
                return {"_cold_start": True}

            return {"error": f"HuggingFace 분석 중 오류: {error_str}"}


hf_engine = HuggingFaceEngine()
