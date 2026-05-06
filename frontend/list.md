  <프런트 명세서>
  
  ┌─────────┬───────────┬────────────────────────┐
  │ ID      │ 플랫폼 명 │ 아이콘                 │
  ├─────────┼───────────┼────────────────────────┤
  │ naver   │ 네이버    │ SiNaver                │
  │ insta   │ 인스타    │ SiInstagram            │
  │ coupang │ 쿠팡      │ FaShoppingCart         │
  │ other   │ 기타      │ public (Material Icon) │
  └─────────┴───────────┴────────────────────────┘

  2. 타입 정의 (frontend/src/types/analysis.ts)
  데이터 인터페이스에서는 단순히 string으로 정의되어 있음:

   1 export interface AnalysisRequest {
   2   url?: string;
   3   text?: string;
   4   platform?: string; // string 타입으로 사용 중
   5 }
