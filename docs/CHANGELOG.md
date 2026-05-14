# No-Click 개발 변경 기록

> 새 작업 완료 시 아래 형식으로 추가해주세요:
> ```
> ## YYYY-MM-DD | 이름 (역할)
> ### 카테고리 (🤖 AI / 🎨 UI / 🗄️ DB / 🔒 보안 / 📄 문서 / 🔧 백엔드)
> - **작업 제목**: 상세 설명
> ```

---

## 2026-05-13 | 성원 (AI & Backend)

### 🤖 AI 엔진
- **다차원 성분 분석 `dimension_scores` 추가** (`base.py`)
  - 기존: 레이더 차트가 `trust_score` ± 상수로 가짜 다차원을 연출
  - 수정: AI가 4개 축을 독립적으로 채점 후 JSON에 포함
  - `authenticity` (진정성): 실제 경험 밀도
  - `information` (정보성): 가격·수치·날짜 등 팩트 밀도
  - `specificity` (상세함): 구체 묘사 vs 뭉뚱그린 칭찬
  - `exaggeration` (과장성): 최상급 표현 빈도 (높을수록 광고 신호)
- **`saved_time` 규칙 정교화** — "항상 5분" → 글자수 기반 동적 계산
  - 200자 기준 5분, 100자마다 1분 추가, 최대 30분, "약 X분" 형식
- **`saved_cost` 가격 추정 추가** — 텍스트에 가격 없어도 AI가 카테고리 시장가 추정
  - 예: 홍대 파스타 → 약 15,000원, 스킨케어 세럼 → 약 45,000원
  - ad_probability > 70% → 추정가의 10%를 "X,XXX원 (AI 추정)" 으로 반환

### 🗄️ DB
- **`dimension_scores` 컬럼 추가** (`models/analysis.py`, `002_add_dimension_scores.py`)
  - JSON 타입, nullable — 기존 레코드 영향 없음
  - `alembic upgrade head` 로 반영 완료

### 🔧 백엔드
- **스키마/CRUD/API 라우트에 `dimension_scores` 반영** (`schemas`, `crud`, `api/analysis.py`)
  - `/analyze`, `/history`, `/{id}` 3개 엔드포인트 모두 반영

### 🎨 UI
- **레이더 차트 실데이터 연결** (`Result.tsx`)
  - `dimension_scores` 있으면 실값 사용, 없으면 기존 fallback 유지 (하위 호환)
- **절약 리포트 카드 문구 개선** (`Result.tsx`)
  - "절약한 예상 시간" → **"당신의 소중한 시간 약 X분을 지켜드렸습니다"**
  - "절약한 예상 비용" → **"광고에 속을 뻔한 비용"** + AI 추정 disclaimer 추가
  - `* AI가 예상한 금액으로 실제와 다를 수 있습니다` 소문자 주석 표시

### 📄 문서
- **PPT 개선판 반영** (`No-Click_PPT.pptx`, 17 슬라이드)
  - 슬라이드 4 신규: 페르소나 (28세 직장인 김지연 스토리)
  - 슬라이드 9: 실제 분석 결과 예시 (광고 확률 89%, 숨겨진 단점 3개)
  - 슬라이드 13 신규: 내부 테스트 기반 성능 지표
  - 슬라이드 15 팀: 차아미·서예솔 작업 상태 "완료"로 업데이트
  - 슬라이드 16 비전: "Gemini 3.0 Flash 도입" → "B2B API 서비스 론칭"으로 교체

---

## 2026-05-12 | 성원 (AI & Backend) + 차아미 (Frontend)

### 🔀 병합
- **`front-back_ver2` + `back_ver1` 최종 병합** (`merge/front-backend` 브랜치)
  - 차아미 UI (새 디자인 시스템, MockPlatformViewer 애니메이션) 채택
  - 성원 실백엔드 API 연동 유지
  - 타입 충돌 해결: `rewritten_text` → `overall_verdict`, `original_text` → `original_content`

