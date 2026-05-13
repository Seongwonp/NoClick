export interface AnalysisRequest {
  content: string;
  text?: string; // For backward compatibility or mock usage
  url?: string;
  platform: string;
  model: string;
  session_id?: string;
  api_key?: string;
}

export type PhraseType = 'exaggeration' | 'sponsor_denial' | 'negative_avoidance' | 'ad_pattern' | 'neutral';

export interface HighlightedPhrase {
  text: string;
  type: string;
  reason?: string;
}

export interface HiddenNegative {
  inferred: string;
  confidence: number;
  reasoning: string;
}

export interface DimensionScores {
  authenticity: number;   // 진정성 (high = genuine)
  information: number;    // 정보성 (high = factual density)
  specificity: number;    // 상세함 (high = concrete details)
  exaggeration: number;   // 과장성 (high = bad signal)
}

export interface AnalysisResponse {
  id: string | number;
  platform?: string;
  original_content: string;
  ad_probability: number;
  trust_score: number;
  dimension_scores?: DimensionScores;
  highlighted_phrases: HighlightedPhrase[];
  hidden_negatives: HiddenNegative[];
  hidden_intent: string;
  overall_verdict: string;
  real_summary: string;
  saved_cost: string;
  saved_time: string;
  blog_title: string;
  created_at?: string;
}

export interface AnalysisResult {
  status: string;
  data?: AnalysisResponse | AnalysisResponse[];
  error?: string;
}
