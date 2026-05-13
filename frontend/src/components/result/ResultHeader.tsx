import React from 'react';
import { FaShareAlt } from 'react-icons/fa';
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

const R = 38;
const CIRC = 2 * Math.PI * R;

const TrustGauge: React.FC<{ score: number; color: string; grade: string; label: string }> = ({ score, color, grade, label }) => {
  const offset = CIRC * (1 - score / 100);
  return (
    <div className="flex flex-col items-center gap-1 flex-shrink-0">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 88 88" className="w-full h-full -rotate-90">
          <circle cx="44" cy="44" r={R} fill="none" stroke="#f1f5f9" strokeWidth="8" />
          <circle
            cx="44" cy="44" r={R} fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[26px] font-black leading-none" style={{ color }}>{grade}</span>
          <span className="text-[10px] font-bold text-slate-400 mt-0.5">{score}점</span>
        </div>
      </div>
      <span className="text-[12px] font-extrabold" style={{ color }}>{label}</span>
    </div>
  );
};

const formatSavedCost = (savedCost?: string) => {
  if (!savedCost) return '0';
  const raw = Number(savedCost.replace(/[^\d]/g, ''));
  if (!raw) return '0';
  if (raw >= 10000) return `${Math.round(raw / 10000)}만`;
  return raw.toLocaleString('ko-KR');
};

const ResultHeader: React.FC<Props> = ({ result, trustRank }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'NoClick 분석 결과', text: result.blog_title || '리뷰 분석 결과', url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const adRisk = result.ad_probability >= 70 ? { label: '광고 가능성 높음', color: '#ef4444', bg: '#fff1f2' }
    : result.ad_probability >= 40 ? { label: '광고 가능성 중간', color: '#f59e0b', bg: '#fffbeb' }
    : { label: '광고 가능성 낮음', color: '#10b981', bg: '#f0fdf4' };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm animate-fade-in-up overflow-hidden">

      {/* 상단 컬러 바 */}
      <div className="h-1" style={{ backgroundColor: trustRank.color }} />

      <div className="p-5 md:p-7">
        <div className="flex flex-col sm:flex-row gap-5 md:gap-7">

          {/* 왼쪽: 신뢰도 게이지 */}
          <div className="flex sm:flex-col items-center gap-4 sm:gap-2 flex-shrink-0">
            <TrustGauge
              score={result.trust_score}
              color={trustRank.color}
              grade={trustRank.grade}
              label={trustRank.label}
            />
            <p className="text-[11px] text-slate-400 text-center hidden sm:block max-w-[100px] leading-snug break-keep">{trustRank.sub}</p>
          </div>

          {/* 오른쪽: 정보 */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">

            {/* 타이틀 + 공유 */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">분석 완료</p>
                <h1 className="text-[15px] md:text-[17px] font-extrabold text-slate-900 leading-snug break-keep">
                  {result.blog_title || '리뷰 분석 결과'}
                </h1>
              </div>
              <button
                onClick={handleShare}
                className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors border border-slate-200 flex-shrink-0"
              >
                <FaShareAlt size={12} />
              </button>
            </div>

            {/* 광고 확률 바 */}
            <div className="rounded-xl border p-3 md:p-4" style={{ backgroundColor: adRisk.bg, borderColor: adRisk.color + '33' }}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-bold" style={{ color: adRisk.color }}>{adRisk.label}</span>
                <span className="text-[13px] font-extrabold" style={{ color: adRisk.color }}>{result.ad_probability}%</span>
              </div>
              <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${result.ad_probability}%`, backgroundColor: adRisk.color }}
                />
              </div>
            </div>

            {/* 숨겨진 의도 */}
            {result.hidden_intent && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-3">
                <span className="material-symbols-outlined text-amber-500 text-[16px] flex-shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                <p className="text-[12px] md:text-[13px] text-amber-800 font-medium leading-snug break-keep">{result.hidden_intent}</p>
              </div>
            )}

            {/* 지표 4개 */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '광고 표현', val: result.highlighted_phrases?.length || 0, unit: '개', color: '#ef4444' },
                { label: '숨겨진 단점', val: result.hidden_negatives?.length || 0, unit: '건', color: '#6366f1' },
                { label: '절약 예상', val: formatSavedCost(result.saved_cost), unit: '원', color: '#10b981' },
                { label: '절약 시간', val: result.saved_time?.replace('분', '') || '0', unit: '분', color: '#3b82f6' },
              ].map((s, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-2.5 md:p-3 border border-slate-200 flex flex-col">
                  <p className="text-[9px] md:text-[10px] font-bold text-slate-400 mb-1 leading-tight">{s.label}</p>
                  <p className="text-[14px] md:text-[16px] font-extrabold leading-none">
                    <span style={{ color: s.color }}>{s.val}</span>
                    <span className="text-[9px] md:text-[10px] font-bold text-slate-400 ml-0.5">{s.unit}</span>
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultHeader;
