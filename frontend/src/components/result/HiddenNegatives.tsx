import React from 'react';
import type { HiddenNegative } from '../../types/analysis';

interface Props {
  negatives: HiddenNegative[];
}

const HiddenNegatives: React.FC<Props> = ({ negatives }) => {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col">
      <div className="flex items-center gap-3 mb-5 md:mb-6">
        <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100 flex-shrink-0">
          <span className="material-symbols-outlined text-[18px]">visibility</span>
        </div>
        <h3 className="text-[14px] md:text-[15px] font-extrabold text-on-surface tracking-tight">이 리뷰가 말하지 않은 것들</h3>
      </div>

      <div className="space-y-3 flex-grow">
        {negatives?.map((n, i) => (
          <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-200 transition-colors">
            <p className="text-[13px] md:text-[14px] font-bold text-gray-800 leading-snug mb-2">{n.inferred}</p>
            <p className="text-[11px] md:text-[12px] text-gray-400 leading-relaxed mb-3 break-keep">{n.reasoning}</p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-grow bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-400 rounded-full transition-all duration-700"
                  style={{ width: `${n.confidence}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-indigo-500 flex-shrink-0">{n.confidence}% 가능성</span>
            </div>
          </div>
        ))}
        {(!negatives || negatives.length === 0) && (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <span className="material-symbols-outlined text-gray-200 text-[36px]">check_circle</span>
            <p className="text-gray-400 text-[13px]">특별히 숨겨진 단점이 없어요.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HiddenNegatives;
