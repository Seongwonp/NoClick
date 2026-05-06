export type PhraseType = 'exaggeration' | 'sponsor_denial' | 'negative_avoidance' | 'ad_pattern' | 'neutral';

export interface HighlightedPhrase {
  text: string;
  type: PhraseType;
  reason?: string;
}

export interface HiddenNegative {
  inferred: string;
  confidence: number;
  reasoning: string;
}

export interface AnalysisResult {
  id: string;
  url?: string;
  platform: string;
  original_text: string;
  ad_probability: number;
  trust_score: number;
  highlighted_phrases: HighlightedPhrase[];
  hidden_negatives: HiddenNegative[];
  real_summary: string;
  rewritten_text: string;
  saved_cost: string;
  saved_time: string;
  created_at: string;
}

export interface AnalysisRequest {
  url?: string;
  text?: string;
  platform?: string;
}
