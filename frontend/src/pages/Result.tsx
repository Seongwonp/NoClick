import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { AnalysisResult } from '../types/analysis';
import { mockAnalysisService } from '../services/mockApi';
import MockPlatformViewer from '../components/MockPlatformViewer';

const Result: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const platform = location.state?.platform || 'other';
  const inputText = location.state?.text || '';
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  // 초기 데이터 로딩 처리
  useEffect(() => {
    if (!inputText) {
      navigate('/');
      return;
    }

    const startAnalysis = async () => {
      try {
        const data = await mockAnalysisService.analyze({ text: inputText });
        setResult(data);
      } catch (error) {
        console.error('Analysis failed:', error);
        alert('분석 중 오류가 발생했습니다.');
        navigate('/');
      }
    };

    startAnalysis();
  }, [inputText, navigate]);

  return (
    <div className="flex-grow pt-32 pb-12 px-6 max-w-7xl mx-auto w-full transition-all duration-1000">
      
      {/* Browser Window Section (Integrated AI Dashboard) */}
      <section className={`transition-all duration-1000 overflow-hidden bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-gray-100 mb-20 ${isAnalyzing ? 'max-w-5xl mx-auto' : 'w-full animate-fade-in-up'}`}>
        {/* Browser Header / Tab Bar */}
        <div className="bg-[#f1f3f4] px-4 pt-3 pb-0 flex items-center gap-2 border-b border-gray-200">
          <div className="flex gap-1.5 px-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          
          <div className="flex flex-1 items-end">
            <div className="bg-white px-6 py-2.5 rounded-t-xl border-t border-x border-gray-200 flex items-center gap-2 min-w-[200px] shadow-[0_-2px_5px_rgba(0,0,0,0.02)] relative z-10">
              <span className="material-symbols-outlined text-[18px] text-primary">
                {platform === 'naver' ? 'shopping_bag' : platform === 'insta' ? 'photo_camera' : 'shopping_cart'}
              </span>
              <span className="text-sm font-bold text-gray-700 truncate">
                {platform === 'naver' ? '네이버 쇼핑' : platform === 'insta' ? 'Instagram' : '쿠팡 쇼핑'} - 분석 중
              </span>
              <span className="material-symbols-outlined text-[14px] text-gray-400 ml-auto">close</span>
            </div>
          </div>
        </div>

        {/* Browser Body / Address Bar */}
        <div className="bg-white px-4 py-2 border-b border-gray-100 flex items-center gap-4">
          <div className="flex gap-4 text-gray-400">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            <span className="material-symbols-outlined text-[20px]">refresh</span>
          </div>
          <div className="flex-grow bg-[#f1f3f4] rounded-full px-4 py-1.5 flex items-center gap-2 text-xs text-gray-500 border border-gray-200/50">
            <span className="material-symbols-outlined text-[14px] text-gray-400">lock</span>
            <span className="truncate">https://{platform}.com/analysis/target_review</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <span className="material-symbols-outlined text-[20px]">more_vert</span>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 transition-all duration-1000">
          {/* Left: Original Platform View */}
          <div className="lg:col-span-7 border-r border-gray-100 relative h-[700px]">
            {result ? (
              <MockPlatformViewer 
                platform={platform} 
                originalText={result.original_text} 
                highlightedPhrases={result.highlighted_phrases}
                onComplete={() => setIsAnalyzing(false)}
              />
            ) : (
              <div className="w-full h-full bg-gray-50 animate-pulse flex items-center justify-center">
                <p className="text-outline text-sm font-bold">페이지 로딩 중...</p>
              </div>
            )}
          </div>

          {/* Right: AI Intelligence Center */}
          <div className="lg:col-span-5 bg-[#fcfdfe] flex flex-col h-[700px] border-l border-gray-100 overflow-hidden">
            {isAnalyzing || !result ? (
              /* Phase 1: Browsing Instruction */
              <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-white">
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 animate-bounce">
                  <span className="material-symbols-outlined text-primary text-3xl">location_searching</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-2">리뷰 데이터 추적 중</h3>
                <p className="text-xs text-outline leading-relaxed max-w-[240px] break-keep">
                  플랫폼의 데이터 엔진에 접속하여 <br/>해당 리뷰의 신뢰 패턴을 수집하고 있습니다.
                </p>
                <div className="mt-8 flex gap-1.5">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1 h-1 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
                  ))}
                </div>
              </div>
            ) : (
              /* Phase 2: Immediate Analysis Result */
              <div className="p-6 sm:p-8 flex-grow overflow-y-auto custom-scrollbar animate-fade-in flex flex-col gap-8">
                {/* 1. Final Result Card */}
                <div className={`rounded-[28px] p-6 sm:p-8 relative overflow-hidden border shadow-xl flex-shrink-0 ${
                  result.trust_score < 40 ? 'bg-tertiary/5 border-tertiary/20 shadow-tertiary/5' : 'bg-primary/5 border-primary/20 shadow-primary/5'
                }`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none scale-150">
                    <span className="material-symbols-outlined text-[100px]">analytics</span>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-2 ${
                        result.trust_score < 40 ? 'bg-tertiary text-white' : 'bg-primary text-white'
                      }`}>
                        <span className="material-symbols-outlined text-[12px]">verified</span>
                        판독 완료: {result.trust_score < 40 ? '의심' : '신뢰'}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-grow min-w-0">
                        <h2 className="text-[26px] sm:text-[30px] font-black leading-tight text-on-surface break-keep">
                          리뷰 X-ray <br/><span className={result.trust_score < 40 ? 'text-tertiary' : 'text-primary'}>최종 판독</span>
                        </h2>
                      </div>

                      <div className="relative flex items-center justify-center flex-shrink-0">
                        <svg className="w-24 h-24 sm:w-28 sm:h-24">
                          <circle className="text-gray-100 stroke-current" cx="48" cy="48" fill="transparent" r="40" strokeWidth="8"></circle>
                          <circle 
                            className={`${result.trust_score < 40 ? 'text-tertiary' : 'text-primary'} stroke-current transition-all duration-1000`} 
                            cx="48" cy="48" fill="transparent" r="40" strokeLinecap="round" strokeWidth="8" 
                            style={{ 
                              strokeDasharray: 251, 
                              strokeDashoffset: `calc(251 - (251 * ${result.trust_score}) / 100)`,
                              transform: 'rotate(-90deg)',
                              transformOrigin: 'center'
                            }}
                          ></circle>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={`text-2xl font-black ${result.trust_score < 40 ? 'text-tertiary' : 'text-primary'}`}>{result.trust_score}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="bg-white/60 backdrop-blur-sm p-3 rounded-2xl border border-white/50 shadow-sm">
                        <p className="text-[9px] text-outline font-bold uppercase mb-0.5">절약 비용</p>
                        <p className="text-sm font-black text-on-surface">{result.saved_cost}</p>
                      </div>
                      <div className="bg-white/60 backdrop-blur-sm p-3 rounded-2xl border border-white/50 shadow-sm">
                        <p className="text-[9px] text-outline font-bold uppercase mb-0.5">절약 시간</p>
                        <p className="text-sm font-black text-on-surface">{result.saved_time}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Insights List */}
                <div className="space-y-8 pb-4">
                  {/* AI Summary */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
                      <h3 className="font-bold text-[16px] text-on-surface">AI 팩트 체크 요약</h3>
                    </div>
                    <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10 relative">
                      <div className="leading-relaxed text-[14px] text-on-surface-variant font-medium break-keep">
                        {result.real_summary}
                      </div>
                    </div>
                  </div>

                  {/* Detection Points */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <span className="material-symbols-outlined text-secondary text-[18px]">radar</span>
                      <h3 className="font-bold text-[16px] text-on-surface">주요 탐지 포인트</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-2.5">
                      {result.highlighted_phrases.map((phrase, idx) => (
                        <div key={idx} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex gap-3 group">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0"></div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-on-surface mb-0.5 leading-snug truncate">"{phrase.text}"</p>
                            <p className="text-[11px] text-on-surface-variant leading-relaxed opacity-80 break-keep">{phrase.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hidden Negatives */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <span className="material-symbols-outlined text-tertiary text-[18px]">warning</span>
                      <h3 className="font-bold text-[16px] text-on-surface">복원된 숨은 단점</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-2.5">
                      {result.hidden_negatives.map((neg, idx) => (
                        <div key={idx} className="bg-tertiary/5 rounded-xl p-4 border border-tertiary/10">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-[13px] font-bold text-on-surface truncate pr-2">{neg.inferred}</h4>
                            <span className="text-[9px] font-bold text-tertiary bg-white px-2 py-0.5 rounded-full border border-tertiary/20 flex-shrink-0">신뢰도 {neg.confidence}%</span>
                          </div>
                          <p className="text-[11px] text-on-surface-variant leading-relaxed opacity-90 break-keep">{neg.reasoning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Footer (Integrated) */}
            <div className="p-5 bg-white border-t border-gray-100 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] font-bold text-outline truncate">
                  {isAnalyzing ? '데이터 패턴 매칭 중' : '실시간 2,410명 이용 중'}
                </span>
              </div>
              <button 
                onClick={() => navigate('/')}
                disabled={isAnalyzing}
                className={`px-6 py-2.5 rounded-xl font-bold text-[12px] transition-all flex items-center gap-2 shadow-lg active:scale-95 ${
                  isAnalyzing 
                  ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
                  : 'bg-primary text-white hover:bg-emerald-700 shadow-primary/10'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isAnalyzing ? 'hourglass_top' : 'search'}
                </span>
                다른 분석
              </button>
            </div>
          </div>
        </div>
      </section>

      {!isAnalyzing && (
        <section className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 animate-fade-in-up">
          <p className="text-sm text-outline font-medium">분석 결과에 만족하시나요? 주변에 공유하여 진실을 알려보세요.</p>
        </section>
      )}
    </div>
  );
};

export default Result;
