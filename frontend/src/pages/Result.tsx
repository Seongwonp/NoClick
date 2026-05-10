import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { AnalysisResponse } from '../types/analysis';
import { apiService } from '../services/api';
import MockPlatformViewer from '../components/MockPlatformViewer';

const Result: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const idFromUrl = queryParams.get('id');
  const idFromState = location.state?.id;
  const resultFromState = location.state?.result as AnalysisResponse;
  const analysisId = idFromUrl || idFromState;
  
  const [result, setResult] = useState<AnalysisResponse | null>(resultFromState || null);
  const [isAnalyzing, setIsAnalyzing] = useState(!resultFromState);
  const hasLoaded = React.useRef(false);

  const platform = result?.platform || location.state?.platform || 'other';
  const inputText = result?.original_content || location.state?.text || '';

  // 플랫폼별 테마 색상 설정
  const getThemeConfig = () => {
    switch(platform) {
      case 'naver':
        return { 
          bg: 'bg-[#059669]', // emerald-600
          text: 'text-[#059669]', 
          border: 'border-[#059669]/20', 
          hover: 'hover:bg-[#047857]', // emerald-700
          light: 'bg-[#059669]/5',
          btnBg: 'bg-[#059669]',
          btnHover: 'hover:bg-[#047857]',
          badgeBg: 'bg-[#059669]'
        };
      case 'coupang':
        return { 
          bg: 'bg-[#0076f5]', 
          text: 'text-[#0076f5]', 
          border: 'border-[#0076f5]/20', 
          hover: 'hover:bg-[#0066dc]',
          light: 'bg-[#0076f5]/5',
          btnBg: 'bg-[#cb1400]', // 쿠팡 요청: 빨간색
          btnHover: 'hover:bg-[#b01200]',
          badgeBg: 'bg-[#cb1400]' // 쿠팡 요청: 빨간색
        };
      case 'insta':
        return { 
          bg: 'bg-[#262626]', 
          text: 'text-[#262626]', 
          border: 'border-[#262626]/20', 
          hover: 'hover:bg-[#000000]',
          light: 'bg-[#262626]/5',
          btnBg: 'bg-[#262626]',
          btnHover: 'hover:bg-[#000000]',
          badgeBg: 'bg-[#262626]'
        };
      default: // other
        return { 
          bg: 'bg-[#333333]', 
          text: 'text-[#333333]', 
          border: 'border-[#333333]/20', 
          hover: 'hover:bg-[#111111]',
          light: 'bg-[#333333]/5',
          btnBg: 'bg-[#333333]',
          btnHover: 'hover:bg-[#111111]',
          badgeBg: 'bg-[#333333]'
        };
    }
  };

  const theme = getThemeConfig();

  // 애니메이션 완료 콜백 (useCallback으로 최적화)
  const handleAnalysisComplete = React.useCallback(() => {
    setIsAnalyzing(false);
  }, []);

  // 초기 데이터 로딩 처리
  useEffect(() => {
    const loadData = async () => {
      try {
        if (hasLoaded.current) return;
        
        // 이미 결과 데이터가 전달된 경우 (Analysis -> Result 이동 시)
        if (resultFromState) {
          hasLoaded.current = true;
          setResult(resultFromState);
          setIsAnalyzing(false);
          return;
        }

        if (analysisId) {
          // ID가 있으면 기존 결과 조회 (중복 생성 안됨)
          hasLoaded.current = true;
          const data = await apiService.getById(Number(analysisId));
          setResult(data);
          setIsAnalyzing(false);
        } else if (inputText && !idFromUrl && !idFromState) {
          // ID가 아예 없고 텍스트만 처음 들어온 경우에만 분석 실행
          hasLoaded.current = true;
          const data = await apiService.analyze(inputText, platform);
          setResult(data);
          setIsAnalyzing(false);
        } else {
          // ID도 없고 텍스트도 없으면 홈으로
          navigate('/');
        }
      } catch (error) {
        console.error('Data loading failed:', error);
        alert('데이터를 불러오는 중 오류가 발생했습니다: ' + (error instanceof Error ? error.message : String(error)));
        navigate('/');
      }
    };

    loadData();
  }, [analysisId, inputText, platform, navigate, resultFromState, idFromUrl, idFromState]);

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
              <span className={`material-symbols-outlined text-[18px] ${theme.text}`}>
                {platform === 'naver' ? 'shopping_bag' : platform === 'insta' ? 'photo_camera' : platform === 'coupang' ? 'shopping_cart' : 'article'}
              </span>
              <span className="text-sm font-bold text-gray-700 truncate">
                {platform === 'naver' ? '네이버 쇼핑' : platform === 'insta' ? 'Instagram' : platform === 'coupang' ? '쿠팡 쇼핑' : '일반 리뷰'} - {result ? result.blog_title : '분석 중'}
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
            <span className="truncate">https://{platform}.com/analysis/{result ? encodeURIComponent(result.blog_title) : 'target_review'}</span>
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
                originalText={result.original_content} 
                highlightedPhrases={result.highlighted_phrases}
                onComplete={handleAnalysisComplete}
                trustScore={result.trust_score}
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
                <div className={`w-16 h-16 ${theme.light} rounded-2xl flex items-center justify-center mb-6 animate-bounce`}>
                  <span className={`material-symbols-outlined ${theme.text} text-3xl`}>location_searching</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-2">리뷰 데이터 추적 중</h3>
                <p className="text-xs text-outline leading-relaxed max-w-[240px] break-keep">
                  플랫폼의 데이터 엔진에 접속하여 <br/>해당 리뷰의 신뢰 패턴을 수집하고 있습니다.
                </p>
                <div className="mt-8 flex gap-1.5">
                  {[0, 1, 2].map(i => (
                    <div key={i} className={`w-1 h-1 rounded-full ${theme.bg} opacity-40 animate-pulse`} style={{ animationDelay: `${i * 200}ms` }}></div>
                  ))}
                </div>
              </div>
            ) : (
              /* Phase 2: Immediate Analysis Result */
              <div className="p-6 sm:p-8 flex-grow overflow-y-auto custom-scrollbar animate-fade-in flex flex-col gap-8">
                {/* 1. Final Result Card */}
                <div className={`rounded-[28px] p-6 sm:p-8 relative overflow-hidden border shadow-xl flex-shrink-0 ${
                  result.trust_score < 40 ? 'bg-tertiary/5 border-tertiary/20 shadow-tertiary/5' : `${theme.light} ${theme.border} shadow-black/5`
                }`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none scale-150">
                    <span className="material-symbols-outlined text-[100px]">analytics</span>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-2 ${
                        result.trust_score < 40 ? 'bg-tertiary text-white' : `${theme.badgeBg} text-white`
                      }`}>
                        <span className="material-symbols-outlined text-[12px]">verified</span>
                        판독 완료: {result.trust_score < 40 ? '의심' : '신뢰'}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-grow min-w-0">
                        <h2 className="text-[26px] sm:text-[30px] font-black leading-tight text-on-surface break-keep">
                          리뷰 X-ray <br/><span className={result.trust_score < 40 ? 'text-tertiary' : theme.text}>최종 판독</span>
                        </h2>
                      </div>

                      <div className="relative flex items-center justify-center flex-shrink-0">
                        <svg className="w-24 h-24 sm:w-28 sm:h-24">
                          <circle className="text-gray-100 stroke-current" cx="48" cy="48" fill="transparent" r="40" strokeWidth="8"></circle>
                          <circle 
                            className={`${result.trust_score < 40 ? 'text-tertiary' : theme.text} stroke-current transition-all duration-1000`} 
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
                          <span className={`text-2xl font-black ${result.trust_score < 40 ? 'text-tertiary' : theme.text}`}>{result.trust_score}%</span>
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
                      <span className={`material-symbols-outlined ${theme.text} text-[18px]`}>auto_awesome</span>
                      <h3 className="font-bold text-[16px] text-on-surface">AI 팩트 체크 요약</h3>
                    </div>
                    <div className={`${theme.light} rounded-2xl p-5 border ${theme.border} relative`}>
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
                  : `${theme.btnBg} text-white ${theme.btnHover} shadow-black/5`
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
