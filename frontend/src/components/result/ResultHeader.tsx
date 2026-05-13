import React from 'react';
import { FaRegLightbulb } from 'react-icons/fa';
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

      <div className="px-6 py-6 md:px-8 md:py-7 flex flex-col gap-4">

        {/* 등급 + 점수 + 광고 확률 */}
        <div className="w-full max-w-2xl mx-auto flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: trustRank.bg, border: `1.5px solid ${trustRank.borderColor}` }}
          >
            <span className="text-[34px] font-black leading-none" style={{ color: trustRank.color }}>
              {trustRank.grade}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[20px] font-extrabold text-slate-900 tracking-tight leading-tight">{trustRank.label}</p>
            <p className="text-[13px] text-slate-400 font-medium mt-1 break-keep">{trustRank.sub}</p>
          </div>
          </div>

          <div className="px-1 py-1 text-right flex-shrink-0">
            <p className="text-[11px] text-slate-400 font-semibold">광고 확률</p>
            <p className="text-[16px] font-extrabold text-red-500 mt-0.5">{result.ad_probability}%</p>
          </div>
        </div>

        {/* 신뢰 점수 바 */}
        <div className="w-full max-w-2xl mx-auto">
          <div className="flex justify-between items-center text-[12px] font-semibold mb-2">
            <span className="text-slate-400 whitespace-nowrap">신뢰 점수</span>
            <span className="whitespace-nowrap" style={{ color: trustRank.color }}>{result.trust_score}점</span>
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
          <div className="w-full max-w-2xl mx-auto flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <span className="text-amber-600 text-[15px] flex-shrink-0 mt-0.5">
              <FaRegLightbulb />
            </span>
            <p className="text-[12px] text-amber-800 font-medium leading-snug break-keep">
              {result.hidden_intent}
            </p>
          </div>
        )}

        {/* 블로그 제목 */}
        {result.blog_title && (
          <p className="w-full max-w-2xl mx-auto text-[12px] text-slate-400 font-medium break-keep whitespace-normal leading-relaxed">
            {result.blog_title}
          </p>
        )}

      </div>
    </div>
  );
};

export default ResultHeader;
