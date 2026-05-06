import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { HighlightedPhrase } from '../types/analysis';

interface Props {
  platform: string;
  originalText: string;
  highlightedPhrases: HighlightedPhrase[];
  onComplete: () => void;
}

interface MockProps {
  text: string;
  phrases: HighlightedPhrase[];
  activePhraseIndices: Set<number>;
  active: boolean;
  reviewRef: React.RefObject<HTMLDivElement>;
  targetRef: React.RefObject<HTMLDivElement>;
}

const TYPE_ORDER = ['sponsor_denial', 'exaggeration', 'negative_avoidance', 'ad_pattern', 'neutral'];

const HIGHLIGHT_COLORS: Record<string, string> = {
  sponsor_denial:      'rgba(91, 108, 244, 0.25)',  // 인디고 블루 연하게 (레퍼런스 스타일)
  exaggeration:        'rgba(251, 146, 60,  0.25)',  
  negative_avoidance:  'rgba(248, 113, 113, 0.25)',  
  ad_pattern:          'rgba(91, 108, 244, 0.20)',
  neutral:             'rgba(200, 200, 200, 0.20)',
};

const HighlightedText: React.FC<{
  text: string;
  phrases: HighlightedPhrase[];
  activePhraseIndices: Set<number>;
}> = ({ text, phrases, activePhraseIndices }) => {
  let result: React.ReactNode[] = [text];

  phrases.forEach((phrase, idx) => {
    const newResult: React.ReactNode[] = [];
    const color = HIGHLIGHT_COLORS[phrase.type] ?? HIGHLIGHT_COLORS.neutral;
    const isActive = activePhraseIndices.has(idx);

    result.forEach((node) => {
      if (typeof node === 'string') {
        const parts = node.split(phrase.text);
        parts.forEach((part, i) => {
          newResult.push(part);
          if (i < parts.length - 1) {
            newResult.push(
              <mark
                key={`${idx}-${i}`}
                style={{
                  background: `linear-gradient(${color}, ${color}) no-repeat`,
                  backgroundSize: isActive ? '100% 45%' : '0% 45%',
                  backgroundPosition: '0 72%',
                  transition: 'background-size 0.6s ease-in-out',
                  color: 'inherit',
                  padding: '0 1px',
                  borderRadius: '2px',
                  borderBottom: isActive ? `1.5px solid ${color.replace('0.25', '1')}` : 'none'
                }}
              >
                {phrase.text}
              </mark>
            );
          }
        });
      } else {
        newResult.push(node);
      }
    });
    result = newResult;
  });

  return <span className="whitespace-pre-wrap">{result}</span>;
};

