import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { AnalysisResponse, PhraseType } from '../types/analysis';
import { apiService } from '../services/api';
import MockPlatformViewer from '../components/MockPlatformViewer';
import { SiNaver, SiInstagram } from 'react-icons/si';
import { FaShoppingCart, FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaShieldAlt, FaMagic, FaSearch, FaHistory, FaChartPie } from 'react-icons/fa';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const PHRASE_CONFIG: Record<PhraseType, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  sponsor_denial:     { label: '광고 부인', color: 'text-red-600',    bg: 'bg-red-50',    icon: <FaTimesCircle className="text-[10px]" /> },
  exaggeration:       { label: '과장 표현', color: 'text-amber-600',  bg: 'bg-amber-50',  icon: <FaExclamationTriangle className="text-[10px]" /> },
  negative_avoidance: { label: '단점 회피', color: 'text-orange-600', bg: 'bg-orange-50', icon: <FaShieldAlt className="text-[10px]" /> },
  ad_pattern:         { label: '광고 패턴', color: 'text-red-600',    bg: 'bg-red-50',    icon: <FaTimesCircle className="text-[10px]" /> },
  neutral:            { label: '중립',      color: 'text-gray-500',   bg: 'bg-gray-50',   icon: <FaCheckCircle className="text-[10px]" /> },
};

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  naver: <SiNaver className="text-[#03C75A]" />,
  insta: <SiInstagram className="text-[#E1306C]" />,
  coupang: <FaShoppingCart className="text-[#CB1400]" />,
  other: <span className="material-symbols-outlined text-gray-500 text-[18px]">public</span>,
};

const PLATFORM_NAMES: Record<string, string> = {
  naver: '네이버',
  insta: '인스타그램',
  coupang: '쿠팡',
  other: '기타',
};

const LOADING_MESSAGES = [
  "플랫폼 특성을 분석하고 있어요...",
  "광고 패턴을 매칭하는 중이에요...",
  "의도적으로 숨겨진 단점을 추론하고 있어요...",
  "과장을 덜어내고 진짜 리뷰로 재작성 중이에요..."
];

