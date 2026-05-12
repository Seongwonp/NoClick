import type { AnalysisResult, AnalysisRequest, HighlightedPhrase } from '../types/analysis';

const STORAGE_KEY = 'noclick_history';

const SAMPLE_TEXT = '광고가 아닙니다 정말 솔직하게 쓰는 거예요. 써보니 인생 최고 제품이에요! 단점은 딱히 없고 가격도 합리적이에요.';
const SAMPLE_PHRASES: HighlightedPhrase[] = [
  { text: '광고가 아닙니다', type: 'sponsor_denial', reason: '광고 부인 패턴: 자발적으로 부인할수록 의심 신호' },
  { text: '인생 최고', type: 'exaggeration', reason: '과장 표현: 극단적 수식어 사용' },
  { text: '단점은 딱히', type: 'negative_avoidance', reason: '단점 회피: 의도적으로 부정적 측면을 언급하지 않음' },
];

const AD_KEYWORDS     = ['광고', '협찬', '제공받', '무상', '지원받', 'PR', 'AD', '광고 아닙니다', '광고가 아닙니다', '#광고', '#협찬'];
const EX_KEYWORDS     = ['최고', '최애', '완벽', '신세계', '레전드', '강추', '인생', '역대급', '갓', '짱', '대박', '미침'];
const AV_KEYWORDS     = ['단점', '단점은', '아쉬운', '아쉬움', '별로', '그냥'];

function findInText(keywords: string[], text: string): string | undefined {
  return keywords.find(kw => text.includes(kw));
}

function extractPhrases(text: string): HighlightedPhrase[] {
  const ad = findInText(AD_KEYWORDS, text);
  const ex = findInText(EX_KEYWORDS, text);
  const av = findInText(AV_KEYWORDS, text);

  const candidates: (HighlightedPhrase | false)[] = [
    ad ? { text: ad, type: 'sponsor_denial' as const, reason: '광고 부인 패턴: 자발적으로 부인할수록 의심 신호' } : false,
    ex ? { text: ex, type: 'exaggeration' as const, reason: '과장 표현: 극단적 수식어가 사용되었습니다' } : false,
    av ? { text: av, type: 'negative_avoidance' as const, reason: '단점 회피: 부정적 측면을 의도적으로 언급하지 않음' } : false,
  ];
  const found: HighlightedPhrase[] = candidates.filter((p): p is HighlightedPhrase => p !== false);

  return found;
}

export const mockAnalysisService = {
  analyze: async (request: AnalysisRequest): Promise<AnalysisResult> => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const userText = request.text?.trim() ?? '';
    const phrases  = userText ? extractPhrases(userText) : SAMPLE_PHRASES;
    // 유저 텍스트에서 패턴을 못 찾으면 샘플 텍스트로 대체하여 하이라이트가 보이게 함
    const originalText = (userText && phrases.length > 0) ? userText : SAMPLE_TEXT;
    const displayPhrases = phrases.length > 0 ? phrases : SAMPLE_PHRASES;

    const newResult: AnalysisResult = {
      id: Math.random().toString(36).substring(2, 9),
      url: request.url,
      platform: request.platform || 'other',
      original_text: originalText,
      ad_probability: Math.floor(Math.random() * 100),
      trust_score: Math.floor(Math.random() * 100),
      highlighted_phrases: displayPhrases,
      hidden_negatives: [
        { inferred: '가성비 아쉬움', confidence: 70, reasoning: '가격 언급이 회피됨' },
      ],
      real_summary: '전반적으로 만족스러우나 가격대가 높고 광고성 수식어가 포함된 리뷰입니다.',
      rewritten_text: '해당 제품은 기능적인 면에서는 만족스럽습니다. 다만 광고성 미사여구를 제외하면 가격이 타사 대비 비싸고, 마감이 아쉽다는 의견이 지배적입니다. 가성비를 중요하게 생각하신다면 신중한 선택이 필요합니다.',
      saved_cost: '15,000원',
      saved_time: '30분',
      created_at: new Date().toISOString().split('T')[0],
    };

    const history = mockAnalysisService.getHistory();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newResult, ...history]));

    return newResult;
  },

  getHistory: (): AnalysisResult[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getResult: (id: string): AnalysisResult | undefined => {
    return mockAnalysisService.getHistory().find(item => item.id === id);
  },
};