### 🎨 UI
- **MockPlatformViewer 하이라이트 애니메이션 개선** (`MockPlatformViewer.tsx`)
  - `activePhraseIndices: Set<number>` 기반 순차 애니메이션 (back_ver1 버전 채택)
  - 플랫폼별 Mock UI: Naver / Coupang / Instagram / Other

### 🐛 버그 수정
- **히스토리 클릭 시 재분석 버그 수정** (`History.tsx`)
  - 원인: `navigate('/result', { state: { id } })` → `Result.tsx`는 URL query만 읽음
  - 수정: `navigate('/result?id=${item.id}')` 로 변경

### 🔒 보안
- **`.gitignore` 보완** — `.env`, `*.db-shm`, `*.db-wal` 추가
  - `back_ver1` 브랜치에 `.env` 실키 커밋된 이력 확인 → `merge/front-backend`에는 미포함 확인

---

## 2026-05-09 | 성원 (AI & Backend)

### 🤖 AI 엔진
- **프롬프트 중간 케이스 3개 추가** (`general`, `naver_store`, `instagram`)
  - 광고/진성 2단계 → 광고/중간/진성 3단계로 확장 (쿠팡은 기존에 있었음)
  - 효과: AI가 애매한 글에서 50점대 중간 판정을 안정적으로 내릴 수 있게 됨
- **플랫폼 alias 버그 수정** (`prompts/__init__.py`)
  - 기존: 프론트에서 `insta` 보내면 `GENERAL_PROMPT`가 실행되는 버그
  - 수정: `naver→naver_store`, `insta→instagram`, `other→general` 자동 매핑

### 🔒 보안
- **입력 검증 5종 추가** (`ai_engine.py`)
  - URL 전용 입력 차단, 20자 미만 차단, 반복 텍스트 차단, 한국어 없음 차단, 오타/이모지 차단
- **프롬프트 인젝션 탐지 추가** (`ai_engine.py`)
  - 한/영 인젝션 패턴 감지 ("무시하고", "ignore previous", "jailbreak" 등)
  - 감지 시 서버 로그 기록

### 🗄️ DB
- **DB 모델 재설계** (`models/analysis.py`)
  - 추가: `original_content`, `platform`, `model_used`, `hidden_intent`, `overall_verdict`, `session_id`
  - 제거: 사용하지 않던 `url` 컬럼
- **CRUD 레이어 구현** (`crud/__init__.py`)
  - `save_analysis()`, `get_analysis()`, `get_history()` 구현
- **API에 DB 저장 연결** (`api/analysis.py`) — 기존 TODO 완성
- **스키마에 `session_id` 추가** (`schemas/analysis.py`)

### 🔧 백엔드
- **Rate Limiting 추가** (`main.py`) — IP당 분당 10회 제한, 초과 시 429 응답
- **CORS 제한** (`main.py`) — `*` → 환경변수 `ALLOWED_ORIGINS` 기반 허용 도메인 관리
- **React 빌드 정적 파일 서빙** (`main.py`) — `frontend/dist` 존재 시 FastAPI가 직접 서빙 (단일 서버 배포용)
- **DB 절대경로 수정** (`database.py`) — `./noclick.db` 상대경로 버그 → `__file__` 기반 절대경로
- **히스토리 조회 API** `GET /api/analysis/history` 구현
- **단건 조회 API** `GET /api/analysis/{id}` 구현
- **Alembic 마이그레이션** `001_init` — 최초 테이블 생성 스크립트
- **의존성 추가** `pyproject.toml` — `slowapi`, `fastapi-staticfiles`

### 📄 문서
- `README.md` 전면 업데이트
- `AI_MASTER_CONTEXT.md` 최신화 (JSON 스펙, 플랫폼 표, 보안 섹션 추가)
- `backend/DB_GUIDE.md` 신규 생성
- `CHANGELOG.md` — 팀원 연동 가이드 전체 작성 (요청/응답 JSON, TypeScript 코드, DB 초기화)

