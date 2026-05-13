import React from 'react';
import type { HiddenNegative } from '../../types/analysis';

interface Props {
  negatives: HiddenNegative[];
}

const HiddenNegatives: React.FC<Props> = ({ negatives }) => {
  if (!negatives || negatives.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-7">
      <div className="flex items-center gap-2.5 mb-5">
        <span
          className="material-symbols-outlined text-indigo-500 text-[20px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          visibility_off
        </span>
        <div>
          <h3 className="text-[15px] font-extrabold text-slate-900 tracking-tight">이 리뷰가 말하지 않은 것들</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">AI가 추론한 숨겨진 단점이에요</p>
        </div>
      </div>

      <div className="space-y-3">
        {negatives.map((n, i) => (
          <div key={i} className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
            <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[10px] font-black text-indigo-400">{i + 1}</span>
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-slate-800 leading-snug mb-1">{n.inferred}</p>
              <p className="text-[11px] text-slate-400 leading-relaxed break-keep">{n.reasoning}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HiddenNegatives;
