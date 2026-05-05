# 📋 No-Click: 모든 리뷰 플랫폼의 텍스트 X-ray

**네이버 블로그, 네이버 지도, 구글 맵, 쿠팡, 맘카페, 인스타그램 등 모든 리뷰 플랫폼의 텍스트를 붙여넣으면 광고 여부를 추론하고, 글이 의도적으로 숨긴 단점을 복원하며, 광고가 없었다면 어떻게 썼을지를 재작성해주는 AI 웹 서비스입니다.**

---

## 1. 서비스 개요
- **한 줄 정의**: 어떤 플랫폼의 리뷰든, 진짜 얼굴을 30초 안에 보여주는 서비스.

## 2. 문제 정의
온라인 리뷰의 상당수가 협찬·바이럴·체험단 글이지만 일반 사용자는 구분이 어렵습니다. 플랫폼마다 광고 표시 의무가 다르고, 표시하더라도 "협찬 받음" 한 줄에 그쳐서 글이 의도적으로 숨긴 단점은 여전히 가려져 있습니다. 사용자는 이를 모르고 시간과 돈을 낭비하게 됩니다. 
기존 광고 탐지기는 "광고 같음 / 아님"만 판별하고 특정 플랫폼에 한정되지만, No-Click은 어떤 플랫폼이든 텍스트만 붙여넣으면 분석하고, 숨긴 단점 복원과 탈광고 재작성까지 수행합니다.

## 3. 핵심 가설
- **"광고 글은 단점을 안 쓴다. 하지만 안 쓴 단점이 무엇인지 AI가 추론할 수 있다면 그게 진짜 가치다."**
- 플랫폼마다 광고 패턴이 다릅니다. (예: 네이버 블로그는 "내돈내산" 강조, 쿠팡은 체험단 문구 반복, 인스타그램은 해시태그 과다 등). No-Click은 사용자가 선택한 플랫폼에 맞춰 최적화된 분석을 수행합니다.

## 4. 타겟 사용자
- **1차 타겟**: 20~40대 중 검색 후 구매/방문 결정을 자주 내리는 사람
- **2차 타겟**: 리뷰를 직접 쓰는 블로거나 인플루언서 (발행 전 자신의 글이 광고처럼 보이지 않는지 자가진단 용도)

## 5. 차별화 포인트 3가지
1. **플랫폼 무관 범용 분석**: 드롭다운으로 플랫폼을 선택하면 해당 플랫폼 광고 패턴에 최적화된 프롬프트로 분석합니다. (크롤링 없이 안정적)
2. **추론형 분석**: 단순 광고 분류가 아니라 숨긴 단점 복원과 탈광고 재작성까지 수행합니다.
3. **플랫폼별 맞춤 UI**: 네이버 블로그를 선택하면 블로그처럼, 쿠팡을 선택하면 쿠팡 리뷰처럼 보이는 UI를 제공하고 그 위에 형광펜으로 광고 패턴을 칠해 한눈에 맥락을 파악할 수 있는 시각적 경험을 제공합니다.

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
- **POST `/api/analysis/analyze`**: 리뷰 분석 요청
  - **Platform Enum (플랫폼 구분값)**: 백엔드 요청 시 사용하는 플랫폼 식별자입니다.
    - `naver`: 네이버 블로그/지도 등
    - `insta`: 인스타그램
    - `coupang`: 쿠팡
    - `other`: 기타 플랫폼
- **Swagger UI**: `http://localhost:8000/docs` 접속 시 상세 확인 가능

## 👥 팀원 및 역할
- **성원 (AI & Backend)**: AI 엔진 설계, 프롬프트 튜닝, DB 아키텍처.
- **아미 (Frontend)**: 결과 시각화 UI, 형광펜 애니메이션 구현.
- **예솔 (UI/UX & Frontend)**: 사용자 경험 설계 및 프론트엔드 구현.

---
© 2026 No-Click Project Team. All Rights Reserved.
