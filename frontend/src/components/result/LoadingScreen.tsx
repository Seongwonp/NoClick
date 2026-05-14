import React from 'react';

interface Props {
  progress: number;
  step: string;
}

const LoadingScreen: React.FC<Props> = ({ progress, step }) => (
  <div className="flex-1 flex flex-col items-center justify-center bg-white pt-24 pb-16 px-6">
    <h2 className="text-[26px] font-extrabold text-slate-900 tracking-tight mb-3 text-center leading-tight">
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
    <div className="w-full mt-10" style={{ maxWidth: '300px' }}>
      <div className="h-[2px] bg-slate-200 rounded-full overflow-hidden">
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
    <p className="text-[12px] text-slate-300 font-medium mt-10 text-center">
      보통 10~20초 걸려요
    </p>

  </div>
);

export default LoadingScreen;