const Result: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');

  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [platform, setPlatform] = useState(location.state?.platform || 'other');
  const [inputText] = useState(location.state?.text || '');
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  useEffect(() => {
    if (!isAnalyzing) return;
    const interval = setInterval(() => {
      setLoadingMsgIdx(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  useEffect(() => {
    const loadData = async () => {
      const startTime = Date.now();
      try {
        if (id) {
          const data = await apiService.getById(Number(id));
          setResult(data);
          setPlatform(data.platform || 'other');
        } else if (inputText) {
          const data = await apiService.analyze(inputText, platform);
          setResult(data);
          setPlatform(data.platform || platform);
        } else {
          navigate('/');
          return;
        }
      } catch {
        navigate('/');
        return;
      }

      const elapsed = Date.now() - startTime;
      const minLoading = 4000;
      if (elapsed < minLoading) setTimeout(() => setIsAnalyzing(false), minLoading - elapsed);
      else setIsAnalyzing(false);
    };
    loadData();
  }, [id, inputText, navigate, platform]);

  if (!result && isAnalyzing) {
    return (
      <div className="flex-grow pt-32 pb-20 px-6 max-w-4xl mx-auto w-full min-h-screen flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <div className="h-12 w-32 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="flex items-center gap-3 text-[15px] text-emerald-700 font-bold bg-emerald-50 px-5 py-2.5 rounded-xl border border-emerald-100 shadow-sm">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping inline-block" />
            <span key={loadingMsgIdx}>{LOADING_MESSAGES[loadingMsgIdx]}</span>
          </div>
        </div>
        <div className="h-[400px] bg-white rounded-[2.5rem] border border-gray-100 shadow-sm animate-pulse flex items-center justify-center">
           <div className="text-gray-400 flex flex-col items-center gap-4">
              <span className="material-symbols-outlined text-[48px] animate-spin text-emerald-200">sync</span>
              <p className="font-medium text-[15px]">리뷰 텍스트를 X-ray 스캔 중입니다...</p>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-40 bg-white rounded-[2rem] border border-gray-100 animate-pulse" />
          <div className="h-40 bg-white rounded-[2rem] border border-gray-100 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!result) return null;

  const score = result.trust_score ?? 0;
  const trustLevel = score >= 70 ? 'safe' : score >= 40 ? 'warning' : 'danger';
  const trustTheme = {
    safe:    { label: '신뢰 가능', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: <FaCheckCircle /> },
    warning: { label: '주의 필요', color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100',   icon: <FaExclamationTriangle /> },
    danger:  { label: '광고 의심', color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-100',     icon: <FaTimesCircle /> },
  }[trustLevel];

  const ds = result.dimension_scores;
  const radarData = [
    { subject: '진정성', value: ds?.authenticity  ?? score,                        fullMark: 100 },
    { subject: '정보성', value: ds?.information   ?? Math.min(100, score + 10),    fullMark: 100 },
    { subject: '상세함', value: ds?.specificity   ?? Math.min(100, score - 5),     fullMark: 100 },
    { subject: '광고패턴', value: result.ad_probability,                            fullMark: 100 },
    { subject: '과장성', value: ds?.exaggeration  ?? Math.min(100, 100 - score + 15), fullMark: 100 },
  ];

  return (
    <div className="flex-grow pt-24 pb-20 px-6 min-h-screen relative overflow-hidden">
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-100/10 rounded-full blur-[120px] -z-10"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-100/10 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-4xl mx-auto flex flex-col gap-10 animate-fade-in-up">

        {/* ── 헤더 ── */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm">
              <div className="text-[16px]">{PLATFORM_ICONS[platform]}</div>
              <span className="text-[14px] font-bold text-on-surface">{PLATFORM_NAMES[platform] ?? platform}</span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${trustTheme.bg} ${trustTheme.border}`}>
              <div className={trustTheme.color}>{trustTheme.icon}</div>
              <span className={`text-[14px] font-bold ${trustTheme.color}`}>{trustTheme.label}</span>
              <span className={`text-[14px] font-black ${trustTheme.color} opacity-60 ml-1`}>{score}점</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] font-bold text-on-surface-variant hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <FaArrowLeft className="text-[12px]" />
            다시 분석하기
          </button>
        </header>

        {/* ── 1. 광고를 걷어낸 진짜 이야기 (overall_verdict) ── */}
        <section className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
          <div className="relative bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] custom-shadow overflow-hidden">
            <div className="p-10 md:p-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <FaMagic className="text-[18px]" />
                </div>
                <div>
                  <span className="text-[12px] font-black text-emerald-600 uppercase tracking-widest block leading-none mb-1">AI Truth Extraction</span>
                  <h2 className="text-[20px] font-bold text-on-surface">광고를 걷어낸 진짜 이야기</h2>
                </div>
              </div>

              <div className="relative">
                <span className="absolute -top-6 -left-4 text-[80px] font-serif text-emerald-100 select-none leading-none opacity-50">"</span>
                <p className="text-[20px] md:text-[24px] font-medium leading-[1.7] text-on-surface mb-8 relative z-10 break-keep">
                  {result.overall_verdict}
                </p>
                <span className="absolute -bottom-12 -right-4 text-[80px] font-serif text-emerald-100 select-none leading-none opacity-50 rotate-180">"</span>
              </div>

              <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-on-surface-variant/70 italic text-[14px]">
                  <FaHistory className="text-[14px]" />
                  <span>{result.real_summary}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-[11px] text-on-surface-variant/60 font-medium whitespace-nowrap">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  AI가 실제 경험 수치와 팩트만을 추출하여 재구성했습니다.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. 숨겨진 리스크 & 절약 정보 ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 flex flex-col gap-6">
             <h3 className="text-[15px] font-black text-on-surface flex items-center gap-2 ml-2">
                <FaExclamationTriangle className="text-amber-500" />
                이 리뷰가 숨기고 있었을 불편함
             </h3>
             <div className="flex flex-col gap-4">
               {result.hidden_negatives?.map((neg, idx) => (
                 <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex gap-5">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-[18px] font-black text-gray-300">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-[17px] font-bold text-on-surface mb-2">{neg.inferred}</h4>
                      <p className="text-[14px] text-on-surface-variant leading-relaxed mb-3">{neg.reasoning}</p>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-grow bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${neg.confidence}%` }}></div>
                        </div>
                        <span className="text-[11px] font-bold text-amber-600">{neg.confidence}% 신뢰</span>
                      </div>
                    </div>
                 </div>
               ))}
             </div>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-[15px] font-black text-on-surface flex items-center gap-2 ml-2">
                <FaShieldAlt className="text-emerald-500" />
                No-Click 절약 리포트
             </h3>
             <div className="bg-white p-8 rounded-[2rem] border border-emerald-50 shadow-sm flex flex-col gap-8 h-full">
                <div className="text-center">
                  <p className="text-[13px] text-on-surface-variant mb-1">당신의 소중한 시간</p>
                  <p className="text-[36px] font-black text-emerald-600 leading-tight">{result.saved_time}</p>
                  <p className="text-[11px] text-emerald-500 font-semibold mt-1">을 지켜드렸습니다</p>
                </div>
                <div className="h-px bg-gray-50"></div>
                <div className="text-center">
                  <p className="text-[13px] text-on-surface-variant mb-1">광고에 속을 뻔한 비용</p>
                  <p className="text-[28px] font-black text-emerald-600 leading-tight">{result.saved_cost}</p>
                  <p className="text-[11px] text-gray-400 font-medium mt-1">광고성 리뷰 위험 회피 추정액</p>
                  <p className="text-[10px] text-gray-300 mt-1">* AI가 예상한 금액으로 실제와 다를 수 있습니다</p>
                </div>
                <div className="mt-auto pt-6 text-center">
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-lg text-[11px] font-bold text-emerald-700">
                      <FaCheckCircle /> Good Decision
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* ── 3. 다차원 성분 분석 차트 ── */}
        <section className="flex flex-col gap-6">
           <h3 className="text-[15px] font-black text-on-surface flex items-center gap-2 ml-2">
              <FaChartPie className="text-purple-500" />
              리뷰 다차원 성분 분석
           </h3>
           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#f3f4f6" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 700 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                      itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                    />
                    <Radar name="리뷰 특성" dataKey="value" stroke="#10b981" strokeWidth={2} fill="#34d399" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-4">
                <h4 className="text-[18px] font-bold text-on-surface">종합 평가 결과</h4>
                <p className="text-[14.5px] text-on-surface-variant leading-relaxed break-keep">
                  다차원 특성 분석 결과, 현재 <strong className={`mx-1 ${trustTheme.color}`}>{trustTheme.label}</strong> 수준입니다.
                  <br className="hidden md:block" />
                  특히 <strong className="text-emerald-600 mx-1">{[...radarData].sort((a,b)=>b.value - a.value)[0].subject}</strong> 지표가 가장 두드러지게 나타납니다.
                </p>
              </div>
           </div>
        </section>

        {/* ── 4. 원본 리뷰 분석 뷰어 ── */}
        <section className="flex flex-col gap-6">
           <h3 className="text-[15px] font-black text-on-surface flex items-center gap-2 ml-2">
              <FaSearch className="text-blue-500" />
              어떻게 광고인 것을 알아냈나요?
           </h3>

           <div className="bg-white rounded-[2.5rem] border border-gray-100 custom-shadow overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="text-[12px] font-bold text-on-surface-variant/50 uppercase tracking-widest">Review Forensics</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.highlighted_phrases?.slice(0, 3).map((phrase, idx) => {
                    const cfg = PHRASE_CONFIG[phrase.type as PhraseType] ?? PHRASE_CONFIG.neutral;
                    return (
                      <div key={idx} className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border ${cfg.bg} ${cfg.color.replace('text-', 'border-').replace('-600', '-100')} ${cfg.color} text-[10px] font-bold`}>
                        {cfg.icon}
                        {cfg.label}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ height: 320 }}>
                <MockPlatformViewer
                  platform={platform}
                  originalText={result.original_content}
                  highlightedPhrases={result.highlighted_phrases}
                  onComplete={() => {}}
                />
              </div>
           </div>
        </section>

        <footer className="text-center pt-10">
          <p className="text-[12px] text-on-surface-variant/40 font-medium tracking-wide">
            No-Click X-ray Engine — Real-time Review Forensics Powered by AI
          </p>
        </footer>

      </div>
    </div>
  );
};

export default Result;
