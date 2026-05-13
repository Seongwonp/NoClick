import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import type { HighlightedPhrase } from '../types/analysis';

interface Props {
  platform: string;
  originalText: string;
  highlightedPhrases: HighlightedPhrase[];
  activeFilters?: string[]; // 추가된 필터 프롭스
  onComplete: () => void;
}

interface MockProps {
  text: string;
  phrases: HighlightedPhrase[];
  activePhraseIndices: Set<number>;
  activeFilters: string[];
  active: boolean;
  reviewRef: React.RefObject<HTMLDivElement | null>;
}

export const PHRASE_STYLE: Record<string, { label: string; color: string; lightColor: string; icon: string }> = {
  exaggeration:       { label: '과장 표현', color: '#d97706', lightColor: '#FFF3CD', icon: 'campaign' },
  sponsor_denial:     { label: '광고 부인', color: '#ef4444', lightColor: '#FFD6D6', icon: 'block' },
  negative_avoidance: { label: '단점 회피', color: '#3b82f6', lightColor: '#D6EAFF', icon: 'shield' },
  ad_pattern:         { label: '광고 패턴', color: '#8b5cf6', lightColor: '#E8D6FF', icon: 'warning' },
  neutral:            { label: '중립',      color: '#8395a7', lightColor: 'rgba(131, 149, 167, 0.2)', icon: 'info' },
};

const HighlightedSpan: React.FC<{
  phrase: HighlightedPhrase;
  part: string;
  isActive: boolean;
}> = ({ phrase, part, isActive }) => {
  const [isHovered, setIsHovered] = useState(false);
  const style = PHRASE_STYLE[phrase.type] ?? PHRASE_STYLE.neutral;
  const reason = phrase.reason || (phrase as any).reasoning;

  return (
    <span 
      className="relative group/phrase inline"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        style={{
          background: `linear-gradient(${style.lightColor}, ${style.lightColor}) no-repeat`,
          backgroundSize: isActive ? '100% 30%' : '0% 30%',
          backgroundPosition: '0 95%',
          transition: 'background-size 0.8s cubic-bezier(0.65, 0, 0.35, 1)',
          color: 'inherit',
          padding: '0 1px',
          borderRadius: '2px'
        }}
        className="relative"
      >
        {part}
      </span>
      {isHovered && (
        <div className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
          <div 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.12)] border border-white bg-white/95 backdrop-blur-sm animate-fade-in-up whitespace-nowrap"
            style={{ 
              color: style.color,
              borderColor: style.color + '30',
              animationDuration: '0.3s'
            }}
          >
            <span className="material-symbols-outlined text-[15px]">{style.icon}</span>
            <span className="text-[12px] font-black">{style.label}</span>
            {reason && (
              <>
                <div className="w-[1px] h-3 bg-current opacity-20 mx-0.5" />
                <span className="text-[12px] font-bold text-gray-700 max-w-[240px] truncate">{reason}</span>
              </>
            )}
          </div>
        </div>
      )}
    </span>
  );
};

const HighlightedText: React.FC<{
  text: string;
  phrases: HighlightedPhrase[];
  activePhraseIndices: Set<number>;
  activeFilters: string[];
}> = ({ text, phrases, activePhraseIndices, activeFilters }) => {
  let result: React.ReactNode[] = [text];

  phrases.forEach((phrase, idx) => {
    // 필터링 처리: 활성화된 필터에 없으면 하이라이트 생략
    if (activeFilters.length > 0 && !activeFilters.includes(phrase.type)) return;
    if (!phrase.text) return;

    const newResult: React.ReactNode[] = [];
    const isActive = activePhraseIndices.has(idx);

    // 공백, 띄어쓰기 차이 무시를 위한 정규식 생성
    const escaped = phrase.text.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regexStr = escaped.replace(/\s+/g, '\\s+');
    const regex = new RegExp(`(${regexStr})`, 'gi');

    result.forEach((node) => {
      if (typeof node === 'string') {
        const parts = node.split(regex);
        parts.forEach((part, i) => {
          if (i % 2 === 1) { // 정규식 캡처 그룹 매칭 부분
            newResult.push(
              <HighlightedSpan 
                key={`${idx}-${i}`}
                phrase={phrase}
                part={part}
                isActive={isActive}
              />
            );
          } else {
            if (part) newResult.push(part);
          }
        });
      } else {
        newResult.push(node);
      }
    });
    result = newResult;
  });

  return <span className="whitespace-pre-wrap leading-[1.8] tracking-tight">{result}</span>;
};

