# 📋 No-Click: 블로그 후기 X-ray

**네이버 블로그 URL 1개를 넣으면 30초 안에 광고 여부를 추론하고, 글이 숨긴 진짜 단점을 복원해주는 서비스.**

---

## 🌟 프로젝트 미션
> "광고 글은 단점을 안 쓴다. 하지만 **안 쓴 단점이 무엇인지** AI가 추론할 수 있다면, 그게 진짜 가치"

## 🎯 성공 기준 (MVP)
- **정확도**: 실제 바이럴 데이터 30개 기준 탐지 정확도 85% 이상.
- **속도**: URL 입력 후 결과 출력까지 30초 이내.
- **안정성**: 시연 중 무중단 서비스 제공.

## 🚀 기술 스택
- **Backend**: Python 3.11+, FastAPI, Poetry, SQLite.
- **Frontend**: React, TypeScript, Tailwind CSS v4 ([Docs](https://tailwindcss.com/docs/aspect-ratio)).
- **AI Engines**: Gemini 3.0 Flash-preview, EXAONE 3.5, Claude 3.5 Sonnet.

## 📅 로드맵 (2주)
- **Day 1-4**: 기초 환경 세팅(완료), 기획 확정, 바이럴 데이터 30개 수집.
- **Day 5-8**: AI 프롬프트 v1 튜닝, 블로그 스크래퍼 개발, UI 스켈레톤 구축.
- **Day 9-12**: AI 추론 로직 고도화, 결과 시각화(형광펜 애니메이션), 통합 테스트.
- **Day 13-14**: 최종 시뮬레이션 및 배포 준비.

---

## 📂 프로젝트 구조
```text
.
├── backend/                # FastAPI 백엔드
│   ├── app/
│   │   ├── api/            # 라우터
│   │   ├── core/           # 프롬프트 & 설정
│   │   ├── crud/           # DB 조작
│   │   ├── models/         # DB 모델
│   │   ├── schemas/        # 데이터 스펙
│   │   └── services/       # AI 엔진 & 스크래퍼 (핵심)
│   └── database.py         # DB 연결
├── frontend/               # React 프론트엔드
│   └── src/                # UI 컴포넌트
├── .env.example            # 환경변수 샘플
├── AI_MASTER_CONTEXT.md    # AI 에이전트용 가이드
└── README.md               # 프로젝트 문서
```

## 🏃 시작하기 (Quick Start)
1. **환경 변수**: `.env.example` -> `.env` 복사 후 API 키 입력.
2. **백엔드**: `cd backend && poetry install && poetry run alembic upgrade head && python main.py`
3. **프론트엔드**: `cd frontend && npm install && npm run dev`

---
© 2026 No-Click Project Team (성원, 아미, 예솔).