// ── Naver Mock ──
const MockNaver: React.FC<MockProps> = ({ text, phrases, activePhraseIndices, active, reviewRef }) => (
  <div className="bg-white text-[#191919] font-sans h-full">
    <div className="h-14 border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-20">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-[#03c75a] rounded-lg flex items-center justify-center text-white font-black text-[12px]">N</div>
        <div className="text-[14px] font-bold">네이버 쇼핑 리뷰</div>
      </div>
      <div className="text-[12px] text-gray-400">ID: naver_user***</div>
    </div>
    <div className="p-8">
      <div className="flex gap-6 border-b border-gray-100 mb-8 pb-3">
        <span className="text-[#03c75a] text-sm font-bold border-b-2 border-[#03c75a] pb-3 -mb-[13px]">전체 리뷰 1,284</span>
      </div>
      <div className="space-y-6">
        <div
          ref={reviewRef}
          className={`p-8 rounded-2xl border transition-all duration-700 relative ${active ? 'bg-white border-[#10b981] shadow-xl shadow-emerald-500/10' : 'bg-[#fafafa] border-transparent'}`}
        >
          <div className="flex gap-5">
            <div className="w-10 h-10 rounded-full bg-[#f0f1fd] flex items-center justify-center font-bold text-[#10b981] text-[12px] flex-shrink-0 border border-emerald-100">Best</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="font-bold text-[14px] text-gray-900">구매자99</div>
                <div className="flex text-amber-400 text-[10px]">★★★★★</div>
              </div>
              <div className="text-[15px] text-gray-800 leading-[1.8] break-keep font-medium">
                <HighlightedText text={text} phrases={phrases} activePhraseIndices={activePhraseIndices} />
              </div>
            </div>
          </div>
        </div>
        <div className="h-64 opacity-10 grayscale select-none pointer-events-none">
           <div className="p-6 border-b border-gray-50 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2"><div className="h-3 w-20 bg-gray-200" /><div className="h-3 w-full bg-gray-100" /></div>
           </div>
        </div>
      </div>
    </div>
  </div>
);

// ── Coupang Mock ──
const MockCoupang: React.FC<MockProps> = ({ text, phrases, activePhraseIndices, active, reviewRef }) => (
  <div className="bg-[#f2f3f5] font-sans h-full">
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
      <div className="text-[#0076f5] font-black text-2xl italic tracking-tighter">COUPANG</div>
      <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
    </div>
    <div className="p-8">
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-sm font-bold mb-6 pb-3 border-b text-gray-400 uppercase tracking-widest">Customer Reviews</h3>
        <div
          ref={reviewRef}
          className={`my-6 p-8 rounded-2xl border-2 transition-all duration-700 ${active ? 'bg-white border-[#0076f5] shadow-xl shadow-blue-500/10' : 'bg-[#fcfcfc] border-transparent'}`}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-[#0076f5] text-white text-[10px] font-bold px-2 py-0.5 rounded">BEST</span>
            <span className="text-[13px] font-bold text-[#111]">로켓배송매니아</span>
            <span className="text-[11px] text-gray-400">2024.05.01</span>
          </div>
          <div className="text-[15px] text-[#333] leading-[1.8] break-keep font-medium">
            <HighlightedText text={text} phrases={phrases} activePhraseIndices={activePhraseIndices} />
          </div>
        </div>
        <div className="h-64 opacity-5">
           <div className="h-4 w-full bg-gray-200 mb-4" />
           <div className="h-4 w-3/4 bg-gray-200" />
        </div>
      </div>
    </div>
  </div>
);

// ── Insta Mock ──
const MockInsta: React.FC<MockProps> = ({ text, phrases, activePhraseIndices, active, reviewRef }) => (
  <div className="bg-white text-black h-full font-sans">
    <div className="border-b border-gray-100 px-5 py-3 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-20">
      <div className="font-bold text-xl">Instagram</div>
      <div className="flex gap-4">
        <span className="material-symbols-outlined text-[20px]">favorite</span>
        <span className="material-symbols-outlined text-[20px]">send</span>
      </div>
    </div>
    <div className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px]">
          <div className="w-full h-full rounded-full bg-white p-[2px]">
            <div className="w-full h-full rounded-full bg-gray-200"></div>
          </div>
        </div>
        <span className="font-bold text-[14px]">daily_review_life</span>
      </div>
      <div
        ref={reviewRef}
        className={`p-6 rounded-2xl transition-all duration-700 ${active ? 'bg-white shadow-xl ring-1 ring-gray-100' : 'bg-gray-50'}`}
      >
        <div className="text-[14px] leading-[1.8] break-keep">
          <span className="font-bold mr-2">daily_review_life</span>
          <span className="font-medium">
            <HighlightedText text={text} phrases={phrases} activePhraseIndices={activePhraseIndices} />
          </span>
        </div>
        <div className="mt-4 flex gap-3 text-gray-400">
           <span className="text-[11px] font-bold">12시간 전</span>
           <span className="text-[11px] font-bold">번역 보기</span>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-50 pt-6">
         <div className="flex gap-4 mb-4 opacity-20">
            <div className="w-8 h-8 rounded-full bg-gray-200" />
            <div className="flex-1 h-10 bg-gray-100 rounded-full" />
         </div>
      </div>
    </div>
  </div>
);

// ── Other Mock ──
const MockOther: React.FC<MockProps> = ({ text, phrases, activePhraseIndices, active, reviewRef }) => (
  <div className="bg-[#f8f9fa] h-full p-10 font-sans">
    <div className="max-w-[650px] mx-auto">
      <div
        ref={reviewRef}
        className={`bg-white rounded-[2rem] border-2 p-10 transition-all duration-700 ${active ? 'border-emerald-500 shadow-2xl shadow-emerald-500/5' : 'border-gray-100'}`}
      >
        <div className="flex items-center gap-4 mb-6">
           <div className="w-12 h-12 bg-gray-100 rounded-2xl"></div>
           <div>
              <div className="font-bold text-gray-900">익명 리뷰어</div>
              <div className="text-xs text-gray-400">Source: Web Community</div>
           </div>
        </div>
        <div className="text-[16px] font-medium leading-[1.9] text-gray-800 break-keep">
          <HighlightedText text={text} phrases={phrases} activePhraseIndices={activePhraseIndices} />
        </div>
      </div>
    </div>
  </div>
);


const MockPlatformViewer: React.FC<Props> = ({ platform, originalText, highlightedPhrases, onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const myReviewRef = useRef<HTMLDivElement>(null);
  const targetBtnRef = useRef<HTMLDivElement>(null);
  
  const [highlightActive, setHighlightActive] = useState(false);
  const [activePhraseIndices, setActivePhraseIndices] = useState<Set<number>>(new Set());
  
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  const sortedPhraseOrder = useMemo(() =>
    [...highlightedPhrases]
      .map((_, i) => i)
      .sort((a, b) => {
        const oa = TYPE_ORDER.indexOf(highlightedPhrases[a].type);
        const ob = TYPE_ORDER.indexOf(highlightedPhrases[b].type);
        return (oa === -1 ? 99 : oa) - (ob === -1 ? 99 : ob);
      }),
    [highlightedPhrases]
  );

  useEffect(() => {
    const sequence = async () => {
      // 1. 초기 지연 후 스크롤
      await new Promise(r => setTimeout(r, 800));
      if (myReviewRef.current) {
        myReviewRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      // 2. 검색 오버레이 대신 짧은 지연 후 바로 하이라이트 시작
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
    active: highlightActive,
    reviewRef: myReviewRef,
    targetRef: targetBtnRef,
  };

  return (
    <div className="w-full h-full bg-white flex flex-col relative overflow-hidden">
      <div ref={containerRef} className="flex-grow overflow-y-auto scroll-smooth custom-scrollbar">
        {platform === 'naver'   && <MockNaver   {...sharedProps} />}
        {platform === 'insta'   && <MockInsta   {...sharedProps} />}
        {platform === 'coupang' && <MockCoupang {...sharedProps} />}
        {platform === 'other'   && <MockOther   {...sharedProps} />}
      </div>
    </div>
  );
};

export default MockPlatformViewer;