// ── Naver Mock ──
const MockNaver: React.FC<MockProps> = ({ text, phrases, activePhraseIndices, activeFilters, active, reviewRef }) => (
  <div className="bg-white text-[#191919] font-sans h-full flex flex-col">
    <div className="h-14 border-b border-gray-100 px-6 flex items-center justify-between flex-shrink-0 bg-white z-20">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-[#03c75a] rounded-lg flex items-center justify-center text-white font-black text-[12px]">N</div>
        <div className="text-[14px] font-bold">네이버 쇼핑 리뷰</div>
      </div>
      <div className="text-[12px] text-gray-400 font-medium">ID: naver_user***</div>
    </div>
    <div className="p-4 md:p-6 lg:p-8 flex-grow overflow-hidden flex flex-col">
      <div className="flex gap-6 border-b border-gray-100 mb-8 pb-3 flex-shrink-0">
        <span className="text-[#03c75a] text-sm font-bold border-b-2 border-[#03c75a] pb-3 -mb-[13px]">전체 리뷰 1,284</span>
      </div>
      <div
        ref={reviewRef}
        className={`rounded-3xl border transition-all duration-700 relative shrink min-h-0 flex flex-col ${active ? 'bg-white border-[#10b981] shadow-2xl shadow-emerald-500/10' : 'bg-[#fafafa] border-transparent'}`}
      >
        <div className="p-4 md:p-6 lg:p-8 flex gap-4 md:gap-6 shrink min-h-0">
          <div className="w-12 h-12 rounded-full bg-[#f0f1fd] flex items-center justify-center font-bold text-[#10b981] text-[13px] flex-shrink-0 border border-emerald-100">Best</div>
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-4 flex-shrink-0">
              <div className="font-bold text-[15px] text-gray-900">구매자99</div>
              <div className="flex text-amber-400 text-[10px] gap-0.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <FaStar key={idx} />
                ))}
              </div>
            </div>
            {/* Scrollable Area */}
            <div className="overflow-y-auto pr-4 custom-scrollbar-slim relative shrink min-h-0">
              <div className="text-[14px] text-gray-800 leading-[1.8] font-medium">
                <HighlightedText text={text} phrases={phrases} activePhraseIndices={activePhraseIndices} activeFilters={activeFilters} />
              </div>
              {/* Fade at bottom */}
              <div className="sticky bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ── Coupang Mock ──
