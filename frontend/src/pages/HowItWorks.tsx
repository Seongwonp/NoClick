import React from 'react';

const HowItWorks: React.FC = () => {
  return (
    <div className="flex-grow pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="font-display-lg text-[40px] font-bold text-on-background mb-4">
          How it Works
        </h1>
        <p className="font-body-lg text-[16px] text-on-surface-variant max-w-2xl mx-auto mb-16">
          No-Click AI는 복잡한 광고 패턴과 인위적인 수식어를 걸러내어<br/>리뷰의 핵심적인 사실만을 추출합니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined">content_paste</span>
            </div>
            <h3 className="font-headline-sm text-[18px] font-semibold mb-3">1. 리뷰 입력</h3>
            <p className="font-body-md text-[14px] text-on-surface-variant">
              분석하고 싶은 리뷰 텍스트나 링크를 붙여넣으세요. 대량의 텍스트도 한 번에 처리 가능합니다.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined">psychology</span>
            </div>
            <h3 className="font-headline-sm text-[18px] font-semibold mb-3">2. AI 패턴 분석</h3>
            <p className="font-body-md text-[14px] text-on-surface-variant">
              AI가 문맥을 파악하여 광고성 어조, 과장된 감정, 숨겨진 단점을 정밀하게 분석합니다.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="w-12 h-12 bg-tertiary/10 text-tertiary rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined">fact_check</span>
            </div>
            <h3 className="font-headline-sm text-[18px] font-semibold mb-3">3. 정제된 결과 확인</h3>
            <p className="font-body-md text-[14px] text-on-surface-variant">
              수식어가 제거된 팩트 중심의 요약과 진실성 점수를 통해 현명한 소비를 도와드립니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
