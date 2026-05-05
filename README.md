# 📋 No-Click: 블로그 후기 X-ray

**네이버 블로그 URL 1개를 넣으면 30초 안에 광고 여부를 추론하고, 글이 숨긴 진짜 단점을 복원해주는 서비스.**

---

## 🌟 프로젝트 핵심 가치
- **추론형 분석**: 단순히 광고를 분류하는 것이 아니라, 글의 맥락을 분석하여 '작성자가 의도적으로 숨긴 정보'를 AI가 추론합니다.
- **시각적 충격**: 원문 위에 직접 형광펜으로 광고 패턴을 칠해주는 인터랙티브 UI.
- **탈광고 재작성**: 바이럴 문구를 걷어내고 팩트만 남긴 '클린 요약' 제공.

## 🛠 기술 스택
### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Dependency Management**: Poetry
- **Database**: SQLite (SQLAlchemy ORM)
- **AI Engines**: Gemini 1.5 Flash (Main), Claude 3.5 Sonnet (Tuning)

### Frontend
- **Framework**: React (Vite) + TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Hooks

---

## 📂 프로젝트 구조
```text
.
├── backend/                # FastAPI 백엔드 프로젝트
│   ├── app/
│   │   ├── api/            # API 엔드포인트 (라우터)
│   │   ├── core/           # 설정(Config) 및 AI 프롬프트
│   │   ├── crud/           # 데이터베이스 CRUD 로직
│   │   ├── models/         # SQLAlchemy DB 모델
│   │   ├── schemas/        # Pydantic 데이터 스키마 (API 규격)
│   │   ├── services/       # AI 엔진, 스크래퍼 핵심 비즈니스 로직
│   │   └── database.py     # DB 연결 설정
│   ├── main.py             # 서버 실행 엔트리 포인트
│   ├── pyproject.toml      # Poetry 의존성 관리 파일
│   └── .env                # 백엔드 환경 변수 (Git 제외)
├── frontend/               # React 프론트엔드 프로젝트
│   ├── src/
│   │   ├── assets/         # 이미지 등 정적 자원
│   │   ├── App.tsx         # 메인 UI 컴포넌트
│   │   └── main.tsx        # 진입점
│   ├── .env.development    # 개발용 환경 변수
│   ├── .env.production     # 배포용 환경 변수
│   └── vite.config.ts      # Vite 설정 (Tailwind v4 포함)
├── .env.example            # 루트 환경 변수 샘플
├── .gitignore              # Git 제외 설정
└── README.md               # 프로젝트 문서
```

---

## 🚀 시작하기

### 1. 환경 변수 설정
루트와 프론트엔드 폴더에 각각 환경 변수 파일을 생성합니다.
- **Root**: `.env.example`을 `.env`로 복사 후 `GEMINI_API_KEY` 입력.
- **Frontend**: `frontend/.env.example`을 `frontend/.env.development`로 복사.

### 2. 백엔드 (Backend) 설치 및 실행
Poetry가 설치되어 있어야 합니다.
```bash
cd backend

# 1. 의존성 설치
poetry install

# 2. 가상환경 진입 (선택)
poetry shell

# 3. 서버 실행
python main.py
```
*서버는 기본적으로 `http://localhost:8000`에서 실행됩니다.*

### 3. 프론트엔드 (Frontend) 설치 및 실행
```bash
cd frontend

# 1. 패키지 설치
npm install

# 2. 개발 서버 실행
npm run dev
```
*기본 주소: `http://localhost:5173`*

---

## 📡 API 명세
- **POST `/api/analysis/analyze`**: 블로그 분석 요청
- **Swagger UI**: `http://localhost:8000/docs` 접속 시 상세 확인 가능

## 👥 팀원 및 역할
- **성원 (AI & Backend)**: AI 엔진 설계, 프롬프트 튜닝, DB 아키텍처.
- **아미 (Frontend)**: 결과 시각화 UI, 형광펜 애니메이션 구현.
- **예솔 (UI/UX & Frontend)**: 사용자 경험 설계 및 프론트엔드 구현.

---
© 2026 No-Click Project Team. All Rights Reserved.
