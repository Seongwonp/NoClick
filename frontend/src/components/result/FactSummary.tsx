import React from 'react';
import { FaRobot } from 'react-icons/fa';
import type { AnalysisResponse } from '../../types/analysis';

interface FactSummaryProps {
  analysisResult: AnalysisResponse;
}

const FactSummary: React.FC<FactSummaryProps> = ({ analysisResult }) => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '140ms' }}>
      
      {/* 팩트 요약 (TL;DR Quote Block) */}
      <div className="bg-[#009368] rounded-[32px] p-8 lg:p-10 text-white shadow-[0_8px_30px_rgba(0,147,104,0.2)] relative overflow-hidden flex flex-col justify-center min-h-[220px]">
        {/* 장식용 따옴표 배경 */}
        <span className="absolute top-2 left-6 text-[140px] leading-none text-white/10 font-serif font-black select-none">"</span>
        <span className="absolute bottom-[-60px] right-6 text-[140px] leading-none text-white/10 font-serif font-black select-none rotate-180">"</span>
        
        <div className="relative z-10 flex flex-col items-center text-center gap-4">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-[12px] font-bold tracking-widest backdrop-blur-md shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            광고 쏙 뺀 진짜 핵심
          </div>
          <h2 className="text-[18px] lg:text-[22px] font-black leading-relaxed break-keep tracking-tight">
            {analysisResult.real_summary}
          </h2>
        </div>
      </div>

      {/* AI 총평 (Avatar Chat Layout) */}
      <div className="bg-white rounded-[32px] p-6 lg:p-8 border border-[#009368]/10 shadow-[0_8px_30px_rgba(0,147,104,0.08)] flex gap-5 items-start">
        <div className="w-14 h-14 bg-[#009368]/5 rounded-[24px] flex-shrink-0 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,147,104,0.05)] border border-[#009368]/10">
          <FaRobot className="text-[24px] text-[#009368]" />
        </div>
        <div className="flex-1 pt-1">
          <h3 className="text-[15px] font-extrabold text-gray-800 tracking-tight mb-2">AI가 분석한 솔직한 총평</h3>
          <p className="text-[14px] font-medium leading-relaxed text-gray-600 break-keep">
            {analysisResult.overall_verdict}
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default FactSummary;