---

## 2026-05-08 | 성원 (AI & Backend)

### 🤖 AI 엔진
- **프롬프트 품질 개선** — 번호 중복 수정, 섹션 순서 통일, `saved_cost` 계산 예시 추가
- **오타/이모지 예외처리 추가** (`ai_engine.py`) — 난타 감지, 이모지 전처리

---

## 2026-05-06 | 성원 (AI & Backend)

### 🤖 AI 엔진
- **프롬프트 세부화** — `overall_verdict`, `hidden_intent` 필드 추가 및 반영

---

## 2026-05-05 | 성원 (AI & Backend)

### 🤖 AI 엔진
- **Gemini API 연결** — gemini-3-flash-preview, JSON 강제 출력 적용
- **프롬프트 플랫폼별 분리** — `general`, `naver_store`, `coupang`, `instagram` 독립 파일
- **HuggingFace(EXAONE 3.5) 연동** — 비교 모델 연결, Gemini 소진 시 자동 폴백

### 🔧 백엔드
- **FastAPI 기본 구조** — 라우터, 스키마, 모델, DB 레이어
- **`POST /api/analysis/analyze`** 엔드포인트 구현
- **다중 API 키 로테이션**, **SHA-256 캐시**, **exponential backoff** 구현

---

## 프론트 담당자 참고 — API 연동 가이드

> Base URL: `http://localhost:8000`  
> Swagger UI: `http://localhost:8000/docs`

---

### 📤 요청 (Request)

**Endpoint**: `POST /api/analysis/analyze`

