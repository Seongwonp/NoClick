# No-Click

광고성 리뷰를 걸러내고, 글에 **안 적힌 단점**까지 복원하는 AI 리뷰 분석 서비스입니다.

[발표자료(PDF) 보기](https://github.com/user-attachments/files/27737001/No-Click_Ceaser_.pdf)

## What It Does

- 광고 패턴 하이라이트 (`highlighted_phrases`)
- 숨겨진 단점 추론 (`hidden_negatives`)
- 광고 확률/신뢰도 점수 산출 (`ad_probability`, `trust_score`)
- 다차원 성분 분석 (`dimension_scores`)
  - `authenticity`, `information`, `specificity`, `exaggeration`
- 분석 결과 저장 + 세션 기반 히스토리 조회

## Why It’s Different

- 플랫폼 무관 분석: `naver`, `insta`, `coupang`, `other`
- 단순 광고 판별이 아니라 “결핍 정보 기반” 추론
- 탈광고 요약과 절약 시간/비용 리포트까지 제공

## Tech Stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS v4
- Backend: FastAPI, SQLAlchemy, Alembic, SQLite
- AI: Gemini (primary), HuggingFace EXAONE (fallback), Claude (optional tuning)

## Quick Start

### 1) Backend

```bash
cd backend
cp .env.example .env
poetry install
poetry run alembic upgrade head
poetry run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- Swagger: `http://localhost:8000/docs`

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

- App: `http://localhost:5173`
- API Base(default): `http://localhost:8000/api/analysis`

## API

Base prefix: `/api/analysis`

1. `POST /analyze`
   - body: `content`, `platform`, `model`, `session_id`, `api_key(optional)`
2. `GET /history?session_id=...&limit=10&skip=0`
3. `GET /{analysis_id}`

## Security & Reliability

- 입력 검증: URL-only / 초단문 / 반복 / 비한국어 / 인젝션 패턴 차단
- Rate Limit: 기본 `10/minute` (IP 기준)
- CORS: `ALLOWED_ORIGINS` 기반 제한
- Gemini 다중 키 로테이션 + 재시도(backoff) + 캐시 적용

## Environment Variables

Backend (`backend/.env`):

- `GEMINI_API_KEYS`
- `HUGGINGFACE_API_KEY` (optional)
- `CLAUDE_API_KEY` (optional)
- `DATABASE_URL` (default: `sqlite:///./noclick.db`)
- `RATE_LIMIT` (default: `10/minute`)
- `ALLOWED_ORIGINS`

Frontend 배포 예시(`frontend/.env.production`):

- `VITE_API_URL`
- `VITE_APP_TITLE`
- `VITE_APP_VERSION`

## Project Structure

```text
NoClick/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── crud/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── services/
│   ├── alembic/
│   ├── .env.example
│   └── main.py
├── frontend/
│   ├── src/
│   └── package.json
├── README.md
├── CHANGELOG.md
└── AI_MASTER_CONTEXT.md
```
