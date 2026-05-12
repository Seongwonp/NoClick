# No-Click API 명세서

> **Base URL**: `http://localhost:8000`
> **Swagger UI**: `http://localhost:8000/docs`
> **Content-Type**: `application/json`
> **Rate Limit**: IP당 분당 10회 (초과 시 `429 Too Many Requests`)

---

## 공통 응답 구조

```json
{
  "status": "success" | "error",
  "data": { ... } | [ ... ] | null,
  "error": null | "에러 메시지"
}
```

---

## 1. 블로그 분석

### `POST /api/analysis/analyze`

#### Request Body

```json
{
  "content": "분석할 리뷰 본문 텍스트",
  "platform": "naver",
  "model": "gemini",
  "session_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `content` | string | ✅ | - | 분석할 리뷰 본문 (20자 이상) |
| `platform` | string | ❌ | `"other"` | `naver` \| `insta` \| `coupang` \| `other` |
| `model` | string | ❌ | `"gemini"` | `gemini` \| `huggingface` |
| `session_id` | string | ❌ | - | localStorage UUID. 없으면 히스토리 미저장 |

#### 예시 1 — 광고 후기 (높은 광고 확률)

**Request**
```json
{
  "content": "드디어 방문한 망원 핫플레이스! 사장님이 너무너무 친절하시고 음식도 역대급이에요. 원고료를 받지 않은 100% 솔직한 후기입니다. 인생 맛집 등극!! 주차는 좀 불편할 수 있으니 대중교통 이용 강추드려요. 재방문 의사 200%입니다!!",
  "platform": "naver",
  "model": "gemini",
  "session_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response `200 OK`**
```json
{
  "status": "success",
  "data": {
    "blog_title": "망원 핫플 극찬 후기",
    "ad_probability": 89,
    "trust_score": 11,
    "highlighted_phrases": [
      { "text": "원고료를 받지 않은 100% 솔직한 후기입니다", "type": "sponsor_denial" },
      { "text": "역대급", "type": "exaggeration" },
      { "text": "인생 맛집", "type": "exaggeration" },
      { "text": "주차는 좀 불편할 수 있으니 대중교통 이용 강추", "type": "negative_avoidance" }
    ],
    "hidden_negatives": [
      {
        "inferred": "주차 사실상 불가 — 방문 시 이동 불편 감수 필요",
        "confidence": 92,
        "reasoning": "'대중교통으로 오시길 강추'만 반복하고 주차 정보 완전 누락"
      },
      {
        "inferred": "음식 가격이 높을 가능성 — 가성비 기대 시 실망 위험",
        "confidence": 78,
        "reasoning": "메뉴 가격·메뉴판 언급 없이 극찬만 나열"
      }
    ],
    "hidden_intent": "업체로부터 식사 제공 또는 원고료를 받고 작성한 바이럴 마케팅 글",
    "overall_verdict": "광고성 개입 가능성이 높습니다. 방문 전 가격·주차를 별도 확인하세요.",
    "real_summary": "핵심 정보(가격·주차)가 누락된 과장형 광고 의심 후기입니다.",
    "saved_cost": "15,000원",
    "saved_time": "5분",
    "original_content": "드디어 방문한 망원 핫플레이스!..."
  },
  "error": null
}
```

#### 예시 2 — 진성 후기 (낮은 광고 확률)

**Request**
```json
{
  "content": "동네 단골 카페인데 오늘도 아메리카노 한 잔 했어요. 자리가 좁고 소음이 있어서 공부하기엔 별로인데, 커피 맛은 진짜 좋아요. 가격은 4500원으로 주변 대비 약간 비싼 편. 그래도 맛으로 계속 오게 되는 곳.",
  "platform": "other",
  "model": "gemini",
  "session_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response `200 OK`**
```json
{
  "status": "success",
  "data": {
    "blog_title": "단골 동네 카페 솔직 후기",
    "ad_probability": 5,
    "trust_score": 95,
    "highlighted_phrases": [],
    "hidden_negatives": [],
    "hidden_intent": "개인적인 경험을 공유하는 진성 후기",
    "overall_verdict": "단점을 직접 언급한 신뢰도 높은 진성 후기입니다.",
    "real_summary": "커피 맛은 좋으나 자리 좁고 소음 있음. 가격 4500원으로 약간 비싼 편.",
    "saved_cost": "해당 없음",
    "saved_time": "해당 없음",
    "original_content": "동네 단골 카페인데..."
  },
  "error": null
}
```

> `ad_probability` 70 미만 → 진성 후기 판정. `highlighted_phrases`, `hidden_negatives` 빈 배열 반환.

#### Response 필드 상세

| 필드 | 타입 | 설명 |
|------|------|------|
| `blog_title` | string | AI가 추론한 글 제목 |
| `ad_probability` | integer (0~100) | 광고 확률. **70 이상 → 광고 판정** |
| `trust_score` | integer (0~100) | 신뢰도 점수 |
| `highlighted_phrases[].text` | string | 원문에서 추출한 문구 |
| `highlighted_phrases[].type` | string | `exaggeration` \| `sponsor_denial` \| `negative_avoidance` |
| `hidden_negatives[].inferred` | string | 추론된 단점 |
| `hidden_negatives[].confidence` | integer (0~100) | 추론 신뢰도 |
| `hidden_negatives[].reasoning` | string | 추론 근거 (원문 인용) |
| `hidden_intent` | string | 글의 숨겨진 의도 |
| `overall_verdict` | string | AI 수사관 종합 판정 |
| `real_summary` | string | 탈광고 한 줄 요약 |
| `saved_cost` | string | 예상 절약 비용 (예: `"15,000원"`) |
| `saved_time` | string | 예상 절약 시간 (예: `"5분"`) |

#### 에러 응답

```json
{ "status": "error", "data": null, "error": "내용이 너무 짧아요! 20자 이상 입력해 주세요." }
```

| 에러 메시지 | 원인 | HTTP |
|------------|------|------|
| `"URL이 아닌 리뷰 본문 텍스트를 붙여넣어 주세요."` | URL만 입력 | 200 |
| `"리뷰 본문만 입력해 주세요."` | 프롬프트 인젝션 감지 | 200 |
| `"오타인 것 같네요! 분석할 수 있는 내용을 입력해 주세요."` | 키보드 난타/오타 | 200 |
| `"내용이 너무 짧아요! 20자 이상 입력해 주세요."` | 20자 미만 | 200 |
| `"반복된 내용은 분석할 수 없어요!"` | 동일 패턴 반복 | 200 |
| `"한국어 리뷰 텍스트를 입력해 주세요."` | 한국어 5% 미만 | 200 |
| _(없음)_ | Rate Limit 초과 | 429 |

---

## 2. 히스토리 조회

### `GET /api/analysis/history`

#### Query Parameters

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| `session_id` | string | ✅ | - | localStorage에서 가져온 UUID |
| `limit` | integer | ❌ | `20` | 조회 개수 (최대 100) |

#### 요청 예시

```
GET /api/analysis/history?session_id=550e8400-e29b-41d4-a716-446655440000&limit=10
```

#### Response `200 OK`

```json
{
  "status": "success",
  "data": [
    {
      "blog_title": "망원 핫플 극찬 후기",
      "ad_probability": 89,
      "trust_score": 11,
      "real_summary": "핵심 정보가 누락된 과장형 광고 의심 후기입니다.",
      "saved_cost": "15,000원",
      "saved_time": "5분"
    }
  ],
  "error": null
}
```

> 히스토리 없으면 `data: []` 반환

---

## 3. 단건 조회

### `GET /api/analysis/{id}`

```
GET /api/analysis/1
```

```json
{
  "status": "success",
  "data": { "blog_title": "...", "ad_probability": 89, "..." : "..." },
  "error": null
}
```

---

## 부록 — highlighted_phrases type 코드표

| type 값 | 의미 |
|---------|------|
| `exaggeration` | 과장 표현 ("역대급", "인생 맛집" 등) |
| `sponsor_denial` | 협찬 부인 ("원고료 없는 솔직 후기" 등) |
| `negative_avoidance` | 단점 회피 ("좀 그렇긴 한데 괜찮아요" 등) |
