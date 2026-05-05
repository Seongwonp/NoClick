# 🧠 No-Click Project Master Context for AI Agents

이 문서는 AI(Claude, Gemini 등)가 **No-Click: 블로그 후기 X-ray** 프로젝트의 철학과 기술적 맥락을 완벽히 이해하도록 돕는 마스터 가이드입니다.

---

## 1. 프로젝트 비전 (Project Vision)
- **아이템 명**: No-Click (블로그 후기 X-ray)
- **한 줄 정의**: 네이버 블로그 URL 1개를 분석하여 광고 여부를 추론하고, 글이 숨긴 진짜 단점을 복원해주는 서비스.
- **문제 정의**: 광고 표시 의무화에도 불구하고 '글에 안 적힌 단점(주차, 불친절 등)'은 여전히 가려져 있어 사용자의 시간과 돈이 낭비됨.
- **핵심 가설**: "광고 글은 단점을 쓰지 않는다. AI는 '결핍된 정보'를 통해 단점을 추론할 수 있다."

## 2. 차별화 포인트 (Uniqueness)
1. **추론형 분석**: 단순 분류가 아닌 "숨긴 단점 복원" (GPT 래퍼 수준을 넘어선 추론).
2. **시각적 충격**: 원문 위에 형광펜 하이라이트로 광고 패턴을 직접 시각화.
3. **탈광고 재작성**: 광고 문구를 걷어낸 '진짜 결론'과 '절약 비용/시간' 제시.
4. **재미 요소**: '이번 주 광고왕 명예의 전당', '자가진단 모드' 등.

## 3. 기술 아키텍처 (Tech Stack)
- **Backend**: FastAPI (Python 3.11+), SQLAlchemy, Alembic.
- **Frontend**: React (Vite) + TS, Tailwind CSS v4.
- **AI Engines**: 
  - **Gemini 3.0 Flash-preview** (Main Analysis)
  - **EXAONE 3.5** (HuggingFace comparison)
  - **Claude 3.5 Sonnet** (Advanced Reasoning & Prompt Tuning)
- **Storage**: SQLite (MVP)

## 4. 데이터 계약 (JSON Output Schema)
```json
{
  "ad_probability": 0-100,
  "trust_score": 0-100,
  "highlighted_phrases": [
    {"text": "문구", "type": "exaggeration|sponsor_denial|negative_avoidance"}
  ],
  "hidden_negatives": [
    {"inferred": "추론된 단점", "confidence": 0-100, "reasoning": "근거"}
  ],
  "real_summary": "한 줄 결론",
  "saved_cost": "15,000원",
  "saved_time": "30분"
}
```

## 5. 수사 수칙 (Detective's Logic)
AI는 다음 '결핍 분석' 기법을 반드시 적용해야 합니다:
- **공간 결핍**: 특정 각도 사진만 반복 -> "매장 협소 혹은 노후"
- **접근 결핍**: 주차 언급 없이 대중교통만 강조 -> "주차 불편"
- **가격 결핍**: 가격 언급 회피 혹은 불투명한 메뉴판 -> "가성비 낮음"
- **객관성 결핍**: 타 경쟁사 비교 없이 극찬만 나열 -> "협찬 100%"

---
**주의**: 너는 단순히 텍스트를 요약하는 비서가 아니다. 너는 광고 뒤에 숨겨진 진실을 파헤치는 **'냉철한 수사관'**임을 잊지 마라.
