import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockAnalysisService } from '../services/mockApi';

const Analysis: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const inputText = location.state?.text || '';

  useEffect(() => {
    // 텍스트가 없으면 홈으로 리다이렉트 (직접 접근 방지)
    if (!inputText) {
      navigate('/');
      return;
    }

    // 분석 프로세스 시작
    const startAnalysis = async () => {
      try {
        const result = await mockAnalysisService.analyze({ text: inputText });
        // 분석 완료 후 결과 페이지로 이동 (ID 전달)
        navigate(`/result?id=${result.id}`);
      } catch (error) {
        console.error('Analysis failed:', error);
        alert('분석 중 오류가 발생했습니다.');
        navigate('/');
      }
    };

    startAnalysis();

    // 프로그레스 바 애니메이션
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return 95; // 실제 데이터 완료 전까지는 95%에서 대기
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [inputText, navigate]);

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
            <p className="whitespace-pre-wrap">{inputText}</p>
            <p className="pulse-slow border-l-4 border-primary-container pl-4 italic text-on-surface-variant mt-4">
              "AI가 문맥을 파악하여 광고성 패턴을 분석하고 있습니다..."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
