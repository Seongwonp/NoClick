# No-Click 개발 변경 기록

> 팀원들이 서로의 작업을 파악할 수 있도록 주요 변경사항을 기록합니다.
> 형식: `[날짜] 담당자 — 작업 내용`

---

## 2026-05-09 | 성원 (AI & Backend)

### 🤖 AI 엔진
- **프롬프트 중간 케이스 추가** (`general`, `naver_store`, `instagram`)
  - 기존 광고/진성 2단계 → 광고/중간/진성 3단계로 확장
  - 중간 케이스: ad_probability 45~55 범위의 애매한 리뷰 예시 추가
  - 효과: AI가 50점대 애매한 글에서 흔들리던 문제 개선
- **플랫폼 alias 매핑 추가** (`prompts/__init__.py`)
  - `naver` → `naver_store`, `insta` → `instagram`, `other` → `general`
  - 기존: 프론트에서 `insta` 보내면 `GENERAL_PROMPT` 실행되는 버그 수정
  - 이제 프론트 enum 값(naver/insta/coupang/other)과 내부 프롬프트 자동 매핑

### 🔒 보안
- **입력 검증 5종 추가** (`ai_engine.py`)
  - URL 전용 입력 차단 (실수로 URL 붙여넣기 방지)
  - 키보드 난타/오타 차단 (기존 유지)
  - 20자 미만 짧은 텍스트 차단
  - 동일 패턴 5회 이상 반복 차단
  - 한국어 비율 5% 미만 차단
- **프롬프트 인젝션 탐지 추가** (`ai_engine.py`)
  - 한국어 패턴: "무시하고", "이전 지시", "시스템 프롬프트", "탈옥" 등
  - 영어 패턴: "ignore previous", "jailbreak", "act as", "DAN mode" 등
  - 감지 시 서버 로그에 기록 (추적 가능)

### 🗄️ DB
- **DB 모델 재설계** (`models/analysis.py`)
  - 기존 누락 필드 추가: `original_content`, `platform`, `model_used`, `hidden_intent`, `overall_verdict`, `session_id`
  - 불필요한 `url` 컬럼 제거 (텍스트 전용 서비스)
- **CRUD 레이어 구현** (`crud/__init__.py`)
  - `save_analysis()` — 분석 결과 저장
  - `get_analysis()` — ID로 단건 조회
  - `get_history()` — session_id 기준 히스토리 조회
- **API에 DB 저장 연결** (`api/analysis.py`)
  - 기존 `# TODO: DB 저장` → 실제 저장 로직 구현 완료
- **스키마에 session_id 추가** (`schemas/analysis.py`)
  - 프론트에서 localStorage UUID를 session_id로 전달하면 히스토리 기능 동작

### 📄 문서
- **README.md** 전면 업데이트 (팀원이 작성한 최신 버전 반영)
- **AI_MASTER_CONTEXT.md** 최신화
  - JSON 스펙에 `hidden_intent`, `overall_verdict` 추가
  - 플랫폼 enum 표 추가
  - 보안 설계 섹션 추가
  - 테스트 예시 업데이트 (platform, session_id 포함)
- **backend/DB_GUIDE.md** 신규 생성
  - 테이블 구조, JSON 컬럼 예시, CRUD 함수 설명
  - 히스토리 기능 연동 방법 (프론트 담당자용 가이드 포함)

---

## 히스토리 기능 연동 가이드 (프론트 담당자 → 아미/예솔)

백엔드 DB 저장이 완료됐으니 히스토리 페이지 연동 시 아래 내용 참고해줘!

### 1. session_id 생성 (localStorage)
```js
const sessionId = localStorage.getItem('nc_session')
  ?? (() => {
    const id = crypto.randomUUID();
    localStorage.setItem('nc_session', id);
    return id;
  })();
```

### 2. 분석 요청 시 session_id 포함
```js
const response = await fetch('/api/analysis/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: reviewText,
    platform: selectedPlatform,  // "naver" | "insta" | "coupang" | "other"
    model: "gemini",
    session_id: sessionId,
  }),
});
```

### 3. 히스토리 조회 API (백엔드 추가 예정)
```
GET /api/analysis/history?session_id={sessionId}
```

---

## 변경 기록 작성 방법

새 작업을 완료하면 아래 형식으로 이 파일에 추가해주세요:

```
## YYYY-MM-DD | 이름 (역할)

### 카테고리 (🤖 AI / 🎨 UI / 🗄️ DB / 🔒 보안 / 📄 문서)
- **작업 제목**: 상세 설명
```
