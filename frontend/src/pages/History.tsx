import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AnalysisResponse } from '../types/analysis';
import { apiService } from '../services/api';

const History: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<AnalysisResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 마운트 시 히스토리 로드
    const loadHistory = async () => {
      try {
        const data = await apiService.getHistory();
        setHistory(data);
      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-grow pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="font-display-lg text-[32px] font-bold text-on-background mb-2">
              My History
            </h1>
            <p className="text-on-surface-variant">분석했던 리뷰 내역을 확인할 수 있습니다.</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-700 transition-all cursor-pointer"
          >
            새 분석 시작
          </button>
        </header>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-on-surface-variant font-medium">히스토리를 불러오는 중...</p>
          </div>
        ) : history.length > 0 ? (
          <div className="space-y-4">
            {history.map((item) => (
              <div 
                key={item.id}
                onClick={() => navigate(`/result?id=${item.id}`)}
                className="bg-white p-6 rounded-2xl border border-gray-100 custom-shadow hover:translate-y-[-2px] transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 overflow-hidden mr-4">
                    <p className="text-sm text-primary font-semibold mb-1">{item.blog_title}</p>
                    <h3 className="font-semibold text-lg text-on-surface truncate group-hover:text-primary transition-colors">
                      {item.original_content}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-outline uppercase">Truth Score</span>
                      <span className={`text-lg font-bold ${item.trust_score > 70 ? 'text-emerald-500' : 'text-tertiary'}`}>
                        {item.trust_score}%
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant">{formatDate(item.created_at)}</p>
                  </div>
                </div>
                <div className="flex gap-4 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">payments</span>
                    절약 비용: <span className="font-semibold text-on-surface">{item.saved_cost}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">timer</span>
                    절약 시간: <span className="font-semibold text-on-surface">{item.saved_time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[40px] text-outline opacity-30">history</span>
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">아직 분석 내역이 없어요</h3>
            <p className="text-on-surface-variant mb-8">첫 번째 리뷰 분석을 시작해보세요!</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md cursor-pointer"
            >
              분석 시작하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
