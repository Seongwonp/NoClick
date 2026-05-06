import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { AnalysisResult, PhraseType } from '../types/analysis';
import { mockAnalysisService } from '../services/mockApi';
import MockPlatformViewer from '../components/MockPlatformViewer';

const PHRASE_CONFIG: Record<PhraseType, { label: string; color: string; bg: string }> = {
  sponsor_denial:     { label: '광고 부인 패턴', color: 'text-red-700',    bg: 'bg-red-100' },
  exaggeration:       { label: '과장 표현',       color: 'text-amber-700',  bg: 'bg-amber-100' },
  negative_avoidance: { label: '단점 회피',       color: 'text-orange-700', bg: 'bg-orange-100' },
  ad_pattern:         { label: '광고 패턴',       color: 'text-red-700',    bg: 'bg-red-100' },
  neutral:            { label: '중립',             color: 'text-gray-600',   bg: 'bg-gray-100' },
};

const Result: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [platform, setPlatform] = useState(location.state?.platform || 'other');
  const [inputText] = useState(location.state?.text || '');

  useEffect(() => {
    const loadData = async () => {
      const startTime = Date.now();
      if (id) {
        const historicalData = mockAnalysisService.getResult(id);
        if (historicalData) {
          setResult(historicalData);
          setPlatform(historicalData.platform);
        } else { navigate('/'); return; }
      } else if (inputText) {
        try {
          const data = await mockAnalysisService.analyze({ text: inputText, platform });
          setResult(data);
        } catch { navigate('/'); return; }
      } else { navigate('/'); return; }

      const elapsed = Date.now() - startTime;
      const minLoading = 4000;
      if (elapsed < minLoading) setTimeout(() => setIsAnalyzing(false), minLoading - elapsed);
      else setIsAnalyzing(false);
    };
    loadData();
  }, [id, inputText, navigate, platform]);

  if (!result && isAnalyzing) {
    return (
      <div className="flex-grow pt-24 pb-20 px-4 max-w-3xl mx-auto w-full bg-[#f5f6f8] min-h-screen">
        <div className="flex flex-col gap-5 animate-pulse">
          <div className="h-10 bg-white border border-[#e8e9ec] rounded-xl" />
          <div className="h-56 bg-[#1c1e2e] rounded-2xl opacity-20" />
          <div className="h-32 bg-white border border-[#e8e9ec] rounded-xl" />
          <div className="h-48 bg-white border border-[#e8e9ec] rounded-xl" />
        </div>
      </div>
    );
  }

  const score = result?.trust_score ?? 0;
  const trustLevel = score >= 70 ? 'safe' : score >= 40 ? 'warning' : 'danger';
  const trustBadge = {
    safe:    { label: '신뢰 가능', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    warning: { label: '주의 필요', bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500' },
    danger:  { label: '광고 의심', bg: 'bg-red-100',     text: 'text-red-700',     dot: 'bg-red-500' },
  }[trustLevel];

  return (
    <div className="flex-grow pt-20 pb-12 px-4 bg-[#f5f6f8] min-h-screen">
      <div className="max-w-3xl mx-auto flex flex-col gap-6 animate-fade-in">

        {/* ── 헤더: 플랫폼 + 신뢰도 뱃지 (작게) ── */}
        <header className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[#9095a3] capitalize">{platform}</span>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${trustBadge.bg}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${trustBadge.dot}`} />
              <span className={`text-xs font-bold ${trustBadge.text}`}>{trustBadge.label}</span>
              <span className={`text-xs font-black ${trustBadge.text} opacity-70`}>{score}점</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-[#9095a3] hover:text-[#5b6cf4] font-medium transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>arrow_back</span>
            다시 분석하기
          </button>
        </header>

        {/* ── 1. 광고를 걷어내면 (히어로, 가장 먼저) ── */}
        <section className="bg-[#1c1e2e] rounded-2xl overflow-hidden">
          <div className="px-7 pt-7 pb-5">
            <div className="flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-[#5b6cf4]" style={{ fontSize: 16 }}>auto_fix_high</span>
              <span className="text-[11px] font-black text-[#5b6cf4] uppercase tracking-[0.15em]">
                광고를 걷어내면
              </span>
            </div>

            <blockquote className="text-[17px] font-medium leading-[1.85] text-white/88 mb-6">
              "{result?.rewritten_text}"
            </blockquote>

            <div className="border-t border-white/8 pt-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-white/25" style={{ fontSize: 13 }}>info</span>
              <p className="text-xs text-white/30 font-medium">
                광고성 수식어를 제거하고 실제 경험만 추출한 AI 재작성 버전
              </p>
            </div>
          </div>

          {/* AI 한줄 요약 - 다크 카드 내 구분선 아래 */}
          <div className="bg-white/5 border-t border-white/8 px-7 py-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#8b90c8] mt-0.5" style={{ fontSize: 15 }}>summarize</span>
              <p className="text-sm text-white/55 leading-relaxed">{result?.real_summary}</p>
            </div>
          </div>
        </section>

        {/* ── 2. 리뷰가 가리고 있던 것들 ── */}
        {result?.hidden_negatives && result.hidden_negatives.length > 0 && (
          <section>
            <h2 className="text-[13px] font-black text-[#1c1e24] mb-3 flex items-center gap-2 uppercase tracking-wide">
              <span className="material-symbols-outlined text-red-500" style={{ fontSize: 16 }}>visibility_off</span>
              이 리뷰가 가리고 있던 것들
            </h2>
            <div className="flex flex-col gap-2.5">
              {result.hidden_negatives.map((neg, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-[#e8e9ec] p-5 flex items-start gap-5 shadow-sm"
                >
                  <span className="text-3xl font-black text-gray-100 leading-none select-none flex-shrink-0 w-7 text-center">
                    {idx + 1}
                  </span>
                  <div className="flex-grow min-w-0">
                    <p className="text-[15px] font-bold text-[#1c1e24] mb-1">{neg.inferred}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{neg.reasoning}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-2xl font-black text-red-400 leading-none">{neg.confidence}</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">% 신뢰</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 3. 어떻게 발견했나 (증거) ── */}
        <section>
          <h2 className="text-[13px] font-black text-[#1c1e24] mb-3 flex items-center gap-2 uppercase tracking-wide">
            <span className="material-symbols-outlined text-amber-500" style={{ fontSize: 16 }}>search</span>
            어떻게 발견했나
          </h2>

          {/* 감지된 패턴 뱃지 */}
          {result?.highlighted_phrases && result.highlighted_phrases.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {result.highlighted_phrases.map((phrase, idx) => {
                const cfg = PHRASE_CONFIG[phrase.type] ?? PHRASE_CONFIG.neutral;
                return (
                  <div key={idx} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${cfg.bg}`}>
                    <span className={`text-xs font-bold ${cfg.color}`}>"{phrase.text}"</span>
                    <span className={`text-[10px] ${cfg.color} opacity-60`}>· {cfg.label}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* 원본 리뷰 뷰어 */}
          <div className="bg-white rounded-xl border border-[#e8e9ec] overflow-hidden shadow-sm">
            <div className="px-4 py-2.5 border-b border-[#e8e9ec] bg-[#f8f9fb] flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <span className="text-[11px] font-bold text-[#b0b4bf] uppercase tracking-wider">
                원본 리뷰 — 광고 표현 하이라이트
              </span>
            </div>
            <div style={{ height: 240 }}>
              {result && (
                <MockPlatformViewer
                  platform={platform}
                  originalText={result.original_text}
                  highlightedPhrases={result.highlighted_phrases}
                  onComplete={() => {}}
                />
              )}
            </div>
          </div>
        </section>

        {/* ── 4. 절약 정보 ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-[#e8e9ec] p-5 text-center shadow-sm">
            <p className="text-xs text-gray-400 font-medium mb-1.5">절약한 예상 비용</p>
            <p className="text-2xl font-black text-[#5b6cf4]">{result?.saved_cost}</p>
          </div>
          <div className="bg-white rounded-xl border border-[#e8e9ec] p-5 text-center shadow-sm">
            <p className="text-xs text-gray-400 font-medium mb-1.5">절약한 예상 시간</p>
            <p className="text-2xl font-black text-[#5b6cf4]">{result?.saved_time}</p>
          </div>
        </div>

        <footer className="text-center text-[11px] text-[#c8cad4] font-medium border-t border-gray-200 pt-6 pb-2">
          No-Click X-ray Engine — Real-time Review Forensics Powered by AI
        </footer>

      </div>
    </div>
  );
};

export default Result;
