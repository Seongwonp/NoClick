import React from 'react';
import MockPlatformViewer from '../MockPlatformViewer';
import type { AnalysisResponse } from '../../types/analysis';

export const PHRASE_META: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  exaggeration:       { label: '과장 표현', color: '#d97706', bg: '#FFF3CD', icon: 'priority_high' },
  sponsor_denial:     { label: '광고 부인', color: '#dc2626', bg: '#FFD6D6', icon: 'block' },
  negative_avoidance: { label: '단점 회피', color: '#3b82f6', bg: '#D6EAFF', icon: 'visibility_off' },
  ad_pattern:         { label: '광고 패턴', color: '#8b5cf6', bg: '#E8D6FF', icon: 'campaign' },
  neutral:            { label: '중립',      color: '#64748b', bg: '#f8fafc', icon: 'remove' },
};

interface Props {
  result: AnalysisResponse;
  activeFilters: string[];
  onToggleFilter: (type: string) => void;
  onClearFilters: () => void;
}

const PhraseViewer: React.FC<Props> = ({ result, activeFilters, onToggleFilter, onClearFilters }) => {
  const groupedPhrases = (result.highlighted_phrases || []).reduce((acc, phrase) => {
    const key = phrase.type || 'neutral';
    if (!acc[key]) acc[key] = [];
    acc[key].push(phrase);
    return acc;
  }, {} as Record<string, typeof result.highlighted_phrases>);

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '80ms' }}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-on-surface rounded-xl flex items-center justify-center text-white flex-shrink-0">
            <span className="material-symbols-outlined text-[18px]">find_in_page</span>
          </div>
          <div>
            <h3 className="text-[15px] md:text-[17px] font-extrabold text-on-surface tracking-tight">원문에서 발견된 표현들</h3>
            <p className="text-[11px] md:text-[12px] text-gray-400 font-medium mt-0.5">태그를 눌러 종류별로 걸러볼 수 있어요</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(PHRASE_META).filter(([k]) => k !== 'neutral').map(([type, meta]) => {
            const isActive = activeFilters.includes(type);
            const count = groupedPhrases[type]?.length || 0;
            if (count === 0) return null;
            return (
              <button
                key={type}
                onClick={() => onToggleFilter(type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[12px] font-bold transition-all duration-200 ${isActive ? 'ring-2 ring-offset-1' : 'opacity-60 hover:opacity-100'}`}
                style={{
                  backgroundColor: meta.bg,
                  color: meta.color,
                  borderColor: isActive ? meta.color : meta.bg,
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
              onClick={onClearFilters}
              className="text-[11px] font-bold text-gray-400 hover:text-gray-600 px-2 transition-colors"
            >
              초기화
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] overflow-hidden custom-shadow border border-emerald-50 h-[360px] md:h-[480px]">
        <MockPlatformViewer
          platform={result.platform || 'naver'}
          originalText={result.original_content || ''}
          highlightedPhrases={result.highlighted_phrases || []}
          activeFilters={activeFilters}
          onComplete={() => {}}
        />
      </div>
    </div>
  );
};

export default PhraseViewer;
