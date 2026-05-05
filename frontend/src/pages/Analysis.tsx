import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Analysis: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          navigate('/result');
          return 100;
        }
        return prev + 5;
      });
    }, 300); // 300ms * 20 = 6 seconds to complete

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="flex-grow pt-32 pb-20 px-6 max-w-4xl mx-auto w-full">
      {/* Progress Header */}
      <header className="text-center mb-12">
        <h1 className="font-display-lg text-[40px] font-bold text-on-surface mb-4">AI가 리뷰를 꼼꼼히 읽고 있어요...</h1>
        <p className="font-body-lg text-[16px] text-on-surface-variant">잠시만 기다려 주세요. 꼼꼼하게 분석 중입니다.</p>
      </header>

      {/* Bento Layout for Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Live Log & Progress */}
        <div className="md:col-span-1 flex flex-col gap-6">
          {/* Progress Card */}
          <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100">
            <div className="flex justify-between items-end mb-4">
              <span className="font-label-sm text-[12px] font-semibold text-primary uppercase">Current Progress</span>
              <span className="font-headline-md text-[24px] font-bold text-on-surface">{progress}%</span>
            </div>
            <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden">
              <div 
                className="bg-primary-container h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Friendly Activity Logs */}
          <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 flex-grow">
            <h3 className="font-headline-sm text-[18px] font-semibold text-on-surface mb-4">실시간 분석 로그</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                <p className="font-body-md text-[14px]">전체 텍스트 스캔 완료</p>
              </div>
              <div className="flex items-center gap-3 text-on-surface">
                <span className="material-symbols-outlined text-secondary text-lg pulse-slow" style={{fontVariationSettings: "'FILL' 1"}}>search</span>
                <p className="font-body-md text-[14px]">광고성 수식어를 찾았어요 🔍</p>
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant opacity-70">
                <span className="material-symbols-outlined text-tertiary-container text-lg">auto_awesome</span>
                <p className="font-body-md text-[14px]">숨겨진 맥락을 파악 중입니다 ✨</p>
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant opacity-40">
                <span className="material-symbols-outlined text-gray-400 text-lg">verified</span>
                <p className="font-body-md text-[14px]">최종 신뢰 점수 산출 예정</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Real-time Highlighting Text Area */}
        <div className="md:col-span-2 bg-white p-12 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="font-label-sm text-[12px] bg-surface-container px-3 py-1 rounded-full text-outline">LIVE ANALYSIS</span>
          </div>
          <h3 className="font-headline-md text-[24px] font-semibold text-on-surface mb-6">분석 중인 리뷰 원문</h3>
          
          <div className="font-body-lg text-[16px] text-on-surface leading-relaxed space-y-4">
            <p>
              이번에 새로 출시된 <span className="bg-secondary-fixed/50 px-1 rounded">스마트워치 S7</span>은 디자인이 정말 미쳤네요. 
              처음 박스를 깠을 때 그 <span className="bg-primary-fixed/40 px-1 rounded decoration-primary-container decoration-2 underline-offset-4 underline">영롱한 광택</span>이... 
              진짜 이건 무조건 사야 합니다. 
            </p>
            <p>
              근데 사용하다 보니까 <span className="bg-tertiary-fixed/50 px-1 rounded text-on-tertiary-fixed">배터리가 생각보다 빨리 닳아요</span>. 
              하루를 못 버티는 느낌? 그리고 <span className="bg-secondary-fixed/50 px-1 rounded">UI 반응 속도</span>는 빠르지만 가끔 <span className="bg-error-container/40 text-on-error-container px-1 rounded italic">버벅임</span>이 있네요. 
            </p>
            <p className="pulse-slow border-l-4 border-primary-container pl-4 italic text-on-surface-variant">
              "광고성 수식어(영롱한, 무조건 사야 함)를 탐지하여 필터링하는 중..."
            </p>
            <p>
              그래도 <span className="bg-primary-fixed/40 px-1 rounded">가성비 면에서는 나쁘지 않은 선택</span>인 것 같습니다. 
              특히 <span className="border-b-2 border-secondary-container">수면 추적 기능</span>은 꽤 정확하게 측정되는 느낌이라 만족스러워요.
            </p>
          </div>

          {/* Subtle Decorative Element */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary-fixed"></div>
              <span className="font-label-sm text-[12px] text-on-surface-variant">긍정 포인트</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-tertiary-fixed"></div>
              <span className="font-label-sm text-[12px] text-on-surface-variant">부정/개선점</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary-fixed"></div>
              <span className="font-label-sm text-[12px] text-on-surface-variant">핵심 키워드</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Context Info */}
      <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 bg-primary/5 p-6 rounded-2xl border border-primary/10">
        <div className="flex items-center gap-4">
          <div className="bg-primary text-white p-3 rounded-xl">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>security</span>
          </div>
          <div>
            <h4 className="font-headline-sm text-[18px] font-semibold text-on-primary-container">가짜 리뷰를 걸러내고 있습니다</h4>
            <p className="font-body-md text-[14px] text-on-primary-container/80">No-Click 알고리즘이 중복 패턴과 상업적 키워드를 추적합니다.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2 border border-outline rounded-xl font-semibold text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            중단하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
