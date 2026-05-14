import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { FaHistory } from 'react-icons/fa';
import { apiService } from '../services/api';
import type { AnalysisResponse } from '../types/analysis';

import MockPlatformViewer from '../components/MockPlatformViewer';
import LoadingScreen from '../components/result/LoadingScreen';
import ResultHeader from '../components/result/ResultHeader';
import FactSummary from '../components/result/FactSummary';
import DetailedAnalysis from '../components/result/DetailedAnalysis';

const PHRASE_META: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  exaggeration:       { label: '과장 표현',  color: '#ff7f50', bg: '#fff5f2', icon: 'priority_high' },
  sponsor_denial:     { label: '광고 부인',  color: '#fb923c', bg: '#fff7ed', icon: 'block' },
  negative_avoidance: { label: '단점 회피',  color: '#3b82f6', bg: '#D6EAFF', icon: 'visibility_off' },
  ad_pattern:         { label: '광고 패턴',  color: '#8b5cf6', bg: '#E8D6FF', icon: 'campaign' },
  neutral:            { label: '중립',       color: '#64748b', bg: '#f8fafc', icon: 'remove' },
};

let lastRequestTag = '';
let lastRequestTime = 0;

const Result: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState('데이터 분석 준비 중...');
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  
  const analysisStarted = useRef(false);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const state = location.state as { text?: string; platform?: string } | null;
    const text = state?.text || searchParams.get('text');
    const platform = state?.platform || searchParams.get('platform') || 'naver';
    const id = searchParams.get('id');

    if (id) { loadHistory(id); return; }
    if (!text) { navigate('/'); return; }

    const requestTag = `${platform}:${text.substring(0, 20)}`;
    const now = Date.now();
    if (requestTag === lastRequestTag && now - lastRequestTime < 3000) return;
    if (analysisStarted.current) return;
    
    analysisStarted.current = true;
    lastRequestTag = requestTag;
    lastRequestTime = now;
    performAnalysis(text, platform);
  }, [searchParams, navigate, location.state]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollPosition = container.scrollTop;
    const slideHeight = container.clientHeight;
    const currentSlide = Math.round(scrollPosition / slideHeight);
    if (activeSlide !== currentSlide && currentSlide >= 0 && currentSlide < 3) {
      setActiveSlide(currentSlide);
    }
  };

  const loadHistory = async (id: string) => {
    try {
      setLoading(true);
      const data = await apiService.getById(parseInt(id));
      setAnalysisResult(data);
      setAnalysisComplete(true);
    } catch (error) { navigate('/'); } finally { setLoading(false); }
  };

  const performAnalysis = async (text: string, platform: string) => {
    try {
      setLoading(true);
      setAnalysisProgress(10);
      const steps = ['보안 검사 중...', '문맥 엔진 가동...', '패턴 스캔 중...', '의도 추론 중...', '데이터 구조화...'];
      const stepInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) { clearInterval(stepInterval); return 90; }
          setAnalysisStep(steps[Math.min(Math.floor(prev / 20), steps.length - 1)]);
          return prev + 2;
        });
      }, 120);

      const result = await apiService.analyze(text, platform);
      clearInterval(stepInterval);
      setAnalysisProgress(100);
      setAnalysisResult(result);
      setTimeout(() => { setAnalysisComplete(true); setLoading(false); }, 500);
    } catch (error) { navigate('/'); }
  };

  const toggleFilter = (type: string) => {
    setActiveFilters(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  if (loading && !analysisComplete) {
    return <LoadingScreen progress={analysisProgress} step={analysisStep} />;
  }

  if (!analysisResult) return null;

  const groupedPhrases = (analysisResult.highlighted_phrases || []).reduce((acc, phrase) => {
    const key = phrase.type || 'neutral';
    if (!acc[key]) acc[key] = [];
    acc[key].push(phrase);
    return acc;
  }, {} as Record<string, typeof analysisResult.highlighted_phrases>);

  const SLIDE_COUNT = 3;

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-16 relative">
      <div className="flex flex-col lg:flex-row w-full lg:h-[calc(100vh-4rem)] max-w-[1240px] mx-auto relative px-3 md:px-4 lg:px-0">
        {/* Left Pane: Original Review Viewer (Fixed) */}
        <div className="w-full lg:w-1/2 h-[420px] md:h-[560px] lg:h-full p-3 md:p-4 lg:p-8 flex flex-col relative z-10 bg-white/40 backdrop-blur-xl rounded-2xl lg:rounded-l-3xl lg:rounded-r-none mt-3 lg:mt-0">

        
        {/* Viewer */}
        <div className="flex-grow bg-white rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(0,147,104,0.08)] border border-[#009368]/10">
          <MockPlatformViewer
            platform={analysisResult.platform || 'naver'}
            originalText={analysisResult.original_content || ''}
            highlightedPhrases={analysisResult.highlighted_phrases || []}
            activeFilters={activeFilters}
            onComplete={() => {}}
          />
        </div>
      </div>

      {/* Right Pane: Slides (Scrollable) */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        id="right-scroll-container" 
        className="w-full lg:w-1/2 lg:h-full overflow-visible lg:overflow-y-auto snap-none lg:snap-y lg:snap-mandatory scroll-smooth relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {/* Background decorations */}
      <div className="fixed inset-0 bg-[#f8f9fa] -z-20" />
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="fixed bottom-[-10%] right-[10%] w-[700px] h-[700px] bg-blue-200/20 rounded-full blur-[120px] -z-10 pulse-slow" />
      <div className="fixed top-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-200/10 rounded-full blur-[100px] -z-10 animate-float" />

        {/* Slide 0: Header / Trust Score */}
        <div 
          ref={(el) => { slidesRef.current[0] = el; }} 
          data-index={0}
          className="min-h-0 lg:min-h-screen lg:snap-center flex flex-col justify-start lg:justify-center p-3 md:p-4 lg:p-12 pb-6 lg:pb-24"
        >
          <ResultHeader analysisResult={analysisResult} />
          
          <div className="mt-4 lg:mt-8 bg-white/60 backdrop-blur-md rounded-2xl lg:rounded-[24px] p-4 md:p-5 lg:p-8 border border-[#009368]/10 shadow-[0_8px_30px_rgba(0,147,104,0.08)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-on-surface rounded-[24px] flex items-center justify-center text-white shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
                <span className="material-symbols-outlined text-[18px]">find_in_page</span>
              </div>
              <div>
                <h3 className="text-[17px] font-extrabold text-on-surface tracking-tight">원문 필터링</h3>
                <p className="text-[12px] text-gray-500 font-medium mt-0.5">좌측 원문 뷰어의 의심 표현을 클릭해 필터링해보세요</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(PHRASE_META).filter(([k]) => k !== 'neutral').map(([type, meta]) => {
                const count = groupedPhrases[type]?.length || 0;
                if (count === 0) return null;
                const isActive = activeFilters.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleFilter(type)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[24px] border text-[12px] font-bold transition-all duration-200 ${isActive ? 'ring-2 ring-offset-1' : 'opacity-60 hover:opacity-100'} shadow-[0_4px_15px_rgba(0,0,0,0.03)]`}
                    style={{
                      backgroundColor: meta.bg,
                      color: meta.color,
                      borderColor: isActive ? meta.color : meta.bg,
                      // @ts-ignore
                      ringColor: meta.color,
                    }}
                  >
                    <span className="material-symbols-outlined text-[13px]">{meta.icon}</span>
                    {meta.label}
                    <span className="ml-0.5 opacity-50">{count}</span>
                  </button>
                );
              })}
              {activeFilters.length > 0 && (
                <button
                  onClick={() => setActiveFilters([])}
                  className="text-[11px] font-bold text-gray-400 hover:text-gray-600 px-2 transition-colors"
                >
                  초기화
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Slide 1: Fact Summary & AI Verdict */}
        <div 
          ref={(el) => { slidesRef.current[1] = el; }} 
          data-index={1}
          className="min-h-0 lg:min-h-screen lg:snap-center flex flex-col justify-start lg:justify-center p-3 md:p-4 lg:p-12 pb-6 lg:pb-24"
        >
          <FactSummary analysisResult={analysisResult} />
        </div>

        {/* Slide 2: Detailed Analysis */}
        <div 
          ref={(el) => { slidesRef.current[2] = el; }} 
          data-index={2}
          className="min-h-0 lg:min-h-screen lg:snap-center flex flex-col justify-start lg:justify-center p-3 md:p-4 lg:p-12 pb-10 lg:pb-24"
        >
          <DetailedAnalysis analysisResult={analysisResult} />
          
          <div className="mt-12 flex flex-col items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-[#009368] text-white font-extrabold text-[15px] rounded-[24px] hover:bg-[#007b56] transition-all active:scale-95 shadow-[0_8px_20px_rgba(0,147,104,0.25)]"
            >
              다른 리뷰 분석하기
            </button>
            <div className="flex items-center gap-2 text-gray-400 font-medium text-[12px]">
              <FaHistory size={11} />
              {analysisResult.created_at ? new Date(analysisResult.created_at).toLocaleString() : '방금 전 분석됨'}
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="hidden lg:flex fixed right-6 top-1/2 transform -translate-y-1/2 flex-col gap-4 z-50">
        {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
          <div 
            key={i} 
            onClick={() => slidesRef.current[i]?.scrollIntoView({ behavior: 'smooth' })}
            className={`rounded-full transition-all duration-300 cursor-pointer border border-[#009368]/20 ${
              activeSlide === i 
                ? 'w-4 h-4 bg-[#009368] shadow-[0_0_15px_rgba(0,147,104,0.5)]' 
                : 'w-3 h-3 bg-[#009368]/20 hover:bg-[#009368]/40'
            }`}
          />
        ))}
      </div>
    </div>
    </div>
  );
};

export default Result;
