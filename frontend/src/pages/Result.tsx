import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { FaHistory } from 'react-icons/fa';
import { apiService } from '../services/api';
import type { AnalysisResponse } from '../types/analysis';
import ResultHeader from '../components/result/ResultHeader';
import PhraseViewer from '../components/result/PhraseViewer';
import SummaryCards from '../components/result/SummaryCards';
import HiddenNegatives from '../components/result/HiddenNegatives';
import RadarPanel from '../components/result/RadarPanel';

let lastRequestTag = '';
let lastRequestTime = 0;

const getRank = (score: number) => {
  if (score >= 93) return { grade: 'S', color: '#10b981', bg: '#ecfdf5', borderColor: '#a7f3d0', label: '매우 신뢰', sub: '믿을 수 있는 솔직한 후기예요.' };
  if (score >= 85) return { grade: 'A', color: '#3b82f6', bg: '#eff6ff', borderColor: '#bfdbfe', label: '신뢰 가능', sub: '대체로 믿을 수 있는 내용이에요.' };
  if (score >= 70) return { grade: 'B', color: '#f59e0b', bg: '#fffbeb', borderColor: '#fde68a', label: '주의 필요', sub: '홍보성 내용이 일부 섞여 있을 수 있어요.' };
  return { grade: 'C', color: '#ef4444', bg: '#fff1f2', borderColor: '#fecdd3', label: '광고 의심', sub: '광고 표현이 많이 발견된 리뷰예요.' };
};

const Result: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState('리뷰 내용 확인 중...');
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const analysisStarted = useRef(false);

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

  const loadHistory = async (id: string) => {
    try {
      setLoading(true);
      const data = await apiService.getById(parseInt(id));
      setAnalysisResult(data);
      setAnalysisComplete(true);
    } catch { navigate('/'); } finally { setLoading(false); }
  };

  const performAnalysis = async (text: string, platform: string) => {
    try {
      setLoading(true);
      setAnalysisProgress(10);
      const steps = ['리뷰 내용 확인 중...', '광고 표현 찾는 중...', '숨겨진 단점 파악 중...', '작성 의도 분석 중...', '결과 정리 중...'];
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
    } catch { navigate('/'); }
  };

  // ─── 로딩 화면 ─────────────────────────────────────────────────────────────
  if (loading && !analysisComplete) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f8f9fa] px-6 py-16">
        <div className="w-full max-w-md bg-white rounded-[2rem] p-10 custom-shadow border border-emerald-50 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-40 pointer-events-none" />

          <div className="relative z-10 mb-8 w-full">
            <div className="w-16 h-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 border border-emerald-100">
              <span className="material-symbols-outlined text-emerald-600 text-[28px] animate-bounce-slow">search_check</span>
            </div>
            <h2 className="text-[22px] font-extrabold text-on-surface tracking-tight mb-2">리뷰 분석 중이에요</h2>
            <div className="min-h-6">
              <p className="text-[14px] text-emerald-600 font-semibold animate-pulse">{analysisStep}</p>
            </div>
          </div>

          <div className="w-full space-y-3 relative z-10">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
            <div className="flex justify-between items-center px-0.5">
              <span className="text-[12px] text-gray-400">광고 여부를 꼼꼼히 살펴보고 있어요</span>
              <span className="text-[14px] font-extrabold text-emerald-600">{analysisProgress}%</span>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-gray-50 w-full text-[12px] text-gray-400">
            평균 10~20초 정도 걸려요
          </div>
        </div>
      </div>
    );
  }

  if (!analysisResult) return null;

  const trustRank = getRank(analysisResult.trust_score);
  const ds = analysisResult.dimension_scores;
  const radarData = [
    { subject: '진정성', A: ds?.authenticity ?? 50 },
    { subject: '정보성', A: ds?.information ?? 50 },
    { subject: '상세함', A: ds?.specificity ?? 50 },
    { subject: '광고패턴', A: analysisResult.ad_probability },
    { subject: '과장성', A: ds?.exaggeration ?? 50 },
  ];

  const timeLabel = analysisResult.created_at
    ? new Date(analysisResult.created_at).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '방금 분석';

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8 md:py-10 px-4 md:px-8 relative overflow-hidden">
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-100/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-100/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">

        {/* Section 1: 헤더 & 신뢰 등급 */}
        <ResultHeader result={analysisResult} trustRank={trustRank} />

        {/* Section 2: 원문 직접 분석 */}
        <PhraseViewer
          result={analysisResult}
          activeFilters={activeFilters}
          onToggleFilter={(type) => setActiveFilters(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])}
          onClearFilters={() => setActiveFilters([])}
        />

        {/* Section 3: 한 줄 요약 & 종합 의견 */}
        <SummaryCards result={analysisResult} />

        {/* Section 4: 숨겨진 단점 & 레이더 차트 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <HiddenNegatives negatives={analysisResult.hidden_negatives} />
          <RadarPanel result={analysisResult} radarData={radarData} />
        </div>

        {/* Section 5: 푸터 액션 */}
        <div className="pt-6 md:pt-8 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-16 md:pb-20">
          <div className="flex items-center gap-3 text-gray-400 font-medium text-[13px]">
            <FaHistory size={12} />
            {timeLabel}
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white font-extrabold text-[15px] rounded-2xl hover:bg-emerald-700 transition-all active:scale-95 custom-shadow"
          >
            다른 리뷰 분석하기
          </button>
        </div>

      </div>
    </div>
  );
};

export default Result;
