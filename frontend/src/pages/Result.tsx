import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { FaHistory } from 'react-icons/fa';
import { apiService } from '../services/api';
import type { AnalysisResponse } from '../types/analysis';
import LoadingScreen from '../components/result/LoadingScreen';
import ResultHeader from '../components/result/ResultHeader';
import PhraseViewer from '../components/result/PhraseViewer';
import HiddenNegatives from '../components/result/HiddenNegatives';
import RadarPanel from '../components/result/RadarPanel';

let lastRequestTag = '';
let lastRequestTime = 0;

const getRank = (score: number) => {
  if (score >= 93) return { grade: 'S', color: '#10b981', bg: '#ecfdf5', borderColor: '#a7f3d0', label: '매우 신뢰', sub: '믿을 수 있는 솔직한 후기예요.' };
  if (score >= 85) return { grade: 'A', color: '#22c55e', bg: '#f0fdf4', borderColor: '#bbf7d0', label: '신뢰 가능', sub: '대체로 믿을 수 있는 내용이에요.' };
  if (score >= 70) return { grade: 'B', color: '#f59e0b', bg: '#fffbeb', borderColor: '#fde68a', label: '주의 필요', sub: '홍보성 내용이 일부 섞여 있을 수 있어요.' };
  return { grade: 'C', color: '#ef4444', bg: '#fef2f2', borderColor: '#fecaca', label: '광고 의심', sub: '광고 표현이 많이 발견된 리뷰예요.' };
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
  const [showDetails, setShowDetails] = useState(false);

  const analysisStarted = useRef(false);

  useEffect(() => {
    const state = location.state as { text?: string; platform?: string } | null;
    const text = state?.text || searchParams.get('text');
    const platform = state?.platform || searchParams.get('platform') || 'naver';
    const id = searchParams.get('id');

    if (id) {
      loadHistory(id);
      return;
    }
    if (!text) {
      navigate('/');
      return;
    }

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
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          setStep(steps[Math.min(Math.floor(prev / 20), steps.length - 1)]);
          return prev + 2;
        });
      }, 120);

      const result = await apiService.analyze(text, platform);
      clearInterval(interval);
      setProgress(100);
      setAnalysisResult(result);
      setTimeout(() => {
        setAnalysisComplete(true);
        setLoading(false);
      }, 500);
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
  const savedTimeText = analysisResult.saved_time && analysisResult.saved_time.trim() ? analysisResult.saved_time : '10분';
  const savedCostText = analysisResult.saved_cost && analysisResult.saved_cost.trim() ? analysisResult.saved_cost : '';
  const hasMeaningfulCost = Number(savedCostText.replace(/[^\d]/g, '')) > 0;
  const hasHighlightedPhrases = (analysisResult.highlighted_phrases?.length || 0) > 0;

  return (
    <div className="w-full bg-slate-50 pt-24 md:pt-28 px-4 md:px-6 pb-0">
      <div className="max-w-[760px] mx-auto flex flex-col gap-5 pb-12">
        <ResultHeader result={analysisResult} trustRank={trustRank} />

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5">
          <p className="text-[13px] text-slate-600 leading-relaxed break-keep">
            이번 분석으로 <span className="font-bold text-slate-900">{savedTimeText}</span> 정도 아꼈어요! :)
            {hasMeaningfulCost && <> 불필요한 지출도 <span className="font-bold text-emerald-600">{savedCostText}</span>쯤 줄일 수 있어요.</>}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5">
          <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-3">핵심 요약</p>
          {analysisResult.real_summary && (
            <blockquote className="text-[16px] font-extrabold text-slate-900 leading-relaxed break-keep">
              "{analysisResult.real_summary}"
            </blockquote>
          )}
          {analysisResult.overall_verdict && (
            <p className="text-[13px] text-slate-500 mt-3 leading-relaxed break-keep line-clamp-3">
              {analysisResult.overall_verdict}
            </p>
          )}
        </div>

        {hasHighlightedPhrases ? (
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">원문에서 발견된 표현들</p>
            <PhraseViewer
              result={analysisResult}
              activeFilters={activeFilters}
              onToggleFilter={(type) => setActiveFilters((prev) =>
                prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
              )}
              onClearFilters={() => setActiveFilters([])}
            />
          </div>
        ) : (
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">리뷰 성향 분석</p>
            <RadarPanel result={analysisResult} radarData={radarData} />
          </div>
        )}

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="w-full bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center justify-between text-left shadow-sm"
          >
            <span className="text-[14px] font-bold text-slate-800">상세 분석 보기</span>
            <span className="material-symbols-outlined text-slate-400">{showDetails ? 'expand_less' : 'expand_more'}</span>
          </button>
          <p className="text-[12px] text-slate-400 px-1">
            숨겨진 단점 {analysisResult.hidden_negatives?.length || 0}건 · 광고 표현 {analysisResult.highlighted_phrases?.length || 0}개
          </p>

          {showDetails && (
            <div className="space-y-5 animate-fade-in-up">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <HiddenNegatives negatives={analysisResult.hidden_negatives} />
                {!hasHighlightedPhrases ? (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center justify-center text-slate-400 text-[13px]">
                    핵심 성향 그래프는 상단에서 바로 확인할 수 있어요 :)
                  </div>
                ) : (
                  <RadarPanel result={analysisResult} radarData={radarData} />
                )}
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: '플랫폼', value: analysisResult.platform || '-' },
                    { label: '광고 표현 수', value: `${analysisResult.highlighted_phrases?.length || 0}개` },
                    { label: '숨겨진 단점 수', value: `${analysisResult.hidden_negatives?.length || 0}건` },
                    { label: '분석 시각', value: timeLabel },
                  ].map((item) => (
                    <div key={item.label} className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3">
                      <p className="text-[11px] text-slate-400 font-semibold mb-1">{item.label}</p>
                      <p className="text-[14px] font-bold text-slate-800 break-keep">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 pb-16 flex items-center justify-between flex-wrap gap-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-300 font-medium text-[12px]">
            <FaHistory size={11} />
            {timeLabel}
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-slate-900 text-white font-bold text-[14px] rounded-xl hover:bg-slate-700 transition-all active:scale-95"
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
  const isUserError = ['너무 짧아요', 'URL이 아닌', '오타인 것', '반복된 내용', '한국어', '리뷰 본문만'].some((h) => message.includes(h));

  return (
    <div className="flex-1 flex items-center justify-center bg-white px-6 pt-20 pb-16">
      <div className="w-full max-w-sm flex flex-col items-center text-center gap-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isUserError ? 'bg-amber-50' : 'bg-red-50'}`}>
          <span className={`material-symbols-outlined text-[26px] ${isUserError ? 'text-amber-500' : 'text-red-400'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
            {isUserError ? 'info' : 'error'}
          </span>
        </div>
        <div>
          <h2 className="text-[20px] font-extrabold text-slate-900 mb-2 tracking-tight">
            {isUserError ? '입력 내용을 확인해 주세요' : '분석에 실패했어요'}
          </h2>
          <p className="text-[14px] text-slate-400 leading-relaxed break-keep">{message}</p>
        </div>
        <div className="flex gap-3 w-full">
          <button onClick={onBack} className="flex-1 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-[14px] hover:bg-slate-50 transition-colors">
            돌아가기
          </button>
          {!isUserError && (
            <button onClick={onRetry} className="flex-1 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-[14px] hover:bg-slate-700 transition-colors">
              다시 시도
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
