import React from 'react';

interface Props {
  progress: number;
  step: string;
}

const LoadingScreen: React.FC<Props> = ({ progress, step }) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#f8f9fa] px-6 py-16">
      <div className="w-full max-w-sm">

        {/* 아이콘 */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-500 text-[36px] animate-bounce-slow">
                search_check
              </span>
            </div>
            {/* 회전하는 링 */}
            <div className="absolute inset-0 rounded-[2rem] border-2 border-emerald-200 border-t-emerald-500 animate-spin" style={{ animationDuration: '1.5s' }} />
          </div>
        </div>

        {/* 텍스트 */}
        <div className="text-center mb-8">
          <h2 className="text-[22px] font-extrabold text-gray-900 mb-2">리뷰 분석 중이에요</h2>
          <p className="text-[14px] text-emerald-600 font-semibold animate-pulse min-h-[20px]">{step}</p>
        </div>

        {/* 프로그레스 바 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[12px] text-gray-400 font-medium">분석 진행률</span>
            <span className="text-[16px] font-extrabold text-emerald-600">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400 text-center mt-4">
            광고 여부를 꼼꼼히 살펴보고 있어요 · 보통 10~20초 걸려요
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoadingScreen;
