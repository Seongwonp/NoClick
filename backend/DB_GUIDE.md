# No-Click DB 가이드

> 담당: 성원 | 최종 수정: 2026-05-09

---

## 개요

SQLite 단일 파일 DB (`noclick.db`), 테이블 1개로 전체 서비스 운영.

---

## 테이블 구조 — `analyses`

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | INTEGER (PK) | 자동 증가 |
| `session_id` | STRING | 익명 사용자 식별 (프론트에서 localStorage UUID 생성 후 전달) |
| `platform` | STRING | `naver` \| `insta` \| `coupang` \| `other` |
| `model_used` | STRING | `gemini` \| `huggingface` |
| `original_content` | TEXT | 사용자가 입력한 원본 텍스트 |
| `blog_title` | STRING | AI가 추론한 글 제목 |
| `ad_probability` | INTEGER | 광고 확률 0~100 |
| `trust_score` | INTEGER | 신뢰도 점수 0~100 |
| `highlighted_phrases` | JSON | 광고성 문구 목록 |
| `hidden_negatives` | JSON | 숨겨진 단점 목록 |
| `hidden_intent` | TEXT | AI가 추론한 글의 숨겨진 의도 |
| `overall_verdict` | TEXT | 수사관 종합 판정 |
| `real_summary` | TEXT | 탈광고 요약 |
| `saved_cost` | STRING | 예상 절약 비용 (예: "15,000원") |
| `saved_time` | STRING | 예상 절약 시간 (예: "30분") |
| `created_at` | DATETIME | 분석 시각 (자동 기록) |

---

## JSON 컬럼 상세

### `highlighted_phrases`
```json
[
  {
    "text": "역대급 맛집",
    "type": "exaggeration"
  },
  {
    "text": "광고 아님 내돈내산",
    "type": "sponsor_denial"
  },
  {
    "text": "주차가 좀 그렇긴 한데 그래도 괜찮아요",
    "type": "negative_avoidance"
  }
]
```

### `hidden_negatives`
```json
[
  {
    "inferred": "주차 사실상 불가 — 방문 시 주차비 및 이동 불편 감수 필요",
    "confidence": 92,
    "reasoning": "'대중교통 강추'만 반복하고 주차 정보 완전 누락"
  }
]
```

---

## CRUD 함수

`backend/app/crud/__init__.py`

| 함수 | 설명 |
|------|------|
| `save_analysis(db, response, platform, model_used, session_id)` | 분석 결과 저장 |
| `get_analysis(db, analysis_id)` | ID로 단건 조회 |
| `get_history(db, session_id, limit=20)` | 세션별 히스토리 조회 |

---

## 히스토리 기능 연동 방법 (프론트 담당자 참고)

1. 앱 최초 실행 시 `localStorage`에 UUID 생성
   ```js
   const sessionId = localStorage.getItem('nc_session') 
     ?? (() => { const id = crypto.randomUUID(); localStorage.setItem('nc_session', id); return id; })();
   ```

2. 분석 요청 시 `session_id` 필드에 포함
   ```json
   {
     "content": "리뷰 본문...",
     "platform": "naver",
     "session_id": "550e8400-e29b-41d4-a716-446655440000"
   }
   ```

3. 히스토리 조회 API (백엔드 팀 구현 예정)
   ```
   GET /api/analysis/history?session_id=550e8400-...
   ```

---

## DB 초기화 방법

```bash
cd backend
poetry run alembic upgrade head
```

> Alembic 마이그레이션 파일이 없는 경우 아래 명령으로 생성:
> ```bash
> poetry run alembic revision --autogenerate -m "init"
> poetry run alembic upgrade head
> ```

---

## 참고

- DB 파일 위치: `backend/noclick.db`
- `.gitignore`에 `noclick.db` 포함됨 (커밋 안 됨)
- 개발 환경: SQLite / 운영 확장 시 PostgreSQL 전환 가능 (`DATABASE_URL` 환경변수만 변경)
