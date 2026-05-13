import React from 'react';

interface ResultLoadingProps {
  analysisStep: string;
  analysisProgress: number;
}

const ResultLoading: React.FC<ResultLoadingProps> = ({ analysisStep, analysisProgress }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#f8f9fa] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-[2rem] p-10 custom-shadow border border-emerald-50 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
        
        <div className="relative z-10 mb-8">
          <div className="w-16 h-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-5 border border-emerald-100">
             <span className="material-symbols-outlined text-emerald-600 text-[28px] animate-bounce-slow">search_check</span>
          </div>
          <h2 className="text-[20px] font-extrabold text-on-surface tracking-tight mb-1">AI 분석 엔진 가동 중</h2>
          <div className="min-h-6">
             <p className="text-[13px] text-emerald-600 font-bold tracking-wide animate-pulse">
               {analysisStep}
             </p>
          </div>
        </div>
        
        <div className="w-full space-y-3 relative z-10">
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${analysisProgress}%` }} 
            />
          </div>
          <div className="flex justify-between items-center px-0.5">
             <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">Scanning...</span>
             <span className="text-[13px] font-extrabold text-emerald-600">{analysisProgress}%</span>
          </div>
        </div>
        
        <div className="mt-8 pt-5 border-t border-gray-50 w-full text-[11px] text-gray-400 font-medium">
           데이터를 정밀하게 구조화하고 있습니다
        </div>
      </div>
    </div>
  );
};

export default ResultLoading;
