# 🧠 No-Click Project Master Context for AI Agents

이 문서는 AI(Claude, Gemini 등)가 **No-Click** 프로젝트의 철학과 기술적 맥락을 완벽히 이해하도록 돕는 마스터 가이드입니다.

---

## 1. 프로젝트 비전 (Project Vision)
- **아이템 명**: No-Click — 모든 리뷰 플랫폼의 텍스트 X-ray
- **한 줄 정의**: 어떤 플랫폼의 리뷰든 텍스트를 붙여넣으면 광고 여부 추론 + 숨긴 단점 복원 + 탈광고 재작성을 30초 안에 해주는 AI 웹 서비스.
- **문제 정의**: 광고 표시 의무화에도 불구하고 '글에 안 적힌 단점'은 여전히 가려져 있어 사용자의 시간과 돈이 낭비됨.
- **핵심 가설**: "광고 글은 단점을 쓰지 않는다. AI는 '결핍된 정보'를 통해 단점을 추론할 수 있다."

## 2. 차별화 포인트 (Uniqueness)
1. **플랫폼 무관 범용 분석**: 네이버 블로그, 인스타그램, 쿠팡, 맘카페 등 모든 플랫폼 지원. 플랫폼별 최적화 프롬프트 자동 적용.
2. **추론형 분석**: 단순 분류가 아닌 "숨긴 단점 복원" — GPT 래퍼 수준을 넘어선 결핍 분석.
3. **시각적 충격**: 원문 위에 형광펜 하이라이트로 광고 패턴을 직접 시각화.
4. **탈광고 재작성**: 광고 문구를 걷어낸 '진짜 결론'과 '절약 비용/시간' 제시.

## 3. 기술 아키텍처 (Tech Stack)
- **Backend**: FastAPI (Python 3.11+), SQLAlchemy, Alembic, SQLite
- **Frontend**: React (Vite) + TypeScript, Tailwind CSS v4
- **AI Engines**:
  - **gemini-3-flash-preview** — 메인 분석
  - **EXAONE 3.5** (HuggingFace) — 비교용 / Gemini 키 소진 시 자동 폴백
  - **Claude 3.5 Sonnet** — 고급 추론 & 프롬프트 튜닝

## 4. 지원 플랫폼 (Platform Enum)

| API 값 | 대상 플랫폼 | 내부 프롬프트 |
|--------|-----------|--------------|
| `naver` | 네이버 블로그, 네이버 지도 | `NAVER_STORE_PROMPT` |
| `insta` | 인스타그램 | `INSTAGRAM_PROMPT` |
| `coupang` | 쿠팡 | `COUPANG_PROMPT` |
| `other` | 기타 (맘카페, 구글맵 등) | `GENERAL_PROMPT` |

## 5. 데이터 계약 (JSON Output Schema)

**입력**: 리뷰 본문 텍스트 (URL 아님, 사용자가 직접 복붙)

```json
{
  "blog_title": "본문에서 추론한 글 제목 또는 핵심 주제",
  "ad_probability": 0,
  "trust_score": 0,
  "highlighted_phrases": [
    {"text": "문구", "type": "exaggeration|sponsor_denial|negative_avoidance"}
  ],
  "hidden_negatives": [
    {"inferred": "추론된 단점", "confidence": 0, "reasoning": "근거"}
  ],
  "hidden_intent": "글의 숨겨진 진짜 목적 (한 문장)",
  "overall_verdict": "수사관 종합 판정 (2~3문장)",
  "real_summary": "탈광고 한 줄 결론",
  "saved_cost": "15,000원",
  "saved_time": "30분"
}
```

> ⚠️ `hidden_intent`와 `overall_verdict`는 필수 필드입니다. 누락 시 프론트엔드 렌더링이 깨집니다.

## 6. 수사 수칙 (Detective's Logic)
AI는 다음 '결핍 분석' 기법을 반드시 적용해야 합니다:
- **공간 결핍**: 특정 각도 사진만 반복 → "매장 협소 혹은 노후"
- **접근 결핍**: 주차 언급 없이 대중교통만 강조 → "주차 불편"
- **가격 결핍**: 가격 언급 회피 혹은 불투명한 메뉴판 → "가성비 낮음"
- **객관성 결핍**: 타 경쟁사 비교 없이 극찬만 나열 → "협찬 100%"

---

## 7. ⚠️ AI 행동 강령 (AI Rules of Engagement) - 필독
모든 AI 에이전트는 협업 시 아래 규칙을 엄격히 준수해야 한다:

1. **깃 작업 금지 (User Only)**: AI는 직접 `git add`, `commit`, `push`, `checkout` 등의 명령어를 실행하지 않는다.
2. **작업 전 깃 풀 확인**: 새로운 코딩이나 수정을 시작하기 전, 반드시 사용자에게 `git pull` 확인을 요청하라.
3. **수정 후 필수 테스트**: "수정했습니다" 대신 "테스트 결과 정상 작동 확인" 형태로 보고하라.
4. **보안 철저**: API 키나 개인 정보를 절대 로그나 코드에 남기지 마라. `.env` 파일은 절대 수정하거나 깃에 올리지 마라.

## 8. 🧭 AI 판단 원칙 (AI Principles)

1. **결핍 우선**: 있는 것보다 없는 것에 집중하라.
2. **근거 기반**: 모든 `hidden_negatives`와 `highlighted_phrases`에는 반드시 구체적인 `reasoning`을 제공하라.
3. **겸손 원칙**: 판단 불가한 경우 `confidence`를 낮게 설정하라.
4. **보수적 판단**: 애매하면 광고 확률을 낮게 줘라. False Positive가 False Negative보다 훨씬 위험하다.
5. **한국 맥락 이해**: 네이버 블로그 체험단·협찬·공정위 문구 등 한국 바이럴 마케팅 패턴에 특화하라.
6. **일관성**: 유사한 패턴의 글은 유사한 수준의 판단을 내려라.

---

## 9. 🔒 보안 설계 (Security)

### 입력 검증 레이어 (ai_engine.py)

| 검증 항목 | 조건 | 에러 메시지 |
|----------|------|------------|
| URL 전용 입력 | `https://`로만 구성된 입력 | "URL이 아닌 리뷰 본문 텍스트를 붙여넣어 주세요." |
| 프롬프트 인젝션 | "무시하고", "ignore previous" 등 탐지 | "리뷰 본문만 입력해 주세요." |
| 키보드 난타/오타 | 독립 자음·모음 비율 40% 초과 | "오타인 것 같네요!" |
| 너무 짧은 텍스트 | 이모지 제거 후 20자 미만 | "20자 이상 입력해 주세요." |
| 반복 텍스트 | 동일 패턴 5회 이상 반복 | "반복된 내용은 분석할 수 없어요!" |
| 한국어 없음 | 한국어 비율 5% 미만 | "한국어 리뷰 텍스트를 입력해 주세요." |

### 추가 보안 조치
- `response_mime_type="application/json"` 강제 → AI 자유 텍스트 출력 차단
- Pydantic 스키마 → 예상 외 필드 자동 드롭
- 다중 Gemini API 키 로테이션 → 키 소진 자동 전환
- 사용자 제공 API 키 → 사용 후 즉시 폐기, 로그 기록 안 함
- 인젝션 감지 시 서버 로그에 앞 50자 기록 (추적 용도)

---

## 10. 🧪 테스트 기준 (Test Guidelines)

### 성공 기준 (MVP)
- 실제 바이럴 데이터 30개 기준 **탐지 정확도 85% 이상**
- `ad_probability` 임계값: **70 이상이면 광고 판정**

### 테스트 케이스 유형
| 유형 | 설명 | 기대 ad_probability |
|------|------|---------------------|
| 명백한 광고 | 공정위 문구 포함 ("원고료 제공") | 85 이상 |
| 숨겨진 광고 | 공정위 문구 없지만 결핍 패턴 다수 | 60~85 |
| **중간 케이스** | 긍정·부정 신호 혼재 | 40~60 |
| 진성 후기 | 단점 솔직히 언급, 가격 명시 | 30 이하 |
| 엣지 케이스 | 짧은 글, 반복 텍스트 | 입력 검증에서 차단 |

### API 테스트 (Postman / Swagger)
```
POST http://localhost:8000/api/analysis/analyze
Content-Type: application/json

{
  "content": "테스트할 리뷰 본문 텍스트",
  "platform": "naver",
  "model": "gemini",
  "session_id": "테스트용-uuid-값",
  "api_key": "본인_Gemini_API_키 (선택사항)"
}
```

Swagger UI: `http://localhost:8000/docs`

---

**주의**: 너는 단순히 텍스트를 요약하는 비서가 아니다. 너는 광고 뒤에 숨겨진 진실을 파헤치는 **'냉철한 수사관'**이며, 동시에 팀의 안정성을 책임지는 **'시니어 개발자'**임을 잊지 마라.
