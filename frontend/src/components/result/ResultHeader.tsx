import React from 'react';
import { FaShareAlt, FaDownload } from 'react-icons/fa';
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
    <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-emerald-50 custom-shadow animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-stretch gap-6 md:gap-8">

        {/* 신뢰 등급 배지 */}
        <div
          className="flex-shrink-0 flex flex-row sm:flex-col items-center justify-center rounded-[1.5rem] px-6 sm:px-10 py-4 sm:py-6 border gap-4 sm:gap-0"
          style={{ backgroundColor: trustRank.bg, borderColor: trustRank.borderColor }}
        >
          <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest sm:mb-2 hidden sm:block">신뢰 등급</span>
          <span
            className="text-[56px] sm:text-[72px] font-black leading-none tracking-tighter"
            style={{ color: trustRank.color }}
          >
            {trustRank.grade}
          </span>
          <div className="flex flex-col sm:items-center">
            <span className="text-[13px] font-bold sm:mt-1" style={{ color: trustRank.color }}>
              {trustRank.label}
            </span>
            <span className="text-[11px] text-gray-400 mt-0.5 sm:text-center sm:max-w-[120px]">
              {trustRank.sub}
            </span>
          </div>
        </div>

        {/* 우측 정보 */}
        <div className="flex-1 flex flex-col justify-between gap-4 md:gap-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[12px] text-gray-400 font-medium mb-1">분석 완료</p>
              <h1 className="text-[16px] md:text-[18px] font-extrabold text-on-surface tracking-tight leading-snug break-keep">
                {result.blog_title || '리뷰 분석 결과'}
              </h1>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors border border-gray-100">
                <FaShareAlt size={13} />
              </button>
              <button className="w-9 h-9 rounded-xl bg-on-surface flex items-center justify-center text-white hover:bg-gray-700 transition-colors">
                <FaDownload size={13} />
              </button>
            </div>
          </div>

          {/* 숨겨진 의도 */}
          {result.hidden_intent && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
              <span className="material-symbols-outlined text-amber-500 text-[18px] flex-shrink-0 mt-0.5">lightbulb</span>
              <p className="text-[12px] md:text-[13px] text-amber-800 font-medium leading-snug break-keep">{result.hidden_intent}</p>
            </div>
          )}

          {/* 요약 지표 3개 */}
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {[
              { label: '광고 표현', val: result.highlighted_phrases?.length || 0, unit: '개', color: '#ef4444' },
              { label: '숨겨진 단점', val: result.hidden_negatives?.length || 0, unit: '건', color: '#6366f1' },
              { label: '절약 예상', val: result.saved_cost?.replace('원', '') || '0', unit: '원', color: '#10b981' },
            ].map((s, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-3 md:p-4 border border-gray-100 flex flex-col justify-center">
                <p className="text-[10px] md:text-[11px] font-bold text-gray-400 mb-1">{s.label}</p>
                <p className="text-[15px] md:text-[18px] font-extrabold text-gray-800">
                  <span style={{ color: s.color }}>{s.val}</span>
                  <span className="text-[10px] md:text-[11px] font-bold text-gray-400 ml-1">{s.unit}</span>
                </p>
              </div>
            ))}
          </div>

          {/* 신뢰도 진행 바 */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[12px] font-bold text-gray-500">신뢰 점수</span>
              <span className="text-[13px] font-extrabold" style={{ color: trustRank.color }}>{result.trust_score}점</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${result.trust_score}%`, backgroundColor: trustRank.color }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultHeader;