```json
{
  "content": "분석할 리뷰 본문 텍스트 (필수, 20자 이상)",
  "platform": "naver",
  "model": "gemini",
  "session_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `content` | string | ✅ | 분석할 리뷰 본문 (20자 이상) |
| `platform` | string | ❌ | `naver` \| `insta` \| `coupang` \| `other` (기본값: `other`) |
| `model` | string | ❌ | `gemini` \| `huggingface` (기본값: `gemini`) |
| `session_id` | string | ❌ | localStorage UUID — 히스토리 추적용 (없으면 히스토리 저장 안 됨) |

---

### 📥 응답 (Response) — 성공

```json
{
  "status": "success",
  "data": {
    "blog_title": "망원 핫플 극찬 후기",
    "ad_probability": 89,
    "trust_score": 11,
    "highlighted_phrases": [
      {
        "text": "원고료를 받지 않은 솔직한 후기",
        "type": "sponsor_denial"
      },
      {
        "text": "역대급 맛집",
        "type": "exaggeration"
      },
      {
        "text": "주차가 좀 그렇긴 한데 그래도 괜찮아요",
        "type": "negative_avoidance"
      }
    ],
    "hidden_negatives": [
      {
        "inferred": "주차 사실상 불가 — 방문 시 주차비 및 이동 불편 감수 필요",
        "confidence": 92,
        "reasoning": "'대중교통으로 오시길 강추'만 반복하고 주차 정보 완전 누락"
      },
      {
        "inferred": "음식 가격이 높을 가능성 — 가성비 기대 시 실망 위험",
        "confidence": 78,
        "reasoning": "메뉴 가격·메뉴판 사진 없이 극찬만 나열"
      }
    ],
    "hidden_intent": "업체로부터 식사 제공 또는 원고료를 받고 작성한 바이럴 마케팅 글",
    "overall_verdict": "광고성 개입 가능성이 높다고 판단되며 방문 전 메뉴 가격과 주차 조건을 별도 확인해야 합니다.",
    "real_summary": "핵심 정보가 누락된 과장형 광고 의심 후기입니다.",
    "dimension_scores": {
      "authenticity": 12,
      "information": 8,
      "specificity": 15,
      "exaggeration": 91
    },
    "saved_cost": "1,500원 (AI 추정)",
    "saved_time": "약 10분",
    "original_content": "드디어 방문한 망원 핫플! 사장님이 너무 친절하시고..."
  },
  "error": null
}
```

**응답 필드 설명**

| 필드 | 타입 | 설명 |
|------|------|------|
| `status` | string | `"success"` \| `"error"` |
| `data.blog_title` | string | AI가 추론한 글 제목 |
| `data.ad_probability` | number (0~100) | 광고 확률 — **70 이상이면 광고 판정** |
| `data.trust_score` | number (0~100) | 신뢰도 점수 |
| `data.highlighted_phrases` | array | 광고성 문구 목록 |
| `data.highlighted_phrases[].text` | string | 원문에서 추출한 문구 |
| `data.highlighted_phrases[].type` | string | `exaggeration` \| `sponsor_denial` \| `negative_avoidance` |
| `data.hidden_negatives` | array | 숨겨진 단점 목록 |
| `data.hidden_negatives[].inferred` | string | 추론된 실제 단점 |
| `data.hidden_negatives[].confidence` | number (0~100) | 추론 신뢰도 |
| `data.hidden_negatives[].reasoning` | string | 추론 근거 (원문 인용) |
| `data.hidden_intent` | string | 글의 숨겨진 의도 |
| `data.overall_verdict` | string | 수사관 종합 판정 |
| `data.real_summary` | string | 탈광고 한 줄 요약 |
| `data.dimension_scores` | object | 다차원 성분 분석 (각 0~100) |
| `data.dimension_scores.authenticity` | number | 진정성 — 실제 경험 밀도 |
| `data.dimension_scores.information` | number | 정보성 — 가격·수치 등 팩트 밀도 |
| `data.dimension_scores.specificity` | number | 상세함 — 구체 묘사 비율 |
| `data.dimension_scores.exaggeration` | number | 과장성 — 높을수록 광고 신호 |
| `data.saved_cost` | string | 예상 절약 비용 (예: "1,500원 (AI 추정)") |
| `data.saved_time` | string | 예상 절약 시간 (예: "약 10분") |
| `data.original_content` | string | 입력한 원본 텍스트 |

---

### 📥 응답 (Response) — 실패

```json
{
  "status": "error",
  "data": null,
  "error": "URL이 아닌 리뷰 본문 텍스트를 붙여넣어 주세요."
}
```

**에러 메시지 종류**

| 에러 메시지 | 원인 |
|------------|------|
| `"URL이 아닌 리뷰 본문 텍스트를 붙여넣어 주세요."` | URL만 입력함 |
| `"리뷰 본문만 입력해 주세요."` | 프롬프트 인젝션 시도 감지 |
| `"오타인 것 같네요! 분석할 수 있는 내용을 입력해 주세요."` | 키보드 난타/오타 |
| `"내용이 너무 짧아요! 20자 이상 입력해 주세요."` | 20자 미만 입력 |
| `"반복된 내용은 분석할 수 없어요! 실제 리뷰 텍스트를 입력해 주세요."` | 동일 패턴 반복 |
| `"한국어 리뷰 텍스트를 입력해 주세요."` | 한국어 없는 텍스트 |
| `"제공하신 API 키의 사용량이 초과되었거나 모델에 접근할 수 없습니다."` | 사용자 API 키 소진 |

---

---

### 🔑 session_id 란?

로그인 없이 사용자를 구분하기 위한 **익명 식별자**야.

- 앱 최초 실행 시 `crypto.randomUUID()`로 UUID를 생성해 `localStorage`에 저장
- 이후 모든 분석 요청에 `session_id`를 같이 보내면, 서버가 DB에 연결해서 저장
- 히스토리 조회 시 이 `session_id`로 본인 기록만 필터링해서 반환
- **브라우저 로컬스토리지 기반**이라 같은 브라우저에서만 히스토리가 유지됨 (다른 기기/브라우저에서는 새 세션)
- `session_id` 없이 분석 요청해도 분석 자체는 되지만, **DB에 저장되지 않아 히스토리 조회 불가**

```
사용자 첫 방문 → UUID 생성 → localStorage 저장
     ↓