const MockCoupang: React.FC<MockProps> = ({ text, phrases, activePhraseIndices, activeFilters, active, reviewRef }) => (
  <div className="bg-[#f2f3f5] font-sans h-full flex flex-col">
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 z-20">
      <div className="text-[#0076f5] font-black text-2xl italic tracking-tighter">COUPANG</div>
      <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
    </div>
    <div className="p-4 md:p-6 lg:p-8 flex-grow overflow-hidden flex flex-col">
      <div className="bg-white p-4 md:p-6 lg:p-8 rounded-2xl lg:rounded-3xl border border-gray-100 shadow-sm flex-grow overflow-hidden flex flex-col">
        <h3 className="text-xs font-bold mb-6 pb-3 border-b text-gray-300 uppercase tracking-[0.2em] flex-shrink-0">Customer Reviews</h3>
        <div
          ref={reviewRef}
          className={`rounded-3xl border-2 transition-all duration-700 shrink min-h-0 flex flex-col ${active ? 'bg-white border-[#0076f5] shadow-2xl shadow-blue-500/10' : 'bg-[#fcfcfc] border-transparent'}`}
        >
          <div className="p-4 md:p-6 lg:p-8 flex flex-col shrink min-h-0">
            <div className="flex items-center gap-3 mb-6 flex-shrink-0">
              <span className="bg-[#0076f5] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">BEST</span>
              <span className="text-[14px] font-bold text-[#111]">로켓배송매니아</span>
              <span className="text-[12px] text-gray-400">2024.05.01</span>
            </div>
            <div className="overflow-y-auto pr-4 custom-scrollbar-slim relative shrink min-h-0">
              <div className="text-[14px] text-[#333] leading-[1.8] font-medium">
                <HighlightedText text={text} phrases={phrases} activePhraseIndices={activePhraseIndices} activeFilters={activeFilters} />
              </div>
              <div className="sticky bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ── Insta Mock ──
const MockInsta: React.FC<MockProps> = ({ text, phrases, activePhraseIndices, activeFilters, active, reviewRef }) => (
  <div className="bg-white text-black h-full font-sans flex flex-col">
    <div className="border-b border-gray-100 px-5 py-4 flex items-center justify-between flex-shrink-0 bg-white z-20">
      <div className="font-bold text-xl tracking-tight">Instagram</div>
      <div className="flex gap-4">
        <span className="material-symbols-outlined">favorite</span>
        <span className="material-symbols-outlined">send</span>
      </div>
    </div>
    <div className="p-4 md:p-6 lg:p-8 flex-grow overflow-hidden flex flex-col">
      <div className="flex items-center gap-4 mb-6 flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px]">
          <div className="w-full h-full rounded-full bg-white p-[2px]">
            <div className="w-full h-full rounded-full bg-gray-100"></div>
          </div>
        </div>
        <span className="font-bold text-[15px]">daily_review_life</span>
      </div>
      <div
        ref={reviewRef}
        className={`rounded-[2.5rem] transition-all duration-700 shrink min-h-0 flex flex-col ${active ? 'bg-white shadow-2xl ring-1 ring-gray-100' : 'bg-gray-50'}`}
      >
        <div className="p-4 md:p-6 lg:p-8 flex flex-col shrink min-h-0">
          <div className="overflow-y-auto pr-4 custom-scrollbar-slim relative shrink min-h-0">
            <div className="text-[14px] leading-[1.8]">
              <span className="font-bold mr-2 text-[14px]">daily_review_life</span>
              <span className="font-medium text-gray-800 tracking-tight">
                <HighlightedText text={text} phrases={phrases} activePhraseIndices={activePhraseIndices} activeFilters={activeFilters} />
              </span>
            </div>
            <div className="sticky bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none opacity-60"></div>
          </div>
          <div className="mt-6 flex gap-4 text-gray-400 flex-shrink-0">
             <span className="text-[12px] font-bold">12시간 전</span>
             <span className="text-[12px] font-bold hover:text-gray-600 cursor-pointer transition-colors">번역 보기</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ── Other Mock ──
const MockOther: React.FC<MockProps> = ({ text, phrases, activePhraseIndices, activeFilters, active, reviewRef }) => (
  <div className="bg-[#f8f9fa] h-full p-4 md:p-6 lg:p-8 font-sans flex flex-col items-center justify-center">
    <div className="w-full max-w-[700px] flex-grow flex flex-col overflow-hidden">
      <div
        ref={reviewRef}
        className={`bg-white rounded-[3rem] border transition-all duration-700 shrink min-h-0 flex flex-col ${active ? 'border-emerald-500/30 shadow-2xl shadow-emerald-500/10' : 'border-gray-100'}`}
      >
        <div className="p-5 md:p-7 lg:p-10 flex flex-col shrink min-h-0">
          <div className="flex items-center gap-5 mb-8 flex-shrink-0">
             <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-300 text-3xl">person</span>
             </div>
             <div>
                <div className="font-bold text-[17px] text-gray-900 mb-0.5">익명 리뷰어</div>
                <div className="text-[12px] text-gray-400 font-medium tracking-wide">SOURCE: WEB COMMUNITY</div>
             </div>
          </div>
          <div className="overflow-y-auto pr-4 custom-scrollbar-slim relative shrink min-h-0">
            <div className="text-[15px] font-medium leading-[1.8] text-gray-800 tracking-tight">
              <HighlightedText text={text} phrases={phrases} activePhraseIndices={activePhraseIndices} activeFilters={activeFilters} />
            </div>
            <div className="sticky bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none opacity-60"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);


export const MockPlatformViewer: React.FC<Props> = ({ platform, originalText, highlightedPhrases, activeFilters = [], onComplete }) => {
  const myReviewRef = useRef<HTMLDivElement>(null);
  const [highlightActive, setHighlightActive] = useState(false);
  const [activePhraseIndices, setActivePhraseIndices] = useState<Set<number>>(new Set());
  
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  const sortedPhraseOrder = useMemo(() => {
    const typeOrder = ['sponsor_denial', 'exaggeration', 'negative_avoidance', 'ad_pattern', 'neutral'];
    return [...highlightedPhrases]
      .map((_, i) => i)
      .sort((a, b) => {
        const oa = typeOrder.indexOf(highlightedPhrases[a].type);
        const ob = typeOrder.indexOf(highlightedPhrases[b].type);
        return (oa === -1 ? 99 : oa) - (ob === -1 ? 99 : ob);
      });
  }, [highlightedPhrases]);

  useEffect(() => {
    const sequence = async () => {
      await new Promise(r => setTimeout(r, 800));
      if (myReviewRef.current) {
        // myReviewRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      await new Promise(r => setTimeout(r, 600));
      setHighlightActive(true);
      
      sortedPhraseOrder.forEach((phraseIdx, animOrder) => {
        setTimeout(() => {
          setActivePhraseIndices(prev => new Set([...prev, phraseIdx]));
          if (animOrder === sortedPhraseOrder.length - 1) {
            onCompleteRef.current();
          }
        }, animOrder * 200);
      });
    };
    sequence();
  }, [sortedPhraseOrder]);

  const sharedProps: MockProps = {
    text: originalText,
    phrases: highlightedPhrases,
    activePhraseIndices,
    activeFilters,
    active: highlightActive,
    reviewRef: myReviewRef,
  };

  return (
    <div className="w-full h-full bg-white flex flex-col relative overflow-hidden">
      <div className="flex-grow overflow-hidden">
        {platform === 'naver'   && <MockNaver   {...sharedProps} />}
        {platform === 'insta'   && <MockInsta   {...sharedProps} />}
        {platform === 'coupang' && <MockCoupang {...sharedProps} />}
        {platform === 'other'   && <MockOther   {...sharedProps} />}
      </div>
    </div>
  );
};

export default MockPlatformViewer;
