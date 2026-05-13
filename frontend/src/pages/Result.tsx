import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { FaHistory } from 'react-icons/fa';
import { apiService } from '../services/api';
import type { AnalysisResponse } from '../types/analysis';
import LoadingScreen from '../components/result/LoadingScreen';
import ResultHeader from '../components/result/ResultHeader';
import PhraseViewer from '../components/result/PhraseViewer';
import SummaryCards from '../components/result/SummaryCards';
import HiddenNegatives from '../components/result/HiddenNegatives';
import RadarPanel from '../components/result/RadarPanel';
import AdBreakdown from '../components/result/AdBreakdown';

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
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState('리뷰 내용 확인 중...');
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
    } catch (e) {
      setError((e as Error).message || '분석 결과를 불러오지 못했어요.');
    } finally {
      setLoading(false);
    }
  };

  const performAnalysis = async (text: string, platform: string) => {
    try {
      setLoading(true);
      setError(null);
      setProgress(10);
      const steps = ['리뷰 내용 확인 중...', '광고 표현 찾는 중...', '숨겨진 단점 파악 중...', '작성 의도 분석 중...', '결과 정리 중...'];
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) { clearInterval(interval); return 90; }
          setStep(steps[Math.min(Math.floor(prev / 20), steps.length - 1)]);
          return prev + 2;
        });
      }, 120);

      const result = await apiService.analyze(text, platform);
      clearInterval(interval);
      setProgress(100);
      setAnalysisResult(result);
      setTimeout(() => { setAnalysisComplete(true); setLoading(false); }, 500);
    } catch (e) {
      setLoading(false);
      setError((e as Error).message || '분석 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.');
    }
  };

  if (loading && !analysisComplete) {
    return <LoadingScreen progress={progress} step={step} />;
  }

  if (error) {
    return (
      <ErrorScreen
        message={error}
        onBack={() => navigate(-1)}
        onRetry={() => {
          analysisStarted.current = false;
          setError(null);
          setLoading(true);
          const state = location.state as { text?: string; platform?: string } | null;
          const text = state?.text || searchParams.get('text');
          const platform = state?.platform || searchParams.get('platform') || 'naver';
          if (text) performAnalysis(text, platform);
        }}
      />
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
    <div className="w-full bg-slate-50 pt-24 md:pt-28 px-4 md:px-6 pb-0">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-5 md:gap-6 pb-8">

        {/* 1. 헤더 + 신뢰도 게이지 */}
        <ResultHeader result={analysisResult} trustRank={trustRank} />

        {/* 2. 원문 하이라이트 */}
        <PhraseViewer
          result={analysisResult}
          activeFilters={activeFilters}
          onToggleFilter={(type) => setActiveFilters(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
          )}
          onClearFilters={() => setActiveFilters([])}
        />

        {/* 3. 광고 패턴 분석 */}
        <AdBreakdown phrases={analysisResult.highlighted_phrases} adProbability={analysisResult.ad_probability} />

        {/* 4. 한 줄 요약 + 종합 의견 */}
        <SummaryCards result={analysisResult} />

        {/* 5. 숨겨진 단점 + 레이더 차트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          <HiddenNegatives negatives={analysisResult.hidden_negatives} />
          <RadarPanel result={analysisResult} radarData={radarData} />
        </div>

        {/* 6. 푸터 */}
        <div className="border-t border-slate-200 pt-6 pb-16 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 text-slate-400 font-medium text-[13px]">
            <FaHistory size={12} />
            {timeLabel}
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-7 py-3.5 bg-emerald-600 text-white font-extrabold text-[15px] rounded-xl hover:bg-emerald-700 transition-all active:scale-95 shadow-sm"
          >
            다른 리뷰 분석하기
          </button>
        </div>

      </div>
    </div>
  );
};

interface ErrorScreenProps {
  message: string;
  onBack: () => void;
  onRetry: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onBack, onRetry }) => {
  const isUserError = ['너무 짧아요', 'URL이 아닌', '오타인 것', '반복된 내용', '한국어', '리뷰 본문만'].some(h => message.includes(h));

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 px-6 py-16">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col items-center text-center gap-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${isUserError ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100'}`}>
          <span className={`material-symbols-outlined text-[26px] ${isUserError ? 'text-amber-500' : 'text-red-500'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
            {isUserError ? 'info' : 'error'}
          </span>
        </div>
        <div>
          <h2 className="text-[17px] font-extrabold text-slate-900 mb-2">
            {isUserError ? '입력 내용을 확인해 주세요' : '분석에 실패했어요'}
          </h2>
          <p className="text-[13px] text-slate-500 leading-relaxed break-keep">{message}</p>
        </div>
        <div className="flex gap-3 w-full">
          <button onClick={onBack} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-[14px] hover:bg-slate-50 transition-colors">
            돌아가기
          </button>
          {!isUserError && (
            <button onClick={onRetry} className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-[14px] hover:bg-emerald-700 transition-colors">
              다시 시도
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
