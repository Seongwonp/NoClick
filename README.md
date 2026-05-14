# No-Click


리뷰 본문 텍스트를 분석해 광고성 패턴, 숨겨진 단점, 요약 결론을 제공하는 FastAPI + React 프로젝트입니다.

## 핵심 기능

- 광고 표현/과장 문구 하이라이트
- 숨겨진 단점 추론 (`hidden_negatives`)
- 신뢰도 점수/광고 확률 점수 제공
- 분석 히스토리 저장/조회

## 기술 스택

- Frontend: React 19, TypeScript, Vite, Tailwind CSS v4
- Backend: FastAPI, SQLAlchemy, Alembic, SQLite
- AI: Gemini / HuggingFace(EXAONE fallback)

## 빠른 시작

### 1) Backend 실행

```bash
cd backend
cp .env.example .env
poetry install
poetry run alembic upgrade head
poetry run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- API 문서: `http://localhost:8000/docs`

### 2) Frontend 실행

```bash
cd frontend
npm install
npm run dev
```

- 기본 주소: `http://localhost:5173`
- 기본 API 주소: `http://localhost:8000/api/analysis`

## 환경 변수

Backend(`backend/.env`) 주요 항목:

- `GEMINI_API_KEYS` (쉼표 구분 다중 키 지원)
- `HUGGINGFACE_API_KEY` (선택)
- `CLAUDE_API_KEY` (선택)
- `DATABASE_URL` (기본 `sqlite:///./noclick.db`)
- `RATE_LIMIT` (기본 `10/minute`)
- `ALLOWED_ORIGINS` (콤마 구분)

Frontend 배포 변수 예시는 `frontend/.env.production` 참고:

- `VITE_API_URL`
- `VITE_APP_TITLE`
- `VITE_APP_VERSION`

## API 요약

기본 prefix: `/api/analysis`

1. `POST /analyze`
   - 요청: `content`, `platform`, `model`, `session_id`, `api_key(optional)`
   - `platform`: `naver | insta | coupang | other` (미지정 시 백엔드 기본값 `general`)
   - `model`: `gemini | huggingface`

2. `GET /history?session_id=...&limit=10&skip=0`
   - 세션별 분석 이력 조회 (페이지네이션)

3. `GET /{analysis_id}`
   - 단건 분석 결과 조회

## 프로젝트 구조

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

____

[No-Click_Ceaser_발표.pdf](https://github.com/user-attachments/files/27737001/No-Click_Ceaser_.pdf)

