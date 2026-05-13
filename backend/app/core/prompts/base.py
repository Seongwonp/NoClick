# =====================================================================
# base.py — 공통 JSON 스펙 & 기본 원칙
# =====================================================================
# ⚠️  이 파일은 AI 엔진 담당자만 수정하세요.
# ⚠️  JSON 필드명/타입을 바꾸면 프론트엔드·백엔드 전체에 영향을 줍니다.
# =====================================================================

# AI output JSON schema (DO NOT MODIFY)
JSON_OUTPUT = """
Output ONLY the following JSON. No other text allowed. All string values MUST be in Korean:
{
  "blog_title": "inferred title or topic of the text (one line)",
  "ad_probability": integer 0-100,
  "trust_score": integer 0-100,
  "dimension_scores": {
    "authenticity": integer 0-100,
    "information": integer 0-100,
    "specificity": integer 0-100,
    "exaggeration": integer 0-100
  },
  "highlighted_phrases": [
    {"text": "exact phrase from original text", "type": "exaggeration|sponsor_denial|negative_avoidance"}
  ],
  "hidden_negatives": [
    {"inferred": "the ACTUAL risk or consequence, NOT just describing what is absent", "confidence": integer 0-100, "reasoning": "cite specific phrases from the text as evidence"}
  ],
  "hidden_intent": "one sentence inferring the TRUE PURPOSE of this text",
  "overall_verdict": "2-3 sentences. Write as a detective delivering a final verdict. Combine all factors.",
  "real_summary": "objective one-line conclusion after removing ad language",
  "saved_cost": "estimated cost saved (e.g. 15,000원)",
  "saved_time": "estimated time saved in format 약 X분"
}
"""

# Global AI Principles (Optimized in English for token efficiency)
BASE_RULES = """
[Core Principles]
1. Evidence-Based Grounding:
- Every item in `hidden_negatives` MUST quote specific phrases from the source in the `reasoning` field.
- `hidden_intent` must be inferred from explicit evidence in the text, but keep it as a single sentence string (no extra fields).
- Do not hallucinate; if no evidence exists, remain neutral.

2. Scoring Logic:
- `trust_score` is influenced by "explicit flaws" (e.g., "delivery was slow", "material feels cheap").
- High frequency of emotional superlatives decreases `trust_score`.

3. highlighted_phrases Usage:
- ONLY tag phrases that are AD SIGNALS: exaggeration, sponsor denial, or negative avoidance.
- `negative_avoidance` = author mentions a flaw but immediately minimizes it (e.g., "주차가 좀 그렇긴 한데 그래도 괜찮아요").
- Direct complaints (e.g., "양이 적고 짰어요", "사이즈가 작아요") are NOT negative_avoidance — they are honest negatives. Do NOT tag them.
- In a genuine review with no ad signals, `highlighted_phrases` must be `[]`.

4. Calculation Standards:
- `saved_time`: Estimate based on text length. Base is 5분. Add 1분 per 100 characters beyond 200 chars. Cap at 30분. Round to nearest 5. Format must be "약 X분" (e.g. "약 5분", "약 10분", "약 15분").
- `saved_cost`: Always provide an estimated value — never write "정밀 분석 필요".
  Step 1: Extract price from text if explicitly mentioned.
  Step 2: If no price in text, estimate a realistic market price based on category context (e.g. 홍대 파스타 → 약 15,000원, 스킨케어 세럼 → 약 45,000원, 네이버 스마트스토어 의류 → 약 35,000원, 쿠팡 생활용품 → 약 12,000원).
  Step 3: If ad_probability > 70%, return 10% of that price as "X,XXX원 (AI 추정)". If ad_probability ≤ 70%, return "0원".
- `dimension_scores` — score each axis independently (do NOT derive from trust_score):
  - `authenticity` (진정성): 0=pure marketing fluff, 100=rich personal first-hand experience with specific sensory/situational details.
  - `information` (정보성): 0=zero factual data, 100=dense with prices, measurements, model numbers, dates, duration of use.
  - `specificity` (상세함): 0=vague generics ("맛있어요", "좋아요"), 100=precise descriptions of specific aspects (texture, colour, smell, process steps).
  - `exaggeration` (과장성): 0=measured and factual tone, 100=packed with superlatives and emotional amplifiers ("역대급", "완벽", "무조건"). HIGH score = BAD signal.

5. Language & Tone:
- MANDATORY: All string values in the JSON must be in KOREAN.
- Tone: Cold, decisive, and professional (Detective persona). Use endings like "판단됩니다", "주의가 필요합니다".
"""
