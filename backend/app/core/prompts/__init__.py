from .instagram import INSTAGRAM_PROMPT
from .naver_store import NAVER_STORE_PROMPT
from .coupang import COUPANG_PROMPT
from .general import GENERAL_PROMPT

PROMPTS = {
    "instagram": INSTAGRAM_PROMPT,
    "naver_store": NAVER_STORE_PROMPT,
    "coupang": COUPANG_PROMPT,
    "general": GENERAL_PROMPT,
}

# 프론트엔드 enum 값 → 내부 프롬프트 키 매핑
_ALIASES = {
    "naver": "naver_store",
    "insta": "instagram",
    "other": "general",
}

def get_prompt(platform: str) -> str:
    resolved = _ALIASES.get(platform, platform)
    return PROMPTS.get(resolved, GENERAL_PROMPT)
