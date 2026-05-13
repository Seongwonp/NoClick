import React, { useState } from 'react';
import type { AnalysisResponse } from '../../types/analysis';
import MockPlatformViewer from '../MockPlatformViewer';

interface OriginalAnalysisProps {
  analysisResult: AnalysisResponse;
}

export const PHRASE_META: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  exaggeration:       { label: '과장 표현',  color: '#d97706', bg: '#FFF3CD', icon: 'priority_high' },
  sponsor_denial:     { label: '광고 부인',  color: '#dc2626', bg: '#FFD6D6', icon: 'block' },
  negative_avoidance: { label: '단점 회피',  color: '#3b82f6', bg: '#D6EAFF', icon: 'visibility_off' },
  ad_pattern:         { label: '광고 패턴',  color: '#8b5cf6', bg: '#E8D6FF', icon: 'campaign' },
  neutral:            { label: '중립',       color: '#64748b', bg: '#f8fafc', icon: 'remove' },
};

const OriginalAnalysis: React.FC<OriginalAnalysisProps> = ({ analysisResult }) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (type: string) => {
    setActiveFilters(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const groupedPhrases = (analysisResult.highlighted_phrases || []).reduce((acc, phrase) => {
    const key = phrase.type || 'neutral';
    if (!acc[key]) acc[key] = [];
    acc[key].push(phrase);
    return acc;
  }, {} as Record<string, typeof analysisResult.highlighted_phrases>);

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '80ms' }}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-on-surface rounded-xl flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[18px]">find_in_page</span>
          </div>
          <div>
            <h3 className="text-[17px] font-extrabold text-on-surface tracking-tight">원문 직접 분석 결과</h3>
            <p className="text-[12px] text-gray-400 font-medium mt-0.5">포착된 의심 표현을 클릭해 필터링해보세요</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PHRASE_META).filter(([k]) => k !== 'neutral').map(([type, meta]) => {
            const count = groupedPhrases[type]?.length || 0;
            if (count === 0) return null;
            const isActive = activeFilters.includes(type);
            return (
              <button
                key={type}
                onClick={() => toggleFilter(type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[12px] font-bold transition-all duration-200 ${isActive ? 'ring-2 ring-offset-1' : 'opacity-60 hover:opacity-100'}`}
                style={{
                  backgroundColor: meta.bg,
                  color: meta.color,
                  borderColor: isActive ? meta.color : meta.bg,
                  // @ts-ignore
                  ringColor: meta.color,
                }}
              >
                <span className="material-symbols-outlined text-[13px]">{meta.icon}</span>
                {meta.label}
                <span className="ml-0.5 opacity-50">{count}</span>
              </button>
            );
          })}
          {activeFilters.length > 0 && (
            <button
              onClick={() => setActiveFilters([])}
              className="text-[11px] font-bold text-gray-400 hover:text-gray-600 px-2 transition-colors"
            >
              초기화
            </button>
          )}
        </div>
      </div>
      <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/40 h-[480px]">
        <MockPlatformViewer
          platform={analysisResult.platform || 'naver'}
          originalText={analysisResult.original_content || ''}
          highlightedPhrases={analysisResult.highlighted_phrases || []}
          activeFilters={activeFilters}
          onComplete={() => {}}
        />
      </div>
    </div>
  );
};

export default OriginalAnalysis;
