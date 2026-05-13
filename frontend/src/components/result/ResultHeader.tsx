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
  const adColor = result.ad_probability >= 70 ? '#ef4444'
    : result.ad_probability >= 40 ? '#f59e0b'
    : '#10b981';

  return (
    <div className="bg-white rounded-[2rem] border border-emerald-50 custom-shadow overflow-hidden animate-fade-in-up">
      <div className="h-1" style={{ backgroundColor: trustRank.color }} />

      <div className="p-6">
        {/* 등급 + 광고확률 */}
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: trustRank.bg, border: `1.5px solid ${trustRank.borderColor}` }}
          >
            <span className="text-[34px] font-black leading-none" style={{ color: trustRank.color }}>
              {trustRank.grade}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[18px] font-extrabold text-on-surface tracking-tight leading-tight">{trustRank.label}</p>
            <p className="text-[12px] text-on-surface-variant mt-0.5 break-keep">{trustRank.sub}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] text-on-surface-variant font-semibold mb-0.5">광고 확률</p>
            <p className="text-[22px] font-black leading-none" style={{ color: adColor }}>
              {result.ad_probability}%
            </p>
          </div>
        </div>

        {/* 신뢰 점수 바 */}
        <div className="mb-1">
          <div className="flex justify-between text-[11px] font-semibold mb-2">
            <span className="text-on-surface-variant">신뢰 점수</span>
            <span style={{ color: trustRank.color }}>{result.trust_score}점</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${result.trust_score}%`, backgroundColor: trustRank.color }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultHeader;
