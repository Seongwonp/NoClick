from google import genai
from google.genai import types
import json
import logging
import asyncio
import hashlib
import re
from time import monotonic
from typing import Dict, Any, Optional, Tuple
from app.core.config import settings
from app.core.prompts import get_prompt

logger = logging.getLogger(__name__)

_EMOJI_RE = re.compile(
    "[\U0001F300-\U0001F9FF"
    "\U00002600-\U000027BF"
    "\U0001FA00-\U0001FAFF"
    "\U00002702-\U000027B0"
    "\U0000FE00-\U0000FE0F"
    "\U00020000-\U0002FFFF"
    "]+",
    flags=re.UNICODE,
)
_STANDALONE_JAMO_RE = re.compile(r"[ㄱ-ㅣ]")
_URL_ONLY_RE = re.compile(r"^https?://\S*$")
_REPEAT_RE = re.compile(r"(.{2,})\1{5,}")

# 프롬프트 인젝션 탐지 패턴
_INJECTION_RE = re.compile(
    r"(무시\s*하고|이전\s*지시|지시를\s*무시|시스템\s*프롬프트|위의\s*모든"
    r"|새로운\s*역할|역할극\s*시작|넌\s*이제|너는\s*이제|당신은\s*이제"
    r"|api\s*키|비밀\s*키|ignore\s+previous|ignore\s+all|forget\s+previous"
    r"|you\s+are\s+now|act\s+as|jailbreak|dan\s+mode|developer\s+mode"
    r"|system\s*prompt|print\s+your\s+prompt|reveal\s+your|disregard"
    r"|override\s+instructions|새\s*지시사항|탈옥)",
    flags=re.IGNORECASE,
)

MIN_MEANINGFUL_CHARS = 20

GIBBERISH_ERROR = "오타인 것 같네요! 분석할 수 있는 내용을 입력해 주세요."
TOO_SHORT_ERROR = f"내용이 너무 짧아요! {MIN_MEANINGFUL_CHARS}자 이상 입력해 주세요."
URL_ERROR = "URL이 아닌 리뷰 본문 텍스트를 붙여넣어 주세요."
REPEAT_ERROR = "반복된 내용은 분석할 수 없어요! 실제 리뷰 텍스트를 입력해 주세요."
NO_KOREAN_ERROR = "한국어 리뷰 텍스트를 입력해 주세요."
INJECTION_ERROR = "리뷰 본문만 입력해 주세요."


def _strip_emojis(text: str) -> str:
    return _EMOJI_RE.sub("", text)


def _is_gibberish(text: str) -> bool:
    stripped = text.strip()
    if not stripped:
        return True
    jamo_count = len(_STANDALONE_JAMO_RE.findall(stripped))
    # 독립 자음/모음 비율이 40% 초과면 키보드 난타로 판단
    return jamo_count / len(stripped) > 0.4


def _is_too_short(text: str) -> bool:
    return len(text.strip()) < MIN_MEANINGFUL_CHARS


def _is_url_only(text: str) -> bool:
    return bool(_URL_ONLY_RE.match(text.strip()))


def _is_repetitive(text: str) -> bool:
    # ㅋㅋㅋ / ㅎㅎㅎ / ㅠㅠ 등 감정 표현용 연속 자모는 반복 판정 제외
    cleaned = re.sub(r"[ㄱ-ㅣ]{2,}", "", text.strip())
    return bool(_REPEAT_RE.search(cleaned))


def _has_no_korean(text: str) -> bool:
    stripped = text.strip()
    if not stripped:
        return False
    korean_count = len(re.findall(r"[가-힣]", stripped))
    return korean_count / len(stripped) < 0.05


def _is_injection(text: str) -> bool:
    return bool(_INJECTION_RE.search(text))

GEMINI_MODEL = "gemini-3-flash-preview"


