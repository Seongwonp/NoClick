import type { AnalysisResult, AnalysisRequest } from '../types/analysis';

const STORAGE_KEY = 'noclick_history';

export const mockAnalysisService = {
  // 가짜 분석 실행
  analyze: async (request: AnalysisRequest): Promise<AnalysisResult> => {
    // 실제 API 호출 대신 2초 대기
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newResult: AnalysisResult = {
      id: Math.random().toString(36).substring(2, 9),
      url: request.url,
      original_text: request.text || '직접 입력한 리뷰 내용입니다.',
      ad_probability: Math.floor(Math.random() * 100),
      trust_score: Math.floor(Math.random() * 100),
      highlighted_phrases: [
        { text: '인생 맛집', type: 'exaggeration', reason: '주관적이고 과장된 표현' },
        { text: '무조건 사야함', type: 'exaggeration', reason: '구매 강요 패턴' }
      ],
      hidden_negatives: [
        { inferred: '가성비 아쉬움', confidence: 70, reasoning: '가격 언급이 회피됨' }
      ],
      real_summary: '전반적으로 만족스러우나 가격대가 높고 광고성 수식어가 포함된 리뷰입니다.',
      saved_cost: '15,000원',
      saved_time: '30분',
      created_at: new Date().toISOString().split('T')[0]
    };

    // 로컬스토리지에 저장
    const history = mockAnalysisService.getHistory();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newResult, ...history]));

    return newResult;
  },

  // 히스토리 가져오기
  getHistory: (): AnalysisResult[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // 특정 결과 가져오기
  getResult: (id: string): AnalysisResult | undefined => {
    return mockAnalysisService.getHistory().find(item => item.id === id);
  }
};
