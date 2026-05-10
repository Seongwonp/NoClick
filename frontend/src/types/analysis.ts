export interface AnalysisRequest {
  content: string;
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

export interface AnalysisResponse {
  id?: number;
  platform?: string;
  original_content: string;
  ad_probability: number;
  trust_score: number;
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
