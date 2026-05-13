import React from 'react';
import type { AnalysisResponse } from '../../types/analysis';

interface Props {
  result: AnalysisResponse;
}

const SummaryCards: React.FC<Props> = ({ result }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '140ms' }}>

      {/* 한 줄 요약 */}
      <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-emerald-50 custom-shadow flex flex-col gap-4 md:gap-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 flex-shrink-0">
            <span className="material-symbols-outlined text-[18px]">edit_note</span>
          </div>
          <div>
            <h3 className="text-[14px] md:text-[15px] font-extrabold text-on-surface tracking-tight">광고 빼고 한 줄 요약</h3>
            <p className="text-[11px] text-gray-400 font-medium">과장과 홍보를 걷어낸 핵심 내용이에요</p>
          </div>
        </div>
        <div className="bg-emerald-50 rounded-[1.5rem] p-5 md:p-6 border border-emerald-100 flex-1">
          <blockquote className="text-[14px] md:text-[16px] font-bold leading-relaxed break-keep text-gray-800">
            "{result.real_summary}"
          </blockquote>
        </div>
      </div>

      {/* 종합 의견 */}
      <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-emerald-50 custom-shadow flex flex-col gap-4 md:gap-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100 flex-shrink-0">
            <span className="material-symbols-outlined text-[18px]">verified</span>
          </div>
          <div>
            <h3 className="text-[14px] md:text-[15px] font-extrabold text-on-surface tracking-tight">종합 의견</h3>
            <p className="text-[11px] text-gray-400 font-medium">모든 지표를 종합한 최종 판단이에요</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-[1.5rem] p-5 md:p-6 border border-gray-100 flex-1">
          <p className="text-[14px] md:text-[15px] font-bold leading-relaxed break-keep text-gray-800">
            {result.overall_verdict}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
