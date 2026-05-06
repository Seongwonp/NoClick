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
  <div className="bg-white text-[#191919] font-sans">
    <div className="h-12 border-b border-gray-100 px-6 flex items-center gap-3 sticky top-0 bg-white z-20">
      <div className="w-5 h-5 bg-[#03c75a] rounded flex items-center justify-center text-white font-black text-[10px]">N</div>
      <div className="text-sm font-bold">Naver Shopping</div>
    </div>
    <div className="p-6">
      <div className="flex gap-6 border-b border-gray-100 mb-6 pb-2">
        <span className="text-[#03c75a] text-xs font-bold border-b-2 border-[#03c75a] pb-2 -mb-[9px]">리뷰 2,841</span>
      </div>
      <div className="space-y-4">
        <div className="py-4 border-b border-gray-50 flex gap-4 opacity-30">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0"></div>
          <div className="flex-1"><div className="font-bold text-[12px] mb-1">naver_user</div></div>
        </div>
        <div
          ref={reviewRef}
          className={`py-6 px-5 rounded-xl border transition-all duration-700 relative ${active ? 'bg-white border-[#5b6cf4] shadow-md' : 'bg-[#fafafa] border-transparent'}`}
        >
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#f0f1fd] flex items-center justify-center font-bold text-[#5b6cf4] text-[11px] flex-shrink-0">Best</div>
            <div className="flex-1">
              <div className="font-bold text-[12px] text-gray-800 mb-2">구매자123</div>
              <div className="text-[13px] text-gray-800 leading-[1.8] break-keep">
                <HighlightedText text={text} phrases={phrases} activePhraseIndices={activePhraseIndices} />
              </div>
            </div>
          </div>
        </div>
        <div className="h-64"></div>
      </div>
    </div>
  </div>
);

// ── Coupang Mock ──
const MockCoupang: React.FC<MockProps> = ({ text, phrases, activePhraseIndices, active, reviewRef }) => (
  <div className="bg-[#f7f8fa] font-sans">
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 sticky top-0 z-20">
      <div className="text-[#0076f5] font-black text-xl italic tracking-tighter">COUPANG</div>
    </div>
    <div className="p-6">
      <div className="bg-white p-6 rounded-lg border border-gray-100">
        <h3 className="text-sm font-bold mb-4 pb-2 border-b">상품평</h3>
        <div
          ref={reviewRef}
          className={`my-4 p-5 rounded-lg border-2 transition-all duration-700 ${active ? 'bg-white border-[#5b6cf4] shadow-md' : 'bg-[#fcfcfc] border-transparent'}`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#0076f5] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">Best</span>
            <span className="text-[12px] font-bold text-[#111]">로켓배송짱</span>
          </div>
          <div className="text-[13px] text-[#333] leading-[1.8] break-keep">
            <HighlightedText text={text} phrases={phrases} activePhraseIndices={activePhraseIndices} />
          </div>
        </div>
        <div className="h-64"></div>
      </div>
    </div>
  </div>
);

// ── Insta Mock ──
const MockInsta: React.FC<MockProps> = ({ text, phrases, activePhraseIndices, active, reviewRef }) => (
  <div className="bg-white text-black h-full overflow-hidden font-sans">
    <div className="border-b border-gray-100 px-4 py-2 flex items-center justify-between sticky top-0 bg-white z-20">
      <div className="font-bold italic text-lg">Instagram</div>
    </div>
    <div className="overflow-y-auto h-full pb-20 p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-gray-100"></div>
        <span className="font-semibold text-[13px]">user_daily</span>
      </div>
      <div
        ref={reviewRef}
        className={`p-4 rounded-xl transition-all duration-700 ${active ? 'bg-[#f0f1fd] ring-1 ring-[#5b6cf4]' : 'bg-[#fafafa]'}`}
      >
        <div className="text-[13px] leading-[1.75] break-keep">
          <span className="font-semibold mr-1.5">user_daily</span>
          <HighlightedText text={text} phrases={phrases} activePhraseIndices={activePhraseIndices} />
        </div>
      </div>
      <div className="h-64"></div>
    </div>
  </div>
);

// ── Other Mock ──
const MockOther: React.FC<MockProps> = ({ text, phrases, activePhraseIndices, active, reviewRef }) => (
  <div className="bg-[#f5f6f8] h-full p-6 font-sans">
    <div className="max-w-[600px] mx-auto">
      <div
        ref={reviewRef}
        className={`bg-white rounded-xl border p-6 transition-all duration-700 ${active ? 'border-[#5b6cf4] shadow-lg' : 'border-gray-200'}`}
      >
        <div className="text-[14px] font-medium leading-[1.8] text-[#1c1e24] break-keep">
          <HighlightedText text={text} phrases={phrases} activePhraseIndices={activePhraseIndices} />
        </div>
      </div>
      <div className="h-64"></div>
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