분석 요청마다 session_id 포함 → 서버가 DB에 session_id로 저장
     ↓
히스토리 탭 → GET /history?session_id=xxx → 내 기록만 반환
```

---

### 💻 실제 연동 코드 예시 (TypeScript)

```ts
// 1. session_id 생성 (앱 최초 실행 시 1회)
const sessionId = localStorage.getItem('nc_session')
  ?? (() => {
    const id = crypto.randomUUID();
    localStorage.setItem('nc_session', id);
    return id;
  })();

// 2. 분석 요청
const res = await fetch('http://localhost:8000/api/analysis/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: reviewText,
    platform: selectedPlatform,  // "naver" | "insta" | "coupang" | "other"
    model: 'gemini',
    session_id: sessionId,
  }),
});

const result = await res.json();

if (result.status === 'error') {
  // 에러 처리
  alert(result.error);
  return;
}

// 3. 성공 시 result.data 사용
console.log(result.data.ad_probability);   // 광고 확률
console.log(result.data.hidden_negatives); // 숨겨진 단점 목록
```

---

### 3. 히스토리 조회 API

```
GET /api/analysis/history?session_id={sessionId}&limit=20
```

**응답 예시**
```json
{
  "status": "success",
  "data": [
    {
      "blog_title": "망원 핫플 극찬 후기",
      "ad_probability": 89,
      "trust_score": 11,
      "highlighted_phrases": [...],
      "hidden_negatives": [...],
      "hidden_intent": "바이럴 마케팅 글",
      "overall_verdict": "광고성 개입 가능성이 높습니다.",
      "real_summary": "핵심 정보가 누락된 과장형 광고 의심 후기입니다.",
      "saved_cost": "15,000원",
      "saved_time": "5분",
      "original_content": "드디어 방문한 망원 핫플!..."
    }
  ],
  "error": null
}
```

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `session_id` | string | 필수. localStorage에서 가져온 UUID |
| `limit` | number | 선택. 조회 개수 (기본 20, 최대 100) |

**히스토리 페이지 연동 코드 (TypeScript)**

```ts
// 히스토리 아이템 타입 정의
interface AnalysisItem {
  blog_title: string;
  ad_probability: number;
  trust_score: number;
  highlighted_phrases: { text: string; type: string }[];
  hidden_negatives: { inferred: string; confidence: number; reasoning: string }[];
  hidden_intent: string;
  overall_verdict: string;
  real_summary: string;
  saved_cost: string;
  saved_time: string;
  original_content: string;
}

// 히스토리 목록 불러오기
async function fetchHistory(limit = 20): Promise<AnalysisItem[]> {
  const sessionId = localStorage.getItem('nc_session');
  if (!sessionId) return [];

  const res = await fetch(
    `http://localhost:8000/api/analysis/history?session_id=${sessionId}&limit=${limit}`
  );
  const result = await res.json();

  if (result.status === 'error' || !Array.isArray(result.data)) return [];
  return result.data as AnalysisItem[];
}

