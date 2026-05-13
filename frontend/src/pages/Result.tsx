import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { FaHistory, FaDownload, FaShareAlt } from 'react-icons/fa';
import { apiService } from '../services/api';
import type { AnalysisResponse } from '../types/analysis';
import MockPlatformViewer from '../components/MockPlatformViewer';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts';

let lastRequestTag = '';
let lastRequestTime = 0;

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

  const toggleFilter = (type: string) => {
    setActiveFilters(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

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
    } catch (error) { navigate('/'); } finally { setLoading(false); }
  };

  const performAnalysis = async (text: string, platform: string) => {
    try {
      setLoading(true);
      setAnalysisProgress(10);
      const steps = [
        '리뷰 내용 확인 중...',
        '광고 표현 찾는 중...',
        '숨겨진 단점 파악 중...',
        '작성 의도 분석 중...',
        '결과 정리 중...',
      ];
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

  const getRank = (score: number) => {
    if (score >= 93) return { grade: 'S', color: '#10b981', bg: '#ecfdf5', borderColor: '#a7f3d0', label: '매우 신뢰', sub: '믿을 수 있는 솔직한 후기예요.' };
    if (score >= 85) return { grade: 'A', color: '#3b82f6', bg: '#eff6ff', borderColor: '#bfdbfe', label: '신뢰 가능', sub: '대체로 믿을 수 있는 내용이에요.' };
    if (score >= 70) return { grade: 'B', color: '#f59e0b', bg: '#fffbeb', borderColor: '#fde68a', label: '주의 필요', sub: '홍보성 내용이 일부 섞여 있을 수 있어요.' };
    return { grade: 'C', color: '#ef4444', bg: '#fff1f2', borderColor: '#fecdd3', label: '광고 의심', sub: '광고 표현이 많이 발견된 리뷰예요.' };
  };

  // ─── 로딩 화면 ───────────────────────────────────────────────────────────────
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
               <p className="text-[14px] text-emerald-600 font-semibold animate-pulse">
                 {analysisStep}
               </p>
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

  const PHRASE_META: Record<string, { label: string; color: string; bg: string; icon: string }> = {
    exaggeration:       { label: '과장 표현',  color: '#d97706', bg: '#FFF3CD', icon: 'priority_high' },
    sponsor_denial:     { label: '광고 부인',  color: '#dc2626', bg: '#FFD6D6', icon: 'block' },
    negative_avoidance: { label: '단점 회피',  color: '#3b82f6', bg: '#D6EAFF', icon: 'visibility_off' },
    ad_pattern:         { label: '광고 패턴',  color: '#8b5cf6', bg: '#E8D6FF', icon: 'campaign' },
    neutral:            { label: '중립',       color: '#64748b', bg: '#f8fafc', icon: 'remove' },
  };

  const groupedPhrases = (analysisResult.highlighted_phrases || []).reduce((acc, phrase) => {
    const key = phrase.type || 'neutral';
    if (!acc[key]) acc[key] = [];
    acc[key].push(phrase);
    return acc;
  }, {} as Record<string, typeof analysisResult.highlighted_phrases>);

  const trustRank = getRank(analysisResult.trust_score);
  const ds = analysisResult.dimension_scores;
  const radarData = [
    { subject: '진정성', A: ds?.authenticity  ?? 50 },
    { subject: '정보성', A: ds?.information   ?? 50 },
    { subject: '상세함', A: ds?.specificity   ?? 50 },
    { subject: '광고패턴', A: analysisResult.ad_probability },
    { subject: '과장성', A: ds?.exaggeration  ?? 50 },
  ];

  const CustomTick = (props: any) => {
    const { x, y, payload } = props;
    const dataItem = radarData.find(d => d.subject === payload.value);
    const isLow = dataItem && dataItem.A < 50;
    return (
      <text x={x} y={y} dy={4} textAnchor="middle" fill={isLow ? '#ef4444' : '#94a3b8'} fontSize={11} fontWeight={700}>
        {payload.value}
      </text>
    );
  };

  const timeLabel = analysisResult.created_at
    ? new Date(analysisResult.created_at).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '방금 분석';

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10 px-6 md:px-8 relative overflow-hidden">
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-100/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-100/10 rounded-full blur-[120px] -z-10 pulse-slow" />

      <div className="max-w-5xl mx-auto space-y-8">

        {/* ── Section 1: 헤더 & 신뢰 등급 ─────────────────────────────────── */}
        <div className="bg-white rounded-[2rem] p-8 border border-emerald-50 custom-shadow animate-fade-in-up">
          <div className="flex flex-col md:flex-row items-stretch gap-8">

            {/* 신뢰 등급 배지 */}
            <div
              className="flex-shrink-0 flex flex-col items-center justify-center rounded-[1.5rem] px-10 py-6 border"
              style={{ backgroundColor: trustRank.bg, borderColor: trustRank.borderColor }}
            >
              <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">신뢰 등급</span>
              <span
                className="text-[72px] font-black leading-none tracking-tighter"
                style={{ color: trustRank.color }}
              >
                {trustRank.grade}
              </span>
              <span className="text-[13px] font-bold mt-1" style={{ color: trustRank.color }}>
                {trustRank.label}
              </span>
              <span className="text-[11px] text-gray-400 mt-1 text-center max-w-[120px]">
                {trustRank.sub}
              </span>
            </div>

            {/* 우측 정보 */}
            <div className="flex-1 flex flex-col justify-between gap-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] text-gray-400 font-medium mb-1">분석 완료</p>
                  <h1 className="text-[18px] font-extrabold text-on-surface tracking-tight leading-snug">
                    {analysisResult.blog_title || '리뷰 분석 결과'}
                  </h1>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors border border-gray-100">
                    <FaShareAlt size={13}/>
                  </button>
                  <button className="w-9 h-9 rounded-xl bg-on-surface flex items-center justify-center text-white hover:bg-gray-700 transition-colors">
                    <FaDownload size={13}/>
                  </button>
                </div>
              </div>

              {/* 숨겨진 의도 */}
              {analysisResult.hidden_intent && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
                  <span className="material-symbols-outlined text-amber-500 text-[18px] flex-shrink-0 mt-0.5">lightbulb</span>
                  <p className="text-[13px] text-amber-800 font-medium leading-snug">{analysisResult.hidden_intent}</p>
                </div>
              )}

              {/* 요약 지표 3개 */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '광고 표현', val: analysisResult.highlighted_phrases?.length || 0, unit: '개', color: '#ef4444' },
                  { label: '숨겨진 단점', val: analysisResult.hidden_negatives?.length || 0, unit: '건', color: '#6366f1' },
                  { label: '절약 예상', val: analysisResult.saved_cost?.replace('원','') || '0', unit: '원', color: '#10b981' }
                ].map((s, i) => (
                  <div key={i} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col justify-center">
                    <p className="text-[11px] font-bold text-gray-400 mb-1">{s.label}</p>
                    <p className="text-[18px] font-extrabold text-gray-800">
                      <span style={{ color: s.color }}>{s.val}</span>
                      <span className="text-[11px] font-bold text-gray-400 ml-1">{s.unit}</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* 신뢰도 진행 바 */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[12px] font-bold text-gray-500">신뢰 점수</span>
                  <span className="text-[13px] font-extrabold" style={{ color: trustRank.color }}>{analysisResult.trust_score}점</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${analysisResult.trust_score}%`, backgroundColor: trustRank.color }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 2: 원문 직접 분석 ────────────────────────────────────── */}
        <div className="animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-on-surface rounded-xl flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[18px]">find_in_page</span>
              </div>
              <div>
                <h3 className="text-[17px] font-extrabold text-on-surface tracking-tight">원문에서 발견된 표현들</h3>
                <p className="text-[12px] text-gray-400 font-medium mt-0.5">아래 태그를 눌러 종류별로 걸러볼 수 있어요</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(PHRASE_META).filter(([k]) => k !== 'neutral').map(([type, meta]) => {
                const isActive = activeFilters.includes(type);
                const count = groupedPhrases[type]?.length || 0;
                if (count === 0) return null;
                return (
                  <button
                    key={type}
                    onClick={() => toggleFilter(type)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[12px] font-bold transition-all duration-200 ${isActive ? 'ring-2 ring-offset-1' : 'opacity-60 hover:opacity-100'}`}
                    style={{
                      backgroundColor: meta.bg,
                      color: meta.color,
                      borderColor: isActive ? meta.color : meta.bg,
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
          <div className="bg-white rounded-[2rem] overflow-hidden custom-shadow border border-emerald-50 h-[480px]">
            <MockPlatformViewer
              platform={analysisResult?.platform || 'naver'}
              originalText={analysisResult?.original_content || ''}
              highlightedPhrases={analysisResult?.highlighted_phrases || []}
              activeFilters={activeFilters}
              onComplete={() => {}}
            />
          </div>
        </div>

        {/* ── Section 3: 한 줄 요약 & 총평 ────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '140ms' }}>

          {/* 한 줄 요약 */}
          <div className="bg-white rounded-[2rem] p-8 border border-emerald-50 custom-shadow flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                <span className="material-symbols-outlined text-[18px]">edit_note</span>
              </div>
              <div>
                <h3 className="text-[15px] font-extrabold text-on-surface tracking-tight">광고 빼고 한 줄 요약</h3>
                <p className="text-[11px] text-gray-400 font-medium">과장과 홍보를 걷어낸 핵심 내용이에요</p>
              </div>
            </div>
            <div className="bg-emerald-50 rounded-[1.5rem] p-6 border border-emerald-100 flex-1">
              <blockquote className="text-[16px] font-bold leading-relaxed break-keep text-gray-800">
                "{analysisResult.real_summary}"
              </blockquote>
            </div>
          </div>

          {/* 종합 의견 */}
          <div className="bg-white rounded-[2rem] p-8 border border-emerald-50 custom-shadow flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <div>
                <h3 className="text-[15px] font-extrabold text-on-surface tracking-tight">종합 의견</h3>
                <p className="text-[11px] text-gray-400 font-medium">모든 지표를 종합한 최종 판단이에요</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-[1.5rem] p-6 border border-gray-100 flex-1">
              <p className="text-[15px] font-bold leading-relaxed break-keep text-gray-800">
                {analysisResult.overall_verdict}
              </p>
            </div>
          </div>
        </div>

        {/* ── Section 4: 숨겨진 단점 & 세부 지표 ───────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>

          {/* 숨겨진 단점 */}
          <div className="bg-white rounded-[2rem] p-8 border border-emerald-50 custom-shadow flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                <span className="material-symbols-outlined text-[18px]">visibility</span>
              </div>
              <h3 className="text-[15px] font-extrabold text-on-surface tracking-tight">이 리뷰가 말하지 않은 것들</h3>
            </div>
            <div className="space-y-3 flex-grow">
              {analysisResult.hidden_negatives?.map((n, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 transition-colors">
                  <p className="text-[14px] font-bold text-gray-800 leading-snug mb-2">{n.inferred}</p>
                  <p className="text-[12px] text-gray-400 leading-relaxed mb-3">{n.reasoning}</p>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-grow bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-400 rounded-full"
                        style={{ width: `${n.confidence}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-indigo-500 flex-shrink-0">{n.confidence}% 가능성</span>
                  </div>
                </div>
              ))}
              {(!analysisResult.hidden_negatives || analysisResult.hidden_negatives.length === 0) && (
                <p className="text-gray-400 text-[14px] text-center py-8">특별히 숨겨진 단점이 없어요.</p>
              )}
            </div>
          </div>

          {/* 세부 분석 지표 */}
          <div className="bg-white rounded-[2rem] p-8 border border-emerald-50 custom-shadow flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                <span className="material-symbols-outlined text-[18px]">analytics</span>
              </div>
              <h3 className="text-[15px] font-extrabold text-on-surface tracking-tight">리뷰 성향 분석</h3>
            </div>
            <div className="flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="subject" tick={<CustomTick />} />
                  <Radar name="Analysis" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.08} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-[11px] text-gray-300">과장성이 높을수록 광고 가능성이 높아요</p>
              <p className="text-[11px] text-gray-300">{analysisResult.original_content?.length || 0}자 분석</p>
            </div>
          </div>
        </div>

        {/* ── Section 5: 푸터 액션 ─────────────────────────────────────────── */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-20">
          <div className="flex items-center gap-3 text-gray-400 font-medium text-[13px]">
            <FaHistory size={12} />
            {timeLabel}
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-emerald-600 text-white font-extrabold text-[15px] rounded-2xl hover:bg-emerald-700 transition-all active:scale-95 custom-shadow"
          >
            다른 리뷰 분석하기
          </button>
        </div>

      </div>
    </div>
  );
};

export default Result;
