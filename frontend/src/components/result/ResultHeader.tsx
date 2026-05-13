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
  const adColor = result.ad_probability >= 70 ? '#ef4444'
    : result.ad_probability >= 40 ? '#f59e0b'
    : '#10b981';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in-up">

      {/* 등급 컬러 바 */}
      <div className="h-1.5" style={{ backgroundColor: trustRank.color }} />

      <div className="px-6 py-6 md:px-7">

        {/* 등급 + 광고확률 */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: trustRank.bg, border: `1.5px solid ${trustRank.borderColor}` }}
            >
              <span className="text-[32px] font-black leading-none" style={{ color: trustRank.color }}>
                {trustRank.grade}
              </span>
            </div>
            <div>
              <p className="text-[18px] font-extrabold text-slate-900 leading-tight tracking-tight">{trustRank.label}</p>
              <p className="text-[12px] text-slate-400 mt-0.5 break-keep">{trustRank.sub}</p>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <p className="text-[10px] text-slate-400 font-semibold mb-0.5">광고 확률</p>
            <p className="text-[22px] font-black leading-none" style={{ color: adColor }}>
              {result.ad_probability}%
            </p>
          </div>
        </div>

        {/* 신뢰 점수 바 */}
        <div className="mb-6">
          <div className="flex justify-between text-[11px] font-semibold mb-1.5">
            <span className="text-slate-400">신뢰 점수</span>
            <span style={{ color: trustRank.color }}>{result.trust_score}점</span>
          </div>
          <div className="h-[3px] bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${result.trust_score}%`, backgroundColor: trustRank.color }}
            />
          </div>
        </div>

        {/* 구분선 */}
        <div className="h-px bg-slate-100 mb-5" />

        {/* 핵심 요약 */}
        {result.real_summary && (
          <blockquote className="text-[15px] font-bold text-slate-800 leading-relaxed break-keep mb-4">
            "{result.real_summary}"
          </blockquote>
        )}

        {/* 종합 의견 */}
        {result.overall_verdict && (
          <p className="text-[12px] text-slate-400 leading-relaxed break-keep line-clamp-3">
            {result.overall_verdict}
          </p>
        )}

        {/* 숨겨진 의도 */}
        {result.hidden_intent && (
          <div className="flex items-start gap-2 mt-4 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-3">
            <FaRegLightbulb className="text-amber-500 flex-shrink-0 mt-0.5" size={13} />
            <p className="text-[12px] text-amber-800 font-medium leading-snug break-keep">
              {result.hidden_intent}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ResultHeader;