// 사용 예시 (React)
useEffect(() => {
  fetchHistory().then(setHistoryList);
}, []);
```

---

### 4. 단건 조회 API

```
GET /api/analysis/{id}
```

**응답 예시**
```json
{
  "status": "success",
  "data": {
    "blog_title": "망원 핫플 극찬 후기",
    "ad_probability": 89,
    "trust_score": 11,
    "highlighted_phrases": [...],
    "hidden_negatives": [...],
    "hidden_intent": "바이럴 마케팅 글",
    "overall_verdict": "광고성 개입 가능성이 높습니다.",
    "real_summary": "핵심 정보가 누락된 과장형 광고 의심 후기입니다.",
    "saved_cost": "15,000원",
    "saved_time": "5분",
    "original_content": "드디어 방문한 망원 핫플!..."
  },
  "error": null
}
```

> ℹ️ 현재 응답에 `id` 필드가 없어서 히스토리 목록에서 클릭 후 단건 조회는 불필요.  
> 히스토리 목록 응답에 전체 데이터가 포함되므로 **클릭 시 `data[i]`를 그대로 상태에 넣으면 됨**.

**단건 조회 코드 예시 (TypeScript)**

```ts
async function fetchAnalysisById(id: number): Promise<AnalysisItem | null> {
  const res = await fetch(`http://localhost:8000/api/analysis/${id}`);
  const result = await res.json();
  if (result.status === 'error') return null;
  return result.data as AnalysisItem;
}
```

---

---

### ⚡ 서버 동시성 구조

> **"여러 명이 동시에 분석 요청하면 괜찮나요?"** → 네, 이미 비동기로 처리됩니다.

#### 현재 구조 (해커톤 / 데모 배포)

```
사용자 A 요청 ──┐
사용자 B 요청 ──┤  FastAPI (async)  →  Gemini API (await)
사용자 C 요청 ──┘  단일 uvicorn 프로세스, 비동기 처리
```

- `async def analyze_blog` + `await ai_engine` 로 **요청마다 블로킹 없이** 처리
- `AI_CONCURRENCY_LIMIT: 8` — 동시 Gemini 호출 최대 8개로 API 쿼터 보호
- **지금 구조로 심사 인원이 동시에 눌러도 문제없음**

#### 서버 실행 명령어 (단일 서버 배포)

```bash
# 개발
cd backend && python main.py

# 배포 (포트 8000, 단일 프로세스)
cd backend && poetry run uvicorn main:app --host 0.0.0.0 --port 8000
```

#### 나중에 실제 운영으로 전환한다면 (지금 건드릴 필요 없음)

| 항목 | 지금 | 운영 전환 시 |
|------|------|-------------|
| DB | SQLite (파일) | PostgreSQL (멀티 프로세스 안전) |
| 서버 | uvicorn 단일 | gunicorn + uvicorn 멀티워커 |
| AI 큐 | asyncio 세마포어 | Celery + Redis |
| `.env` | `DATABASE_URL=sqlite:///...` | `DATABASE_URL=postgresql://...` |

> ⚠️ SQLite + 멀티워커(`-w 4`)는 write lock 충돌이 나므로 **지금 구조에서는 하지 말 것**.  
> PostgreSQL로 전환하고 나서야 멀티워커가 의미 있음.

---

### ⚙️ DB 초기화 (최초 1회 실행)

> **백엔드 처음 세팅하거나 DB 날아갔을 때** 아래 명령어 순서대로 실행

```bash
cd backend

# 1. 의존성 설치
poetry install

# 2. DB 마이그레이션 실행 (테이블 생성)
poetry run alembic upgrade head

# 3. 서버 실행
python main.py
```

**마이그레이션 관련 명령어 모음**

```bash
# 현재 마이그레이션 상태 확인
poetry run alembic current

# 마이그레이션 히스토리 확인
poetry run alembic history

# DB 초기화 (테이블 전부 삭제) — 주의!
poetry run alembic downgrade base

# 다시 생성
poetry run alembic upgrade head
```

**DB 모델 변경 시 (새 컬럼 추가 등)**

```bash
# 1. models/analysis.py 수정 후
# 2. 새 마이그레이션 파일 자동 생성
poetry run alembic revision --autogenerate -m "변경 내용 설명"

# 3. 마이그레이션 적용
poetry run alembic upgrade head
```

> ⚠️ `noclick.db` 파일은 `.gitignore`에 있어서 커밋 안 됨. 각자 로컬에서 `alembic upgrade head` 실행해야 함!
