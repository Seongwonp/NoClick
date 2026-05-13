import type { AnalysisRequest, AnalysisResult, AnalysisResponse } from '../types/analysis';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/analysis';

// 세션 ID 관리 (간단한 예시)
const getSessionId = (): string => {
  let sessionId = localStorage.getItem('noclick_session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('noclick_session_id', sessionId);
  }
  return sessionId;
};

const getSelectedModel = (): 'gemini' | 'huggingface' => {
  const saved = localStorage.getItem('noclick_model');
  return saved === 'huggingface' ? 'huggingface' : 'gemini';
};

const getUserApiKey = (): string | undefined => {
  const key = localStorage.getItem('noclick_apiKey')?.trim();
  return key ? key : undefined;
};

export const apiService = {
  // 블로그 분석 요청
  analyze: async (content: string, platform: string = 'general', model?: string): Promise<AnalysisResponse> => {
    const selectedModel = (model as 'gemini' | 'huggingface' | undefined) || getSelectedModel();
    const requestBody: AnalysisRequest = {
      content,
      platform,
      model: selectedModel,
      session_id: getSessionId(),
      api_key: selectedModel === 'gemini' ? getUserApiKey() : undefined,
    };

    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '분석 요청 중 오류가 발생했습니다.');
    }

    const result: AnalysisResult = await response.json();
    
    if (result.status === 'error' || !result.data) {
      throw new Error(result.error || '분석 결과가 없습니다.');
    }

    return result.data as AnalysisResponse;
  },

  // 히스토리 조회 (페이지네이션)
  async getHistory(page: number = 1, limit: number = 10): Promise<{ items: AnalysisResponse[]; total: number }> {
    const sessionId = getSessionId();
    const skip = (page - 1) * limit;
    const response = await fetch(`${API_BASE_URL}/history?session_id=${sessionId}&limit=${limit}&skip=${skip}`);

    if (!response.ok) {
      throw new Error('히스토리 조회 중 오류가 발생했습니다.');
    }

    const result: AnalysisResult = await response.json();

    if (result.status === 'success' && Array.isArray(result.data)) {
      return { items: result.data, total: result.total ?? result.data.length };
    }

    return { items: [], total: 0 };
  },

  // 특정 분석 결과 조회
  getById: async (analysisId: number): Promise<AnalysisResponse> => {
    const response = await fetch(`${API_BASE_URL}/${analysisId}`);

    if (!response.ok) {
      throw new Error('분석 결과를 불러오는 중 오류가 발생했습니다.');
    }

    const result: AnalysisResult = await response.json();
    
    if (result.status === 'error' || !result.data) {
      throw new Error(result.error || '분석 결과가 없습니다.');
    }

    return result.data as AnalysisResponse;
  }
};
