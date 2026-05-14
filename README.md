# No-Click
<p align="center">
  <img src="https://github.com/user-attachments/assets/54f459cb-125d-4569-ad04-61e859a9bf11" width="900" alt="No-Click 메인 화면" />
</p>

광고성 리뷰를 탐지하고, 글에 숨겨진 단점을 추론해 신뢰도 기반 분석 결과를 제공하는 AI 웹 서비스입니다.

- 서비스: https://noclick.pages.dev/
- 발표자료(PDF): https://github.com/user-attachments/files/27737001/No-Click_Ceaser_.pdf

## 주요 기능

- 광고성 표현/과장 문구 하이라이트
- 숨겨진 단점(`hidden_negatives`) 추론
- 광고 확률(`ad_probability`) 및 신뢰도(`trust_score`) 산출
- 세션 기반 분석 히스토리 조회
- 탈광고 요약 및 절약 시간/비용 리포트

## 개발 기간

- 2026.05.05 ~ 2026.05.14 (MVP 구현 및 배포 완료)

## 팀 소개

### 박성원 (AI & Backend)
- Gemini 3.0 Flash 기반 AI 분석 엔진 설계/최적화
- FastAPI 백엔드 아키텍처 및 보안 레이어 구축
- DB 스키마 설계 및 API 명세 수립

### 차아미 (Frontend Development)
- 사용자 중심 디자인 시스템 및 인터랙션 설계
- 브랜드 아이덴티티/시각 가이드라인 수립
- 프론트엔드 레이아웃 및 스타일링 최적화
- React 기반 웹 인터페이스 구현

### 서예솔 (UI/UX & Frontend)
- 실시간 AI 분석 결과 시각화 컴포넌트 개발
- 백엔드 API 연동 및 상태 관리 시스템 구축
- API JSON 매핑 및 TypeScript 타입 정의

## 기술 스택

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: FastAPI, SQLAlchemy, Alembic, SQLite
- AI: Gemini, HuggingFace(EXAONE fallback), Claude(선택)

## 로컬 실행

### 1) 백엔드

```bash
cd backend
cp .env.example .env
poetry install
poetry run alembic upgrade head
poetry run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- Swagger: `http://localhost:8000/docs`

### 2) 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

- 로컬 주소: `http://localhost:5173`

## 배포

- 프론트엔드: Cloudflare Pages
- 백엔드: Render Web Service

## API 요약

- `POST /api/analysis/analyze`
- `GET /api/analysis/history?session_id=...&limit=...&skip=...`
- `GET /api/analysis/{analysis_id}`

## 문서

- 변경 이력: [docs/CHANGELOG.md](./docs/CHANGELOG.md)
- DB 가이드: [docs/DB_GUIDE.md](./docs/DB_GUIDE.md)
- AI 내부 컨텍스트: [docs/AI_MASTER_CONTEXT.md](./docs/AI_MASTER_CONTEXT.md)
