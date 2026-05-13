import React from 'react';
import type { HighlightedPhrase } from '../../types/analysis';

const PHRASE_META: Record<string, { label: string; color: string; bg: string; border: string; icon: string; desc: string }> = {
  exaggeration:       { label: '과장 표현',  color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: 'priority_high', desc: '사실보다 부풀려진 묘사' },
  sponsor_denial:     { label: '광고 부인',  color: '#dc2626', bg: '#fff1f2', border: '#fecdd3', icon: 'block',          desc: '광고임을 숨기거나 부정' },
  negative_avoidance: { label: '단점 회피',  color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', icon: 'visibility_off', desc: '부정적 면을 의도적으로 생략' },
  ad_pattern:         { label: '광고 패턴',  color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe', icon: 'campaign',       desc: '전형적인 협찬 글 패턴' },
};

interface Props {
  phrases: HighlightedPhrase[];
  adProbability: number;
}

const AdBreakdown: React.FC<Props> = ({ phrases, adProbability }) => {
  const counts = (phrases || []).reduce((acc, p) => {
    const key = p.type || 'neutral';
    if (key !== 'neutral') acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(counts).reduce((s, v) => s + v, 0);
  const entries = Object.entries(PHRASE_META)
    .map(([type, meta]) => ({ type, ...meta, count: counts[type] || 0 }))
    .filter(e => e.count > 0)
    .sort((a, b) => b.count - a.count);

  const verdict = adProbability >= 70
    ? { text: '광고성 리뷰로 판단됩니다. 내용을 그대로 신뢰하기 어려워요.', color: '#ef4444', bg: '#fff1f2', border: '#fecdd3', icon: 'warning' }
    : adProbability >= 40
    ? { text: '일부 광고 표현이 포함되어 있어요. 주요 내용은 참고할 수 있지만 과장된 부분에 주의하세요.', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', icon: 'info' }
    : { text: '광고 표현이 거의 없는 솔직한 리뷰예요. 참고 가치가 높아요.', color: '#10b981', bg: '#f0fdf4', border: '#a7f3d0', icon: 'check_circle' };

  if (total === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <SectionTitle />
        <div className="flex items-center gap-3 mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
          <span className="material-symbols-outlined text-emerald-500 text-[20px] flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <p className="text-[13px] text-emerald-700 font-semibold">광고성 표현이 발견되지 않았어요. 신뢰할 수 있는 리뷰예요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
      <SectionTitle />

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* 왼쪽: 패턴별 바 */}
        <div className="space-y-3">
          {entries.map(e => {
            const pct = Math.round((e.count / total) * 100);
            return (
              <div key={e.type}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: e.bg, border: `1px solid ${e.border}` }}>
                      <span className="material-symbols-outlined text-[12px]" style={{ color: e.color }}>{e.icon}</span>
                    </div>
                    <div>
                      <span className="text-[12px] font-bold text-slate-700">{e.label}</span>
                      <span className="text-[10px] text-slate-400 ml-1.5">{e.desc}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] text-slate-400">{pct}%</span>
                    <span className="text-[13px] font-extrabold" style={{ color: e.color }}>{e.count}개</span>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${pct}%`, backgroundColor: e.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 오른쪽: AI 판단 + 도넛 차트 */}
        <div className="flex flex-col gap-4">
          {/* 도넛 차트 */}
          <DonutChart entries={entries} total={total} adProbability={adProbability} />

          {/* AI 종합 판단 */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl border" style={{ backgroundColor: verdict.bg, borderColor: verdict.border }}>
            <span className="material-symbols-outlined text-[16px] flex-shrink-0 mt-0.5" style={{ color: verdict.color, fontVariationSettings: "'FILL' 1" }}>{verdict.icon}</span>
            <p className="text-[12px] font-semibold leading-snug break-keep" style={{ color: verdict.color }}>{verdict.text}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

const SectionTitle: React.FC = () => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
      <span className="material-symbols-outlined text-white text-[16px]">bar_chart</span>
    </div>
    <div>
      <h3 className="text-[14px] md:text-[15px] font-extrabold text-slate-900 tracking-tight">광고 패턴 분석</h3>
      <p className="text-[11px] text-slate-400">발견된 광고 표현의 종류와 비율이에요</p>
    </div>
  </div>
);

interface DonutEntry { label: string; color: string; count: number }

const DonutChart: React.FC<{ entries: DonutEntry[]; total: number; adProbability: number }> = ({ entries, total, adProbability }) => {
  const SIZE = 100;
  const R = 36;
  const CIRC = 2 * Math.PI * R;
  let offset = 0;

  const slices = entries.map(e => {
    const pct = e.count / total;
    const dash = pct * CIRC;
    const gap = CIRC - dash;
    const slice = { ...e, dash, gap, offset };
    offset += dash;
    return slice;
  });

  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-20 h-20 -rotate-90">
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="#f1f5f9" strokeWidth="10" />
          {slices.map((s, i) => (
            <circle
              key={i}
              cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none"
              stroke={s.color} strokeWidth="10"
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={-s.offset}
            />
          ))}
        </svg>
      </div>
      <div>
        <p className="text-[11px] text-slate-400 font-semibold mb-1">총 광고 표현</p>
        <p className="text-[22px] font-black text-slate-900 leading-none">{total}<span className="text-[12px] font-bold text-slate-400 ml-1">개</span></p>
        <p className="text-[11px] font-semibold mt-1" style={{ color: adProbability >= 70 ? '#ef4444' : adProbability >= 40 ? '#f59e0b' : '#10b981' }}>
          광고 확률 {adProbability}%
        </p>
      </div>
    </div>
  );
};

export default AdBreakdown;
