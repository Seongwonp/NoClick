import React from 'react';
import type { AnalysisResponse } from '../../types/analysis';

interface TrustRank {
  grade: string;
  color: string;
  bg: string;
  borderColor: string;
  label: string;
  sub: string;
}

interface Props {
  result: AnalysisResponse;
  trustRank: TrustRank;
}

const ResultHeader: React.FC<Props> = ({ result, trustRank }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm animate-fade-in-up overflow-hidden">

      {/* 등급 컬러 상단 바 */}
      <div className="h-1.5 w-full" style={{ backgroundColor: trustRank.color }} />

      <div className="px-6 py-7 md:px-8 md:py-9 flex flex-col items-center text-center gap-5">

        {/* 등급 + 점수 */}
        <div>
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: trustRank.bg, border: `1.5px solid ${trustRank.borderColor}` }}
          >
            <span className="text-[44px] font-black leading-none" style={{ color: trustRank.color }}>
              {trustRank.grade}
            </span>
          </div>
          <p className="text-[22px] font-extrabold text-slate-900 tracking-tight">{trustRank.label}</p>
          <p className="text-[14px] text-slate-400 font-medium mt-1">{trustRank.sub}</p>
        </div>

        {/* 신뢰 점수 바 */}
        <div className="w-full max-w-sm">
          <div className="flex justify-between text-[12px] font-semibold mb-2">
            <span className="text-slate-400">신뢰 점수</span>
            <span style={{ color: trustRank.color }}>{result.trust_score}점</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${result.trust_score}%`, backgroundColor: trustRank.color }}
            />
          </div>
        </div>

        {/* 숨겨진 의도 */}
        {result.hidden_intent && (
          <div className="w-full max-w-sm flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-left">
            <span
              className="material-symbols-outlined text-amber-500 text-[16px] flex-shrink-0 mt-0.5"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lightbulb
            </span>
            <p className="text-[12px] text-amber-800 font-medium leading-snug break-keep">
              {result.hidden_intent}
            </p>
          </div>
        )}

        {/* 블로그 제목 */}
        {result.blog_title && (
          <p className="text-[12px] text-slate-300 font-medium max-w-sm truncate">
            {result.blog_title}
          </p>
        )}

      </div>
    </div>
  );
};

export default ResultHeader;
