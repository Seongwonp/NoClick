import React from 'react';

interface Props {
  progress: number;
  step: string;
}

const STEPS = [
  { icon: 'text_fields',    label: '리뷰 내용 확인 중' },
  { icon: 'campaign',       label: '광고 표현 찾는 중' },
  { icon: 'visibility_off', label: '숨겨진 단점 파악 중' },
  { icon: 'psychology',     label: '작성 의도 분석 중' },
  { icon: 'summarize',      label: '결과 정리 중' },
];

const LoadingScreen: React.FC<Props> = ({ progress }) => {
  const activeStep = Math.min(Math.floor(progress / 20), STEPS.length - 1);

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">

        {/* 카드 */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100">

          {/* 상단 그라데이션 바 */}
          <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

          <div className="p-7">

            {/* 아이콘 */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* 외부 펄스 링 */}
                <div className="absolute -inset-3 rounded-full bg-emerald-100 opacity-50 animate-ping" style={{ animationDuration: '2s' }} />
                <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                  <span className="material-symbols-outlined text-white text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    manage_search
                  </span>
                </div>
              </div>
            </div>

            {/* 타이틀 */}
            <div className="text-center mb-7">
              <h2 className="text-[20px] font-extrabold text-slate-900 tracking-tight mb-1">리뷰 분석 중이에요</h2>
              <p className="text-[12px] text-slate-400 font-medium">보통 10~20초 걸려요</p>
            </div>

            {/* 스텝 목록 */}
            <div className="space-y-2.5 mb-7">
              {STEPS.map((s, i) => {
                const isDone   = i < activeStep;
                const isActive = i === activeStep;
                const isPending = i > activeStep;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-300"
                    style={{
                      backgroundColor: isActive ? '#f0fdf4' : 'transparent',
                      border: isActive ? '1px solid #bbf7d0' : '1px solid transparent',
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      style={{
                        backgroundColor: isDone ? '#10b981' : isActive ? '#d1fae5' : '#f1f5f9',
                      }}
                    >
                      {isDone ? (
                        <span className="material-symbols-outlined text-white text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                      ) : (
                        <span
                          className={`material-symbols-outlined text-[14px] ${isActive ? 'text-emerald-600 animate-bounce-slow' : 'text-slate-300'}`}
                        >
                          {s.icon}
                        </span>
                      )}
                    </div>
                    <span
                      className="text-[13px] font-semibold transition-all duration-300"
                      style={{
                        color: isDone ? '#6ee7b7' : isActive ? '#059669' : '#cbd5e1',
                      }}
                    >
                      {s.label}
                      {isActive && (
                        <span className="ml-1 inline-flex gap-0.5">
                          {[0, 1, 2].map(j => (
                            <span
                              key={j}
                              className="inline-block w-1 h-1 rounded-full bg-emerald-500 animate-bounce"
                              style={{ animationDelay: `${j * 0.15}s`, animationDuration: '0.8s' }}
                            />
                          ))}
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 프로그레스 바 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-bold text-slate-400">진행률</span>
                <span className="text-[13px] font-extrabold text-emerald-600">{progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(to right, #10b981, #14b8a6)',
                  }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* 하단 힌트 */}
        <p className="text-center text-[11px] text-slate-400 mt-4 font-medium">
          광고 여부를 AI가 꼼꼼히 살펴보고 있어요
        </p>

      </div>
    </div>
  );
};

export default LoadingScreen;
