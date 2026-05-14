import React from 'react';

import type { AnalysisResponse } from '../../types/analysis';

interface ResultHeaderProps {
  analysisResult: AnalysisResponse;
}

export const getRank = (score: number) => {
  if (score >= 93) return { grade: 'S', color: '#10b981', bg: '#ecfdf5', borderColor: '#a7f3d0', label: '믿고 보셔도 돼요', sub: '진심이 느껴지는 아주 솔직한 리뷰입니다.' };
  if (score >= 85) return { grade: 'A', color: '#3b82f6', bg: '#eff6ff', borderColor: '#bfdbfe', label: '대체로 믿을 만해요', sub: '정보가 꽤 알차고 신뢰할 수 있는 내용입니다.' };
  if (score >= 70) return { grade: 'B', color: '#f59e0b', bg: '#fffbeb', borderColor: '#fde68a', label: '반만 믿으세요', sub: '홍보성 느낌이 살짝 섞여 있으니 주의하세요.' };
  return { grade: 'C', color: '#dc2626', bg: '#FFF0F0', borderColor: '#fee2e2', label: '광고일 확률이 높아요', sub: '광고 전용 문구가 많이 발견된 리뷰입니다.' };
};

const ResultHeader: React.FC<ResultHeaderProps> = ({ analysisResult }) => {
  const trustRank = getRank(analysisResult.trust_score);
  const savedCostDisplay = (() => {
    const raw = (analysisResult.saved_cost || '').trim();
    if (!raw || raw === '0원') return '-';
    const compact = raw.replace(/\s+/g, '');
    const amountMatch = compact.match(/^[^()]+원/);
    if (amountMatch) return amountMatch[0];
    return compact.split('(')[0] || compact;
  })();

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-[32px] p-4 md:p-6 lg:p-8 border border-white/40 shadow-[0_8px_32px_rgba(0,147,104,0.05)] animate-fade-in-up flex flex-col gap-5 lg:gap-8">

      {/* Title & Trust Rank Typography */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[15px] md:text-[17px] font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-[#009368] text-[20px]">verified_user</span>
            AI 리뷰 신뢰도 분석 보고서
          </h1>
          <p className="text-[12px] md:text-[13px] text-gray-400 font-medium mt-1.5 break-keep">{trustRank.sub}</p>
        </div>
        <div className="flex flex-col sm:items-end">
          <div className="flex items-baseline gap-2">
            <span
              className="text-[36px] md:text-[46px] font-black leading-none tracking-tighter"
              style={{ color: trustRank.color, textShadow: `0 0 25px ${trustRank.color}30` }}
            >
              {trustRank.grade}
            </span>
            <span className="text-[14px] font-extrabold text-gray-400">등급</span>
          </div>
          <span
            className="text-[14px] font-bold mt-1 tracking-tight"
            style={{ color: trustRank.color }}
          >
            {trustRank.label} · {analysisResult.trust_score}점
          </span>
        </div>
      </div>

      {/* 3 Metrics (Sleek minimalist grid) */}
      <div className="grid grid-cols-3 bg-white/40 backdrop-blur-md rounded-xl lg:rounded-[24px] p-3 md:p-4 lg:p-5 border border-white/60 shadow-[inset_0_2px_10px_rgba(0,147,104,0.02)] divide-x divide-[#009368]/5">
        {[
          { label: '광고 패턴', val: analysisResult.highlighted_phrases?.length || 0, unit: '개', color: '#ef4444' },
          { label: '숨은 단점', val: analysisResult.hidden_negatives?.length || 0, unit: '건', color: '#eab308' },
          { label: '비용 절감', val: savedCostDisplay, unit: '', color: '#10b981' }
        ].map((s, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-center gap-1.5 min-w-0">
            <p className="text-[11px] font-bold text-[#009368]/70 uppercase tracking-widest">{s.label}</p>
            <p className="font-black text-[clamp(14px,3.8vw,18px)] leading-tight text-gray-800 flex items-baseline justify-center gap-0.5 tabular-nums min-w-0 w-full text-center">
              <span style={{ color: s.color }} className="max-w-full break-all">{s.val}</span>
              {s.unit && <span className="text-[11px] text-gray-400 font-bold">{s.unit}</span>}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultHeader;
