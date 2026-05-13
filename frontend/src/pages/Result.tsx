import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { FaHistory } from 'react-icons/fa';
import { apiService } from '../services/api';
import type { AnalysisResponse } from '../types/analysis';
import LoadingScreen from '../components/result/LoadingScreen';
import ResultHeader from '../components/result/ResultHeader';
import RadarPanel from '../components/result/RadarPanel';
import MockPlatformViewer from '../components/MockPlatformViewer';
import { PHRASE_META } from '../components/result/PhraseViewer';

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

  if (loading && !analysisComplete) return <LoadingScreen progress={progress} step={step} />;

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

  const phrases = analysisResult.highlighted_phrases || [];
  const typeCounts = phrases.reduce((acc, p) => {
    if (p.type && p.type !== 'neutral') acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const phraseTotal = Object.values(typeCounts).reduce((s, v) => s + v, 0);
  const negatives = analysisResult.hidden_negatives || [];

  const timeLabel = analysisResult.created_at
    ? new Date(analysisResult.created_at).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '방금 분석';

  return (
    <div className="w-full bg-[#f8f9fa] pt-16 relative">
      {/* 홈이랑 동일한 배경 블롭 */}
      <div className="fixed top-[-10%] right-[-5%] w-[420px] h-[420px] bg-emerald-100/10 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-100/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start px-4 md:px-6 gap-5 lg:gap-8">

        {/* ── 왼쪽: 원문 고정 패널 ── */}
        <div className="w-full lg:w-[50%] order-2 lg:order-1 pb-8 lg:sticky lg:top-20 lg:pt-8">
          <p className="text-[11px] font-extrabold text-on-surface-variant uppercase tracking-wider mb-3 px-1">
            원문 분석
          </p>

          {/* 필터 버튼 */}
          {phraseTotal > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {Object.entries(PHRASE_META).filter(([k]) => k !== 'neutral').map(([type, meta]) => {
                const count = typeCounts[type] || 0;
                if (count === 0) return null;
                const isActive = activeFilters.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => setActiveFilters(prev =>
                      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
                    )}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[12px] font-bold transition-all ${isActive ? 'ring-2 ring-offset-1' : 'opacity-60 hover:opacity-100'}`}
                    style={{
                      backgroundColor: meta.bg,
                      color: meta.color,
                      borderColor: isActive ? meta.color : 'transparent',
                    }}
                  >
                    <span className="material-symbols-outlined text-[13px]">{meta.icon}</span>
                    {meta.label}
                    <span className="opacity-60">{count}</span>
                  </button>
                );
              })}
              {activeFilters.length > 0 && (
                <button
                  onClick={() => setActiveFilters([])}
                  className="text-[11px] text-on-surface-variant hover:text-on-surface px-2 transition-colors"
                >
                  초기화
                </button>
              )}
            </div>
          )}

          {/* 원문 뷰어 */}
          <div
            className="bg-white rounded-[2rem] overflow-hidden custom-shadow border border-emerald-50"
            style={{ height: 'clamp(440px, calc(100vh - 12rem), 740px)' }}
          >
            <MockPlatformViewer
              platform={analysisResult.platform || 'naver'}
              originalText={analysisResult.original_content || ''}
              highlightedPhrases={analysisResult.highlighted_phrases || []}
              activeFilters={activeFilters}
              onComplete={() => {}}
            />
          </div>
        </div>

        {/* ── 오른쪽: 분석 결과 스크롤 ── */}
        <div className="w-full lg:w-[50%] order-1 lg:order-2 pt-5 lg:pt-8 pb-16 space-y-4">

          {/* 블로그 제목 */}
          {analysisResult.blog_title && (
            <p className="text-[12px] font-semibold text-on-surface-variant truncate px-1 animate-fade-in-up">
              {analysisResult.blog_title}
            </p>
          )}

          {/* 카드 1 — 신뢰 등급 */}
          <ResultHeader result={analysisResult} trustRank={trustRank} />

          {/* 카드 2 — 통합 분석 (숨겨진 의도 + 요약 + 표현 타입 + 절약) */}
          <div className="bg-white rounded-[2rem] border border-emerald-50 custom-shadow overflow-hidden animate-fade-in-up" style={{ animationDelay: '60ms' }}>
            {analysisResult.hidden_intent && (
              <div className="flex items-start gap-3 bg-amber-50 border-b border-amber-100 px-6 py-4">
                <span className="material-symbols-outlined text-amber-500 text-[16px] flex-shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                <p className="text-[12px] text-amber-900 font-semibold leading-snug break-keep">
                  <span className="font-extrabold text-amber-700">숨겨진 의도 · </span>
                  {analysisResult.hidden_intent}
                </p>
              </div>
            )}
            <div className="px-6 py-5">
              <p className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider mb-2">광고 빼고 핵심</p>
              <p className="text-[15px] font-bold text-on-surface leading-relaxed break-keep mb-3">
                "{analysisResult.real_summary}"
              </p>
              {analysisResult.overall_verdict && (
                <p className="text-[12px] text-on-surface-variant leading-relaxed break-keep">
                  {analysisResult.overall_verdict}
                </p>
              )}
              {phraseTotal > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-gray-50">
                  {Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).map(([type, count]) => {
                    const meta = PHRASE_META[type];
                    if (!meta) return null;
                    return (
                      <span key={type} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
                        style={{ backgroundColor: meta.bg, color: meta.color }}>
                        {meta.label} <span className="opacity-50">{count}</span>
                      </span>
                    );
                  })}
                </div>
              )}
              {(() => {
                const hasCost = analysisResult.saved_cost && analysisResult.saved_cost !== '0원';
                const hasTime = !!analysisResult.saved_time;
                if (!hasCost && !hasTime) return null;
                const parts: string[] = [];
                if (hasTime) parts.push(`약 ${analysisResult.saved_time}`);
                if (hasCost) parts.push(`${analysisResult.saved_cost}`);
                return (
                  <p className="text-[11px] text-emerald-600 font-semibold mt-3">
                    이 분석으로 {parts.join('과 ')}을 아꼈어요
                  </p>
                );
              })()}
            </div>
          </div>

          {/* 카드 3 — 숨긴 것들 */}
          {negatives.length > 0 && (
            <div className="bg-white rounded-[2rem] border border-emerald-50 custom-shadow px-6 py-5 animate-fade-in-up" style={{ animationDelay: '120ms' }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-indigo-400 text-[17px]" style={{ fontVariationSettings: "'FILL' 1" }}>visibility_off</span>
                <p className="text-[13px] font-extrabold text-on-surface tracking-tight">이 리뷰가 숨긴 것들</p>
              </div>
              {negatives.map((n, i) => (
                <div key={i} className="flex items-start gap-3 py-3.5 border-b border-gray-50 last:border-0">
                  <span className="text-[11px] font-black text-gray-300 w-4 flex-shrink-0 mt-0.5">{i + 1}</span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-on-surface leading-snug mb-1">{n.inferred}</p>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed break-keep">{n.reasoning}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 성향 분석 (카드 없이 가볍게) */}
          <div className="animate-fade-in-up" style={{ animationDelay: '180ms' }}>
            <RadarPanel result={analysisResult} radarData={radarData} />
          </div>

          {/* 푸터 */}
          <div className="flex items-center justify-between pt-5 border-t border-emerald-50">
            <div className="flex items-center gap-2 text-on-surface-variant text-[12px] font-medium">
              <FaHistory size={11} />
              {timeLabel}
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-emerald-600 text-white font-bold text-[14px] rounded-2xl hover:bg-emerald-700 transition-all active:scale-95 custom-shadow"
            >
              다른 리뷰 분석하기
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

/* ── 에러 화면 ── */
interface ErrorScreenProps { message: string; onBack: () => void; onRetry: () => void; }

const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onBack, onRetry }) => {
  const isUserError = ['너무 짧아요', 'URL이 아닌', '오타인 것', '반복된 내용', '한국어', '리뷰 본문만'].some(h => message.includes(h));
  return (
    <div className="flex-1 flex items-center justify-center bg-[#f8f9fa] px-6 pt-20 pb-16">
      <div className="w-full max-w-sm bg-white rounded-[2rem] border border-emerald-50 custom-shadow p-8 flex flex-col items-center text-center gap-5">
        <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center ${isUserError ? 'bg-amber-50' : 'bg-red-50'}`}>
          <span className={`material-symbols-outlined text-[26px] ${isUserError ? 'text-amber-500' : 'text-red-400'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
            {isUserError ? 'info' : 'error'}
          </span>
        </div>
        <div>
          <h2 className="text-[20px] font-extrabold text-on-surface mb-2 tracking-tight">
            {isUserError ? '입력 내용을 확인해 주세요' : '분석에 실패했어요'}
          </h2>
          <p className="text-[14px] text-on-surface-variant leading-relaxed break-keep">{message}</p>
        </div>
        <div className="flex gap-3 w-full">
          <button onClick={onBack} className="flex-1 py-3.5 rounded-2xl border border-gray-200 text-on-surface-variant font-bold text-[14px] hover:bg-gray-50 transition-colors">돌아가기</button>
          {!isUserError && (
            <button onClick={onRetry} className="flex-1 py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-[14px] hover:bg-emerald-700 transition-colors">다시 시도</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
