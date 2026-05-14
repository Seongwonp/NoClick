import React, { useState, useEffect } from 'react';

const ANALYSIS_STEPS = [
  { id: 1, label: '리뷰 데이터 수집 중...', subLabel: '대상 상품의 전체 리뷰 스크래핑 및 연동', icon: 'downloading' },
  { id: 2, label: '자연어 처리 알고리즘 적용 중...', subLabel: '형태소 분석 및 문맥 의도 파악', icon: 'smart_toy' },
  { id: 3, label: '어뷰징 패턴 정밀 분석 중...', subLabel: '반복 키워드, 특정 시간대 몰림 현상 추적', icon: 'troubleshoot' },
  { id: 4, label: '숨겨진 단점 추출 완료!', subLabel: '최종 신뢰도 스코어 산출 중', icon: 'verified' },
];

const LoadingState: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
    }, 1000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        const increment = Math.random() > 0.7 ? 0.4 : 1.2;
        return Math.min(prev + increment, 100);
      });
    }, 50);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-3xl animate-fade-in font-plus-jakarta-sans">
      
      {/* ── 상단 브랜드 요소 ── */}
      <div className="absolute top-12 flex flex-col items-center gap-2">
        <div className="text-emerald-600 font-black tracking-tighter text-2xl">No-Click</div>
        <div className="w-8 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"></div>
      </div>

      {/* ── 중앙 비주얼: 미니멀 렌즈 효과 ── */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-16">
        {/* Soft Glow Background */}
        <div className="absolute inset-0 bg-emerald-400/10 rounded-full blur-[60px] animate-pulse"></div>
        
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border border-emerald-100/50 scale-110 opacity-50"></div>
        
        {/* Inner Glass Lens */}
        <div className="relative w-48 h-48 md:w-56 md:h-56 bg-white/40 border border-white/60 rounded-full shadow-[0_30px_60px_rgba(0,0,0,0.05)] backdrop-blur-md flex items-center justify-center overflow-hidden">
          {/* Moving Gradient Shimmer */}
          <div className="absolute inset-[-100%] bg-gradient-to-tr from-transparent via-emerald-100/30 to-transparent rotate-45 animate-[shimmer_3s_infinite]"></div>
          
          <div className="flex flex-col items-center gap-4 relative z-10">
            <span className="material-symbols-outlined text-[56px] md:text-[72px] bg-gradient-to-br from-emerald-600 to-teal-500 bg-clip-text text-transparent animate-float">
              {ANALYSIS_STEPS[currentStep].icon}
            </span>
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
          
          {/* Inner Scan Line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-40 animate-scan-line"></div>
        </div>
      </div>

      {/* ── 텍스트 및 진행 바 ── */}
      <div className="text-center w-full max-w-sm px-8 flex flex-col items-center">
        <h2 className="text-[20px] md:text-[24px] font-extrabold text-on-background mb-6 tracking-tight break-keep">
          진실을 위한 정밀 분석 중
        </h2>
        
        {/* Modern Stepper */}
        <div className="w-full space-y-5 mb-10">
          {ANALYSIS_STEPS.map((step, index) => (
            <div 
              key={step.id} 
              className={`flex items-center gap-4 transition-all duration-700 ${
                index === currentStep ? 'opacity-100 translate-y-0 scale-100' : 
                index < currentStep ? 'opacity-30 -translate-y-1 scale-95' : 'opacity-10 translate-y-2 scale-90'
              }`}
            >
              <div className={`w-2 h-2 shrink-0 rounded-full transition-all duration-500 ${
                index <= currentStep ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-gray-200'
              }`}></div>
              <div className="flex flex-col text-left">
                <span className={`text-[15px] font-bold tracking-tight break-keep ${
                  index === currentStep ? 'text-emerald-700' : 'text-on-surface-variant'
                }`}>
                  {step.label}
                </span>
                {index === currentStep && (
                  <span className="text-[12px] font-medium tracking-tight mt-0.5 text-emerald-600/70 animate-fade-in">
                    {step.subLabel}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Minimal Progress */}
        <div className="w-full flex items-center gap-4">
          <div className="flex-grow h-[3px] bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="text-[12px] font-black text-emerald-600/60 tabular-nums w-8">
            {Math.floor(progress)}%
          </span>
        </div>
      </div>

      {/* ── 하단 캡션 ── */}
      <div className="absolute bottom-12 text-[12px] text-emerald-800/40 font-bold uppercase tracking-widest animate-pulse">
        Review X-Raying Engine Active
      </div>
    </div>
  );
};

export default LoadingState;
