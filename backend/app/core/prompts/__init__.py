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

def get_prompt(platform: str) -> str:
    return PROMPTS.get(platform, GENERAL_PROMPT)
