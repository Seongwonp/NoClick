import React, { useEffect, useRef, useState } from 'react';
import type { HighlightedPhrase } from '../types/analysis';

interface Props {
  platform: string;
  originalText: string;
  highlightedPhrases: HighlightedPhrase[];
  onComplete: () => void;
}

const HighlightedText: React.FC<{ text: string; phrases: HighlightedPhrase[]; active: boolean }> = ({ text, phrases, active }) => {
  let result: React.ReactNode[] = [text];

  phrases.forEach((phrase, idx) => {
    const newResult: React.ReactNode[] = [];
    result.forEach((node) => {
      if (typeof node === 'string') {
        const parts = node.split(phrase.text);
        parts.forEach((part, i) => {
          newResult.push(part);
          if (i < parts.length - 1) {
            newResult.push(
              <mark
                key={`${idx}-${i}`}
                className={`transition-all duration-[1500ms] ease-in-out px-1 rounded ${
                  active ? 'bg-yellow-300 text-black shadow-[0_0_8px_rgba(253,224,71,0.8)]' : 'bg-transparent text-inherit'
                }`}
                title={phrase.reason}
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
const MockNaver: React.FC<{ text: string; phrases: HighlightedPhrase[]; active: boolean; reviewRef: any; targetRef: any }> = ({ text, phrases, active, reviewRef, targetRef }) => {
  return (
    <div className="bg-white text-[#191919] font-['Malgun_Gothic']">
      {/* Naver GNB */}
      <div className="h-14 border-b border-gray-100 px-6 flex items-center gap-4 sticky top-0 bg-white z-20">
        <div className="w-6 h-6 bg-[#03c75a] rounded flex items-center justify-center text-white font-black text-xs">N</div>
        <div className="text-lg font-bold">베스트샵 공식스토어</div>
        <div className="ml-auto flex gap-4 text-gray-400">
          <span className="material-symbols-outlined text-[20px]">search</span>
          <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
        </div>
      </div>
      
      {/* Product Info Section */}
      <div className="p-8 border-b border-gray-100 flex gap-8">
        <div className="w-72 h-72 bg-gray-100 rounded-lg overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200"></div>
        </div>
        <div className="flex-1">
          <div className="text-gray-400 text-sm mb-2">무선 이어폰 / 블루투스 5.3</div>
          <h2 className="text-2xl font-bold mb-4">프리미엄 노이즈 캔슬링 이어폰 에어핏 프로</h2>
          <div className="text-3xl font-black text-emerald-600 mb-6">189,000원</div>
          <div className="space-y-3">
            <div className="flex gap-4"><span className="w-16 text-gray-400 text-xs">구매혜택</span><span className="text-xs">적립금 1,890원</span></div>
            <div className="flex gap-4"><span className="w-16 text-gray-400 text-xs">배송안내</span><span className="text-xs font-bold">내일(수) 도착 보장</span></div>
          </div>
        </div>
      </div>

      {/* Review Tab Area */}
      <div className="p-6">
        <div className="flex gap-8 border-b border-gray-200 mb-8 pb-4">
          <span className="text-gray-400 font-bold">상세정보</span>
          <span className="text-[#03c75a] font-bold border-b-2 border-[#03c75a] pb-4 -mb-[18px]">리뷰 2,841</span>
          <span className="text-gray-400 font-bold">Q&A</span>
        </div>

        <div className="space-y-6">
          <div className="py-6 border-b border-gray-50 flex gap-5 opacity-60">
            <div className="w-10 h-10 rounded-full bg-gray-100"></div>
            <div className="flex-1">
              <div className="font-bold text-[13px] mb-1">naver_user</div>
              <div className="text-[13px] text-gray-500">배송도 빠르고 음질도 정말 좋네요. 아주 만족합니다!</div>
            </div>
          </div>

          <div 
            ref={reviewRef} 
            className={`py-8 px-6 rounded-2xl border transition-all duration-700 relative overflow-hidden ${active ? 'bg-white border-primary shadow-lg scale-[1.02]' : 'bg-gray-50 border-transparent'}`}
          >
            {!active && (
              <div 
                ref={targetRef}
                className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center group"
              >
                <div className="bg-primary text-white px-4 py-2 rounded-full font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">이 리뷰 분석하기</div>
              </div>
            )}
            <div className="flex gap-5">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-600">구매</div>
              <div className="flex-1">
                <div className="font-bold text-[13px] text-gray-800 mb-1">구매자123</div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[#ffbb00] text-[14px]">★★★★★</span>
                  <span className="text-gray-300 text-[12px]">|</span>
                  <span className="text-gray-400 text-[12px]">2024.05.01</span>
                </div>
                <div className="text-[14px] text-gray-800 leading-[1.8] break-keep">
                  <HighlightedText text={text} phrases={phrases} active={active} />
                </div>
              </div>
            </div>
          </div>

          <div className="py-6 border-b border-gray-50 flex gap-5 opacity-40">
            <div className="w-10 h-10 rounded-full bg-gray-100"></div>
            <div className="flex-1">
              <div className="font-bold text-[13px] mb-1">apple_fan</div>
              <div className="text-[13px] text-gray-500">가성비 최고입니다. 디자인도 깔끔하고 통화 품질도 나쁘지 않아요.</div>
            </div>
          </div>
          <div className="h-64"></div>
        </div>
      </div>
    </div>
  );
};

// ── Coupang Mock ──
const MockCoupang: React.FC<{ text: string; phrases: HighlightedPhrase[]; active: boolean; reviewRef: any; targetRef: any }> = ({ text, phrases, active, reviewRef, targetRef }) => {
  return (
    <div className="bg-[#f7f8fa] font-['Noto_Sans_KR']">
      {/* Coupang Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-6 sticky top-0 z-20">
        <div className="text-[#0076f5] font-black text-2xl tracking-tighter italic">COUPANG</div>
        <div className="flex-grow bg-[#f0f0f0] rounded-sm px-4 py-2 text-xs text-gray-400">찾고 싶은 상품을 검색하세요</div>
        <div className="flex gap-4 text-gray-400">
          <span className="material-symbols-outlined text-[20px]">person</span>
          <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
        </div>
      </div>

      <div className="p-8 max-w-4xl mx-auto">
        {/* Product Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8 flex gap-8">
          <div className="w-40 h-40 bg-gray-50 rounded"></div>
          <div>
            <div className="text-[#0076f5] text-xs font-bold mb-1">로켓배송</div>
            <h2 className="text-lg font-bold mb-4">애플 정품 2024 에어팟 프로 2세대 USB-C (MagSafe 케이스 모델)</h2>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#ffb800] text-sm">★★★★★</span>
              <span className="text-[#0076f5] text-xs font-bold">78,241개 상품평</span>
            </div>
            <div className="text-2xl font-black text-[#cb1400]">299,000원</div>
          </div>
        </div>

        {/* Review Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[800px]">
          <h3 className="text-lg font-bold mb-6 pb-4 border-b">상품평</h3>
          
          <div className="py-6 border-b border-gray-50 opacity-40">
            <div className="font-bold text-[13px] mb-2">쿠팡매니아</div>
            <div className="text-[13px] text-gray-600 italic mb-2">"배송 진짜 빠르네요. 어제 밤에 시켰는데 오늘 새벽에 왔어요."</div>
          </div>

          <div 
            ref={reviewRef} 
            className={`my-6 p-6 rounded-xl border-2 transition-all duration-700 relative overflow-hidden ${active ? 'bg-white border-[#0076f5] shadow-xl' : 'bg-gray-50 border-transparent'}`}
          >
            {!active && (
              <div 
                ref={targetRef}
                className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center group"
              >
                <div className="bg-[#0076f5] text-white px-6 py-3 rounded-full font-black text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">클릭하여 분석 시작</div>
              </div>
            )}
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#0076f5] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">베스트</span>
              <span className="text-[14px] font-bold text-[#111]">로켓배송짱</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#ffb800] text-sm tracking-[1px]">★★★★★</span>
              <span className="text-[11px] text-[#bbb]">2024.05.01</span>
            </div>
            <div className="text-[14px] text-[#333] leading-[1.8] break-keep">
              <HighlightedText text={text} phrases={phrases} active={active} />
            </div>
          </div>

          <div className="py-6 border-b border-gray-50 opacity-20">
            <div className="font-bold text-[13px] mb-2">쇼핑왕</div>
            <div className="text-[13px] text-gray-600 italic">"포장이 좀 부실하게 오긴 했는데 상품은 멀쩡해서 다행입니다."</div>
          </div>
          <div className="h-64"></div>
        </div>
      </div>
    </div>
  );
};

// ── Insta Mock ──
const MockInsta: React.FC<{ text: string; phrases: HighlightedPhrase[]; active: boolean; reviewRef: any; targetRef: any }> = ({ text, phrases, active, reviewRef, targetRef }) => {
  return (
    <div className="bg-black text-white font-[-apple-system] min-h-screen">
      {/* Insta Header */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 bg-black z-20">
        <div className="text-xl font-black italic tracking-tighter">Instagram</div>
        <div className="flex gap-6">
          <span className="material-symbols-outlined">favorite</span>
          <span className="material-symbols-outlined">send</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto py-8">
        <div className="flex items-center gap-3 mb-4 px-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-[2px]">
            <div className="w-full h-full bg-black rounded-full border border-black"></div>
          </div>
          <span className="font-bold text-sm">jiyeon_daily</span>
          <span className="text-gray-500 text-xs">• 2일 전</span>
        </div>

        <div className="aspect-square bg-gray-900 w-full mb-6"></div>

        <div className="px-4">
          <div className="flex gap-4 mb-4">
            <span className="material-symbols-outlined">favorite</span>
            <span className="material-symbols-outlined">chat_bubble</span>
            <span className="material-symbols-outlined">send</span>
            <span className="material-symbols-outlined ml-auto">bookmark</span>
          </div>
          <div className="font-bold text-sm mb-4">좋아요 1,241개</div>

          <div className="space-y-4">
            <div className="text-sm opacity-40">
              <span className="font-bold mr-2">minseo_2_</span> 진짜 너무 이쁘다 🥹 나도 빨리 가고 싶어
            </div>

            <div 
              ref={reviewRef} 
              className={`p-4 rounded-2xl border transition-all duration-700 relative overflow-hidden ${active ? 'bg-gray-900 border-gray-700' : 'bg-transparent border-transparent'}`}
            >
              {!active && (
                <div 
                  ref={targetRef}
                  className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center group"
                >
                  <div className="bg-white text-black px-4 py-2 rounded-full font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">포스트 분석하기</div>
                </div>
              )}
              <div className="text-sm">
                <span className="font-bold mr-2 text-primary-container">jiyeon_daily</span>
                <HighlightedText text={text} phrases={phrases} active={active} />
              </div>
            </div>

            <div className="text-sm opacity-20">
              <span className="font-bold mr-2">kim_sungyun</span> 저 이 사진 배경화면 해도 돼요?? 🙏🙏
            </div>
            <div className="h-64"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MockPlatformViewer: React.FC<Props> = ({ platform, originalText, highlightedPhrases, onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const myReviewRef = useRef<HTMLDivElement>(null);
  const targetBtnRef = useRef<HTMLDivElement>(null);
  const [highlightActive, setHighlightActive] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // 1단계: 자연스러운 서핑 (상품 정보부터 스크롤)
    const scrollTimer = setTimeout(() => {
      if (myReviewRef.current && containerRef.current) {
        myReviewRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // 2단계: 리뷰 발견 및 마우스 오버/클릭 연출
        setTimeout(() => {
          setIsClicking(true);
          
          // 3단계: 클릭 액션 후 결과로 전환
          setTimeout(() => {
            setHighlightActive(true);
            onComplete();
          }, 800);
        }, 1500);
      }
    }, 1000);

    return () => clearTimeout(scrollTimer);
  }, [onComplete]);

  return (
    <div className="w-full h-[700px] bg-white flex flex-col relative overflow-hidden group">
      {/* Cinematic Mouse Pointer Animation */}
      {isClicking && !highlightActive && (
        <div className="absolute inset-0 z-[100] pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary/20 rounded-full animate-ping border border-primary/40"></div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary/40 rounded-full animate-pulse border-2 border-primary/60"></div>
        </div>
      )}

      {/* Loading Overlay (Only briefly before surfing starts) */}
      {!isClicking && !highlightActive && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] bg-white/90 backdrop-blur px-6 py-2 rounded-full border border-gray-100 shadow-xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <span className="text-[12px] font-bold text-on-surface">해당 플랫폼으로 이동하여 리뷰 탐색 중...</span>
        </div>
      )}
      
      <div ref={containerRef} className="flex-grow overflow-y-auto scroll-smooth custom-scrollbar">
        {platform === 'naver' && <MockNaver text={originalText} phrases={highlightedPhrases} active={highlightActive} reviewRef={myReviewRef} targetRef={targetBtnRef} />}
        {platform === 'insta' && <MockInsta text={originalText} phrases={highlightedPhrases} active={highlightActive} reviewRef={myReviewRef} targetRef={targetBtnRef} />}
        {(platform === 'coupang' || platform === 'other') && <MockCoupang text={originalText} phrases={highlightedPhrases} active={highlightActive} reviewRef={myReviewRef} targetRef={targetBtnRef} />}
      </div>
    </div>
  );
};

export default MockPlatformViewer;
