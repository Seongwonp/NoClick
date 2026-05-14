# 🔍 No-Click — 리뷰의 진짜 얼굴을 보여주는 AI

> **어떤 플랫폼의 리뷰든, 텍스트를 붙여넣으면 30초 안에 광고 여부를 판별하고 숨겨진 단점을 복원합니다.**

---

## 💡 왜 No-Click인가?

온라인 리뷰의 상당수는 협찬·체험단·바이럴 글이지만, 대부분의 사용자는 이를 구분하지 못합니다.
기존 광고 탐지 도구는 "광고 같음 / 아님"만 판별하고 특정 플랫폼에 종속됩니다.

**No-Click은 다릅니다.**
- 광고 글이 *안 쓴 단점*이 무엇인지 AI가 추론합니다
- 네이버 블로그부터 쿠팡·인스타그램까지 플랫폼 무관 분석
- 탈광고 재작성으로 "진짜 리뷰"가 어떻게 보여야 하는지 제시합니다

---

## ✨ 핵심 기능 3가지

| 기능 | 설명 |
|------|------|
| 🕵️ **광고 패턴 탐지** | 플랫폼별 광고 표현을 형광펜으로 시각화 |
| 🔮 **숨긴 단점 복원** | "안 쓴 내용"을 AI가 역추론 |
| ✍️ **탈광고 재작성** | 광고가 없었다면 어떻게 썼을지 제안 |

---

## 🏗️ 기술 스택

```
Frontend   React + TypeScript + Tailwind CSS v4
Backend    Python 3.11 · FastAPI · SQLite
AI         Gemini 3.0 Flash-preview · EXAONE 3.5 · Claude 3.5 Sonnet
```

**분석 지원 플랫폼:** 네이버 블로그/지도 · 인스타그램 · 쿠팡 · 기타 전체

---

## 🚀 빠른 시작

```bash
# 1. 환경 변수 설정
cp .env.example .env   # API 키 입력

# 2. 백엔드
cd backend
poetry install
poetry run alembic upgrade head
poetry run python main.py

# 3. 프론트엔드
cd frontend
npm install && npm run dev
```

Swagger UI: `http://localhost:8000/docs`

---

## 📡 API

**`POST /api/analysis/analyze`** — 리뷰 분석 요청

| 파라미터 | 값 |
|---------|-----|
| `platform` | `naver` · `insta` · `coupang` · `other` |
| `model` | `gemini` · `huggingface` |

---

## 📂 프로젝트 구조

```
├── backend/
│   └── app/
│       ├── api/          # 라우터
│       ├── core/         # 프롬프트 & 설정
│       ├── services/     # AI 엔진 & 스크래퍼 (핵심)
│       └── models/       # DB 모델 & 스키마
├── frontend/
│   └── src/              # React 컴포넌트
└── .env.example
```

---

## 🎯 MVP 성공 기준

- **정확도** 85% 이상 (실제 바이럴 데이터 30개 기준)
- **속도** 결과 출력까지 30초 이내
- **안정성** 시연 중 무중단

---

## 🗓️ 개발 로드맵 (2주)

| 기간 | 작업 |
|------|------|
| Day 1–4 | 환경 세팅 완료 · 기획 확정 · 데이터 30개 수집 |
| Day 5–8 | AI 프롬프트 v1 · 스크래퍼 · UI 스켈레톤 |
| Day 9–12 | 추론 로직 고도화 · 형광펜 시각화 · 통합 테스트 |
| Day 13–14 | 최종 시뮬레이션 · 배포 |

---

## 🔭 향후 확장 계획

- **크롬 익스텐션** — 드래그만 하면 즉시 분석
- **B2B 리포트** — "진짜 단점" 데이터를 소상공인·기업에 판매

---

## 👥 팀

| 역할 | 담당 |
|------|------|
| AI & Backend | 성원 — AI 엔진 설계 · 프롬프트 튜닝 · DB 아키텍처 |
| Frontend | 아미 — 사용자 경험 설계 · UI 구현 |
| UI/UX & Frontend | 예솔 — 결과 시각화 · 형광펜 애니메이션.연결 |

---

*© 2026 No-Click Project Team. All Rights Reserved.*
