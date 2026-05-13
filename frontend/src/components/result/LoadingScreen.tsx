import React from 'react';

interface Props {
  progress: number;
  step: string;
}

const LoadingScreen: React.FC<Props> = ({ progress, step }) => (
  <div className="flex-1 flex flex-col items-center justify-center bg-white pt-20 pb-16 px-6">

    {/* 아이콘 */}
    <div
      className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-10"
      style={{ boxShadow: '0 12px 32px rgba(16, 185, 129, 0.28)' }}
    >
      <span
        className="material-symbols-outlined text-white text-[28px]"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        manage_search
      </span>
    </div>

    {/* 타이틀 */}
    <h2 className="text-[28px] font-extrabold text-slate-900 tracking-tight mb-3 text-center leading-tight">
      리뷰 분석 중이에요
    </h2>

    {/* 현재 단계 */}
    <p
      key={step}
      className="text-[14px] text-slate-400 font-medium text-center animate-fade-in"
      style={{ minHeight: '21px' }}
    >
      {step}
    </p>

    {/* 프로그레스 바 */}
    <div className="w-full mt-14" style={{ maxWidth: '280px' }}>
      <div className="h-[3px] bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between items-center mt-2.5">
        <span className="text-[11px] text-slate-300 font-medium">광고 여부 검사 중</span>
        <span className="text-[12px] font-bold text-emerald-500">{progress}%</span>
      </div>
    </div>

    {/* 하단 안내 */}
    <p className="text-[12px] text-slate-300 font-medium mt-14 text-center">
      보통 10~20초 걸려요
    </p>

  </div>
);

export default LoadingScreen;
