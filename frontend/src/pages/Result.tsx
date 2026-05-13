import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { FaHistory } from 'react-icons/fa';
import { apiService } from '../services/api';
import type { AnalysisResponse, HighlightedPhrase } from '../types/analysis';
import LoadingScreen from '../components/result/LoadingScreen';
import ResultHeader from '../components/result/ResultHeader';
import PhraseViewer from '../components/result/PhraseViewer';
import HiddenNegatives from '../components/result/HiddenNegatives';

let lastRequestTag = '';
let lastRequestTime = 0;

const getRank = (score: number) => {
  if (score >= 93) return { grade: 'S', color: '#10b981', bg: '#ecfdf5', borderColor: '#a7f3d0', label: '매우 신뢰', sub: '믿을 수 있는 솔직한 후기예요.' };
  if (score >= 85) return { grade: 'A', color: '#22c55e', bg: '#f0fdf4', borderColor: '#bbf7d0', label: '신뢰 가능', sub: '대체로 믿을 수 있는 내용이에요.' };
  if (score >= 70) return { grade: 'B', color: '#f59e0b', bg: '#fffbeb', borderColor: '#fde68a', label: '주의 필요', sub: '홍보성 내용이 일부 섞여 있을 수 있어요.' };
  return { grade: 'C', color: '#ef4444', bg: '#fef2f2', borderColor: '#fecaca', label: '광고 의심', sub: '광고 표현이 많이 발견된 리뷰예요.' };
};

const PHRASE_TYPE_META: Record<string, { label: string; color: string; bg: string }> = {
  exaggeration:       { label: '과장 표현',  color: '#d97706', bg: '#fffbeb' },
  sponsor_denial:     { label: '광고 부인',  color: '#dc2626', bg: '#fef2f2' },
  negative_avoidance: { label: '단점 회피',  color: '#3b82f6', bg: '#eff6ff' },
  ad_pattern:         { label: '광고 패턴',  color: '#8b5cf6', bg: '#f5f3ff' },
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
  const phrases = analysisResult.highlighted_phrases || [];
  const typeCounts = phrases.reduce((acc, p) => {
    if (p.type && p.type !== 'neutral') acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const timeLabel = analysisResult.created_at
    ? new Date(analysisResult.created_at).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '방금 분석';

  return (
    <div className="w-full bg-slate-50 pt-24 md:pt-28 px-4 md:px-6 pb-0">
      <div className="max-w-[520px] mx-auto flex flex-col gap-4 pb-12">

        {/* 1. 신뢰 등급 히어로 */}
        <ResultHeader result={analysisResult} trustRank={trustRank} />

        {/* 2. 광고 빼고 한 줄 요약 */}
        {analysisResult.real_summary && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-3">광고 빼고 한 줄 요약</p>
            <blockquote className="text-[15px] font-bold text-slate-800 leading-relaxed break-keep">
              "{analysisResult.real_summary}"
            </blockquote>
            {analysisResult.overall_verdict && (
              <p className="text-[12px] text-slate-400 mt-3 leading-relaxed break-keep">
                {analysisResult.overall_verdict}
              </p>
            )}
          </div>
        )}

        {/* 3. 발견된 문제들 */}
        <FindingsSection phrases={phrases} typeCounts={typeCounts} adProbability={analysisResult.ad_probability} />

        {/* 4. 숨겨진 단점 */}
        <HiddenNegatives negatives={analysisResult.hidden_negatives} />

        {/* 5. 원문 분석 (하단 배치) */}
        <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">원문에서 발견된 표현들</p>
          <PhraseViewer
            result={analysisResult}
            activeFilters={activeFilters}
            onToggleFilter={(type) => setActiveFilters(prev =>
              prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
            )}
            onClearFilters={() => setActiveFilters([])}
          />
        </div>

        {/* 푸터 */}
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

/* ── 발견된 문제들 섹션 ─────────────────────── */
interface FindingsProps {
  phrases: HighlightedPhrase[];
  typeCounts: Record<string, number>;
  adProbability: number;
}

const FindingsSection: React.FC<FindingsProps> = ({ phrases, typeCounts, adProbability }) => {
  const total = Object.values(typeCounts).reduce((s, v) => s + v, 0);
  const hasFindings = total > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-fade-in-up" style={{ animationDelay: '120ms' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[15px] font-extrabold text-slate-900 tracking-tight">발견된 광고 표현</p>
          <p className="text-[11px] text-slate-400 mt-0.5">광고 확률 {adProbability}%</p>
        </div>
        <span
          className="text-[22px] font-black"
          style={{ color: adProbability >= 70 ? '#ef4444' : adProbability >= 40 ? '#f59e0b' : '#10b981' }}
        >
          {total}개
        </span>
      </div>

      {hasFindings ? (
        <div className="flex flex-wrap gap-2">
          {Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).map(([type, count]) => {
            const meta = PHRASE_TYPE_META[type];
            if (!meta) return null;
            return (
              <span
                key={type}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold"
                style={{ backgroundColor: meta.bg, color: meta.color }}
              >
                {meta.label}
                <span className="font-black">{count}</span>
              </span>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-2 py-2">
          <span className="material-symbols-outlined text-emerald-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <p className="text-[13px] text-slate-400 font-medium">광고성 표현이 발견되지 않았어요.</p>
        </div>
      )}
    </div>
  );
};

/* ── 에러 화면 ─────────────────────────────── */
interface ErrorScreenProps {
  message: string;
  onBack: () => void;
  onRetry: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onBack, onRetry }) => {
  const isUserError = ['너무 짧아요', 'URL이 아닌', '오타인 것', '반복된 내용', '한국어', '리뷰 본문만'].some(h => message.includes(h));

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
