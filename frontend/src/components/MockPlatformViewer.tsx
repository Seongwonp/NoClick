import React, { useEffect, useRef, useState } from 'react';
import type { HighlightedPhrase } from '../types/analysis';
interface Props {
  platform: string;
  originalText: string;
  highlightedPhrases: HighlightedPhrase[];
  onComplete: () => void;
  trustScore: number;
}

const HighlightedText: React.FC<{ text: string; phrases: HighlightedPhrase[]; active: boolean }> = ({ text, phrases, active }) => {

  if (!phrases || phrases.length === 0) return <span className="whitespace-pre-wrap">{text}</span>;

  // 긴 문구부터 매칭되도록 정렬
  const sortedPhrases = [...phrases].sort((a, b) => b.text.length - a.text.length);
  const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // 패턴 생성 (유연한 공백 처리)
  const pattern = sortedPhrases
    .map(p => escapeRegExp(p.text.trim()).replace(/\s+/g, '[\\s\\n\\r]+'))
    .filter(p => p.length > 0)
    .join('|');
    
  if (!pattern) return <span className="whitespace-pre-wrap">{text}</span>;

  const regex = new RegExp(`(${pattern})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className="whitespace-pre-wrap relative z-0">
      {parts.map((part, i) => {
        if (!part) return null;

        const matchingPhrase = sortedPhrases.find(p => {
          const pRegex = new RegExp(escapeRegExp(p.text.trim()).replace(/\s+/g, '[\\s\\n\\r]+'), 'gi');
          return pRegex.test(part);
        });

        if (matchingPhrase) {
          return (
            <span
              key={`${i}-${part.substring(0, 5)}`}
              className={`inline transition-all duration-700 ${active ? 'font-semibold text-black' : ''}`}
              style={{
                backgroundImage: 'linear-gradient(to right, rgba(254, 240, 138, 0.5), rgba(254, 240, 138, 0.5))',
                backgroundSize: active ? '100% 85%' : '0% 85%',
                backgroundPosition: '0 90%',
                backgroundRepeat: 'no-repeat',
                transition: 'background-size 1.2s cubic-bezier(0.65, 0, 0.35, 1), color 0.5s',
                padding: '0 1px'
              }}
            >
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
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
          <div className="text-3xl font-black text-[#059669] mb-6">189,000원</div>
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
            className={`py-8 px-6 rounded-2xl transition-all duration-700 relative overflow-hidden ${active ? 'bg-emerald-50/50 ring-1 ring-emerald-100' : 'bg-transparent'}`}
          >
            {!active && (
              <div 
                ref={targetRef}
                className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center group"
              >
                <div className="bg-[#03c75a] text-white px-5 py-2.5 rounded-full font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">리뷰 본문 분석하기</div>
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs uppercase">NP</div>
                <div>
                  <div className="font-bold text-[14px]">블로그마스터_현</div>
                  <div className="text-[11px] text-gray-400 uppercase tracking-tighter font-mono">Verified Purchase · 2024.05.09</div>
                </div>
              </div>
              <div className="flex text-[#ffb800] text-sm tracking-tight">★★★★★</div>
            </div>
            <div className="text-[15px] leading-[1.8] text-[#333] break-keep">
              <HighlightedText text={text} phrases={phrases} active={active} />
            </div>
          </div>

          <div className="py-6 opacity-20">
            <div className="font-bold text-[13px] mb-1">trend_setter</div>
            <div className="text-[13px] text-gray-500 italic">"색상이 고민됐는데 화이트로 사길 잘했네요. 예뻐요!"</div>
          </div>
          <div className="h-40"></div>
        </div>
      </div>
    </div>
  );
};

// ── Coupang Mock ──
const MockCoupang: React.FC<{ text: string; phrases: HighlightedPhrase[]; active: boolean; reviewRef: any; targetRef: any }> = ({ text, phrases, active, reviewRef, targetRef }) => {
  return (
    <div className="bg-white text-[#111] font-sans min-h-full">
      {/* Coupang Header */}
      <div className="h-14 border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 bg-white z-20">
        <div className="text-xl font-black text-[#0076f5] italic tracking-tighter">COUPANG</div>
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
          <span className="material-symbols-outlined text-[18px] text-gray-400">search</span>
          <div className="w-40 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex gap-6 mb-8 border-b border-gray-100 pb-8">
          <div className="w-32 h-32 bg-gray-100 rounded-lg shrink-0"></div>
          <div>
            <div className="text-[#0076f5] text-xs font-bold mb-1">로켓배송</div>
            <h2 className="text-lg font-bold mb-4">애플 정품 2024 에어팟 프로 2세대 USB-C (MagSafe 케이스 모델)</h2>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#ffb800] text-sm">★★★★★</span>
              <span className="text-[#03c75a] text-xs font-bold">78,241개 상품평</span>
            </div>
            <div className="text-2xl font-black text-[#cb1400]">299,000원</div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base">상품평 (78,241)</h3>
            <span className="text-[#0076f5] text-sm font-bold">필터 ▾</span>
          </div>

          <div 
            ref={reviewRef}
            className={`p-6 rounded-2xl border transition-all duration-700 relative overflow-hidden ${active ? 'bg-blue-50/30 border-blue-100' : 'border-gray-50 bg-transparent'}`}
          >
            {!active && (
              <div 
                ref={targetRef}
                className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center group"
              >
                <div className="bg-[#0076f5] text-white px-4 py-2 rounded-full font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">상품평 분석하기</div>
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
    <div className="bg-black text-white font-[-apple-system] min-h-full">
      {/* Insta Header */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 bg-black z-20">
        <div className="text-xl font-black italic tracking-tighter">Instagram</div>
        <div className="flex gap-6">
          <span className="material-symbols-outlined">favorite</span>
          <span className="material-symbols-outlined">send</span>
        </div>
      </div>

      <div className="max-w-[480px] mx-auto py-8 px-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-[2px]">
            <div className="w-full h-full bg-black rounded-full border border-black"></div>
          </div>
          <span className="font-black text-white text-sm">jiyeon_daily</span>
          <span className="text-gray-500 text-xs">• 2일 전</span>
        </div>

        <div className="aspect-square bg-gray-900 w-full mb-6 rounded-sm"></div>

        <div>
          <div className="flex gap-4 mb-4">
            <span className="material-symbols-outlined">favorite</span>
            <span className="material-symbols-outlined">chat_bubble</span>
            <span className="material-symbols-outlined">send</span>
            <span className="material-symbols-outlined ml-auto">bookmark</span>
          </div>
          <div className="font-bold text-sm mb-4">좋아요 1,241개</div>

          <div className="space-y-4">
            <div className="text-sm opacity-40 leading-relaxed">
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
              <div className="text-sm leading-relaxed break-words">
                <span className="font-black mr-2 text-white">jiyeon_daily</span>
                <HighlightedText text={text} phrases={phrases} active={active} />
              </div>
            </div>

            <div className="text-sm opacity-20 leading-relaxed">
              <span className="font-bold mr-2">kim_sungyun</span> 저 이 사진 배경화면 해도 돼요?? 🙏🙏
            </div>
            <div className="h-40"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── General/Other Mock (Simple Blog Style) ──
const MockGeneral: React.FC<{ text: string; phrases: HighlightedPhrase[]; active: boolean; reviewRef: any; targetRef: any }> = ({ text, phrases, active, reviewRef, targetRef }) => {
  return (
    <div className="bg-[#fcfcfc] text-[#333] font-sans min-h-full pb-20">
      {/* Simple Header */}
      <div className="h-16 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[18px]">article</span>
          </div>
          <span className="font-bold text-gray-800 tracking-tight">Review Reader</span>
        </div>
        <div className="flex gap-4 text-gray-400">
          <span className="material-symbols-outlined text-[20px]">share</span>
          <span className="material-symbols-outlined text-[20px]">more_horiz</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-12 px-6">
        {/* Article Header */}
        <header className="mb-10 pb-8 border-b border-gray-100">
          <div className="flex items-center gap-2 text-primary font-bold text-xs mb-3 uppercase tracking-wider">
            <span>Community</span>
            <span className="text-gray-300">•</span>
            <span>Real Review</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 leading-tight mb-6">
            사용자가 직접 작성한 솔직한 리뷰 본문입니다
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div className="text-sm">
              <p className="font-bold text-gray-800">익명 사용자</p>
              <p className="text-gray-400 text-xs">2024.05.10 · 조회 1,240</p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div 
          ref={reviewRef}
          className={`relative rounded-3xl transition-all duration-1000 ${
            active 
              ? 'bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] ring-1 ring-gray-100 scale-[1.01]' 
              : 'bg-transparent'
          }`}
        >
          {!active && (
            <div 
              ref={targetRef}
              className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center group"
            >
              <div className="bg-gray-900 text-white px-6 py-3 rounded-full font-bold text-sm opacity-0 group-hover:opacity-100 transition-all shadow-xl transform translate-y-2 group-hover:translate-y-0">
                문맥 분석하기
              </div>
            </div>
          )}
          
          <div className={`text-[16px] leading-[1.8] text-gray-700 break-keep ${active ? 'opacity-100' : 'opacity-80'}`}>
            <HighlightedText text={text} phrases={phrases} active={active} />
          </div>
          
          {active && (
            <div className="mt-12 pt-8 border-t border-dashed border-gray-100 flex items-center justify-between">
              <div className="flex gap-4">
                <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                  <span className="material-symbols-outlined text-[16px]">thumb_up</span> 도움돼요 24
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                  <span className="material-symbols-outlined text-[16px]">chat</span> 댓글 8
                </span>
              </div>
              <span className="text-[10px] text-gray-300 font-mono tracking-tighter uppercase">No-Click Analysis System Verified</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MockPlatformViewer: React.FC<Props> = ({ platform, originalText, highlightedPhrases, onComplete, trustScore }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const myReviewRef = useRef<HTMLDivElement>(null);
  const targetBtnRef = useRef<HTMLDivElement>(null);
  const [highlightActive, setHighlightActive] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [showCleanBadge, setShowCleanBadge] = useState(true);

  useEffect(() => {
    // 초기화 (텍스트가 바뀌면 다시 시작)
    setHighlightActive(false);
    setIsClicking(false);
    setShowCleanBadge(true);

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
  }, [onComplete, originalText]); // 텍스트가 바뀌면(히스토리 클릭 시) 애니메이션 재실행

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
        {platform === 'coupang' && <MockCoupang text={originalText} phrases={highlightedPhrases} active={highlightActive} reviewRef={myReviewRef} targetRef={targetBtnRef} />}
        {platform === 'other' && <MockGeneral text={originalText} phrases={highlightedPhrases} active={highlightActive} reviewRef={myReviewRef} targetRef={targetBtnRef} />}
      </div>

      {/* 청정리뷰 인증 마크 Overlay (상단 배치) */}
      {highlightActive && highlightedPhrases.length === 0 && showCleanBadge && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[80] pointer-events-auto w-full px-12 text-center group">
          <div className="relative inline-flex bg-emerald-500/95 text-white px-8 py-5 rounded-[2rem] shadow-[0_25px_60px_rgba(16,185,129,0.4)] items-center gap-5 border-2 border-white/40 backdrop-blur-2xl animate-in fade-in slide-in-from-top-4 duration-1000 mx-auto">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowCleanBadge(false)}
              className="absolute -top-2 -right-2 w-8 h-8 bg-white text-emerald-600 rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-50 transition-colors cursor-pointer border border-emerald-100 opacity-0 group-hover:opacity-100"
            >
              <span className="material-symbols-outlined text-[18px] font-bold">close</span>
            </button>

            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0 shadow-inner">
              <span className="material-symbols-outlined text-3xl animate-pulse">verified</span>
            </div>
            <div className="flex flex-col items-start text-left">
              <h3 className="text-xl font-black tracking-tight leading-tight">판독 완료!</h3>
              <p className="text-sm font-bold opacity-90 whitespace-nowrap">
                <span className="text-2xl mr-1">{trustScore}%</span>의 확률로 광고가 아닙니다
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockPlatformViewer;