class AIEngine:
    def __init__(self):
        self._keys = settings.gemini_api_keys
        self._exhausted_keys_until: Dict[str, float] = {}
        self._client_by_key: Dict[str, genai.Client] = {}
        self._semaphore = asyncio.Semaphore(max(1, settings.AI_CONCURRENCY_LIMIT))
        self._cache: Dict[str, Tuple[float, Dict[str, Any]]] = {}

    def _next_key(self) -> Optional[str]:
        now = monotonic()
        for key in self._keys:
            exhausted_until = self._exhausted_keys_until.get(key, 0)
            if exhausted_until <= now:
                return key
        return None

    def _exhaust_key(self, key: str):
        cool_until = monotonic() + max(1, settings.GEMINI_KEY_COOLDOWN_SECONDS)
        self._exhausted_keys_until[key] = cool_until
        logger.warning(
            f"Gemini 키 소진 처리 (끝 4자리: ...{key[-4:]}), "
            f"cooldown={settings.GEMINI_KEY_COOLDOWN_SECONDS}s"
        )

    def _get_client(self, api_key: str) -> genai.Client:
        if api_key not in self._client_by_key:
            self._client_by_key[api_key] = genai.Client(api_key=api_key)
        return self._client_by_key[api_key]

    def _cache_key(self, content: str, platform: str, model: str) -> str:
        digest = hashlib.sha256(content.encode("utf-8")).hexdigest()
        return f"{model}:{platform}:{digest}"

    def _cache_get(self, key: str) -> Optional[Dict[str, Any]]:
        row = self._cache.get(key)
        if not row:
            return None
        expires_at, payload = row
        if expires_at < monotonic():
            self._cache.pop(key, None)
            return None
        return dict(payload)

    def _cache_set(self, key: str, payload: Dict[str, Any]) -> None:
        if settings.AI_CACHE_TTL_SECONDS <= 0:
            return
        expires_at = monotonic() + settings.AI_CACHE_TTL_SECONDS
        self._cache[key] = (expires_at, dict(payload))

    async def analyze_blog_content(self, content: str, platform: str = "general", model: str = "gemini", api_key: Optional[str] = None) -> Dict[str, Any]:
        content = _strip_emojis(content)
        if _is_url_only(content):
            return {"error": URL_ERROR}
        if _is_injection(content):
            logger.warning("프롬프트 인젝션 시도 감지 (앞 50자): %s", content[:50])
            return {"error": INJECTION_ERROR}
        if _is_gibberish(content):
            return {"error": GIBBERISH_ERROR}
        if _is_too_short(content):
            return {"error": TOO_SHORT_ERROR}
        if _is_repetitive(content):
            return {"error": REPEAT_ERROR}
        if _has_no_korean(content):
            return {"error": NO_KOREAN_ERROR}

        # 사용자가 HuggingFace 선택 시 바로 전환
        if model == "huggingface":
            logger.info("사용자 선택: HuggingFace(EXAONE) 모드")
            from app.services.hf_engine import hf_engine
            return await hf_engine.analyze_blog_content(content, platform)

        truncated = content[:settings.AI_MAX_INPUT_CHARS]
        prompt = get_prompt(platform)
        full_prompt = f"{prompt}\n\n[분석할 본문]\n{truncated}"
        cache_key = self._cache_key(truncated, platform, model)
        cached = self._cache_get(cache_key)
        if cached:
            return cached

        # 사용자가 직접 키를 제공한 경우 → 해당 키로만 1회 호출 후 폐기
        if api_key:
            result = await self._call_gemini_with_retry(full_prompt, api_key)
            if result.get("_rate_limited"):
                return {"error": "제공하신 API 키의 사용량이 초과되었거나 모델에 접근할 수 없습니다."}
            if "error" not in result:
                self._cache_set(cache_key, result)
            return result

        # 서버 키 로테이션
        while True:
            key = self._next_key()
            if not key:
                # 모든 Gemini 키 소진 → HuggingFace 자동 전환
                logger.warning("Gemini 키 전부 소진 → HuggingFace(EXAONE)로 자동 전환")
                from app.services.hf_engine import hf_engine
                return await hf_engine.analyze_blog_content(content, platform)

            result = await self._call_gemini_with_retry(full_prompt, key)

            if result.get("_rate_limited"):
                self._exhaust_key(key)
                continue

            if "error" not in result:
                self._cache_set(cache_key, result)
            return result

    async def _call_gemini_with_retry(self, prompt: str, api_key: str) -> Dict[str, Any]:
        retries = max(0, settings.AI_MAX_RETRIES)
        base_delay = max(0.05, settings.AI_RETRY_BASE_DELAY_SECONDS)
        last_error: Optional[Dict[str, Any]] = None

        for attempt in range(retries + 1):
            result = await self._call_gemini_once(prompt, api_key)
            if not result.get("_retryable"):
                return result
            last_error = result
            if attempt < retries:
                await asyncio.sleep(base_delay * (2 ** attempt))

        return last_error or {"error": "AI 분석 중 오류가 발생했습니다."}

    async def _call_gemini_once(self, prompt: str, api_key: str) -> Dict[str, Any]:
        try:
            client = self._get_client(api_key)
            timeout = max(1, settings.AI_REQUEST_TIMEOUT_SECONDS)

            async with self._semaphore:
                response = await asyncio.wait_for(
                    client.aio.models.generate_content(
                        model=GEMINI_MODEL,
                        contents=prompt,
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                            temperature=0.2,
                        ),
                    ),
                    timeout=timeout,
                )

            if not response.text:
                return {"error": "AI 응답이 비어있습니다.", "_retryable": True}

            return json.loads(response.text.strip())

        except asyncio.TimeoutError:
            logger.error("Gemini 호출 타임아웃")
            return {"error": "AI 호출 타임아웃", "_retryable": True}
        except json.JSONDecodeError as e:
            logger.error(f"Gemini JSON 파싱 오류: {e}")
            return {"error": "AI JSON 파싱 오류", "_retryable": True}

        except Exception as e:
            error_str = str(e)
            logger.error(f"Gemini 호출 오류 (전체): {error_str}")
            if "429" in error_str or "quota" in error_str.lower() or "rate" in error_str.lower():
                return {"_rate_limited": True}
            retryable = any(token in error_str.lower() for token in ["503", "timeout", "temporar", "unavailable"])
            return {"error": f"AI 분석 중 오류: {error_str}", "_retryable": retryable}


ai_engine = AIEngine()
