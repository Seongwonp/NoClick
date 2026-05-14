import React from 'react';
import type { AnalysisResponse } from '../../types/analysis';
import { FaFlag, FaLightbulb, FaExclamationTriangle, FaChartLine, FaSearch, FaRegLightbulb } from 'react-icons/fa';
import { MdPsychology } from 'react-icons/md';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar,
  Tooltip,
} from 'recharts';

interface DetailedAnalysisProps {
  analysisResult: AnalysisResponse;
}

const RISK_ICONS = [FaFlag, MdPsychology, FaLightbulb, FaExclamationTriangle, FaChartLine];

const DetailedAnalysis: React.FC<DetailedAnalysisProps> = ({ analysisResult }) => {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [cardsPerView, setCardsPerView] = React.useState(2);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const items = analysisResult.hidden_negatives || [];

  const handleScroll = (direction: 'prev' | 'next') => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      // 2개씩 보여주므로 컨테이너 너비만큼 이동 (한 페이지 단위)
      const scrollAmount = container.offsetWidth;
      container.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  React.useEffect(() => {
    const updateCardsPerView = () => {
      setCardsPerView(window.innerWidth < 640 ? 1 : 2);
    };
    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  React.useEffect(() => {
    const handleScrollEvent = () => {
      if (scrollRef.current) {
        const firstCard = scrollRef.current.firstElementChild as HTMLElement | null;
        if (!firstCard) return;
        const gap = Number.parseFloat(getComputedStyle(scrollRef.current).columnGap || '0') || 0;
        const cardWidth = firstCard.offsetWidth + gap;
        const index = Math.round(scrollRef.current.scrollLeft / cardWidth);
        setCurrentIndex(index);
      }
    };
    const container = scrollRef.current;
    container?.addEventListener('scroll', handleScrollEvent);
    return () => container?.removeEventListener('scroll', handleScrollEvent);
  }, []);

  const ds = analysisResult.dimension_scores;
  const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));
  const authenticity = clamp(ds?.authenticity ?? analysisResult.trust_score);
  const information = clamp(ds?.information ?? 50);
  const specificity = clamp(ds?.specificity ?? 50);
  const exaggeration = clamp(ds?.exaggeration ?? analysisResult.ad_probability ?? 50);
  const objectivity = clamp(100 - exaggeration);

  const radarData = [
    { subject: '신뢰도', A: clamp(analysisResult.trust_score) },
    { subject: '객관성', A: objectivity },
    { subject: '단점포함', A: specificity },
    { subject: '정보량', A: information },
    { subject: '문맥일치', A: authenticity },
  ];

  const CustomTick = (props: any) => {
    const { x, y, payload } = props;
    const dataItem = radarData.find(d => d.subject === payload.value);
    const isLow = dataItem && dataItem.A < 50;
    return (
      <text x={x} y={y} dy={4} textAnchor="middle" fill={isLow ? '#ff7f50' : '#94a3b8'} fontSize={11} fontWeight={700}>
        {payload.value}
      </text>
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      
      {/* 숨겨진 단점 (Grid of Visual Cards) */}
      <div>
        <div className="flex items-center gap-2 mb-3 px-2">
          <FaSearch className="text-[18px] text-gray-700" />
          <h3 className="text-[16px] font-extrabold text-gray-800 tracking-tight">별점 뒤에 숨겨진 실질 리스크</h3>
        </div>
        
        <div className="relative group">
          {/* Navigation Arrows (Only if 3+ items) */}
          {items.length > cardsPerView && (
            <>
              <button 
                onClick={() => handleScroll('prev')}
                className={`absolute left-[-12px] top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center transition-all ${currentIndex === 0 ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 hover:scale-110 active:scale-95'}`}
              >
                <span className="material-symbols-outlined text-[20px] text-gray-700">chevron_left</span>
              </button>
              <button 
                onClick={() => handleScroll('next')}
                className={`absolute right-[-12px] top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center transition-all ${currentIndex >= items.length - cardsPerView ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 hover:scale-110 active:scale-95'}`}
              >
                <span className="material-symbols-outlined text-[20px] text-gray-700">chevron_right</span>
              </button>
            </>
          )}

          <div 
            ref={scrollRef}
            className={`
              ${items.length > 2 
                ? 'flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-3 pb-2' 
                : 'grid grid-cols-1 md:grid-cols-2 gap-3'}
            `}
          >
            {items.map((n, i) => {
              const isExpanded = expandedIndex === i;
              const RiskIcon = RISK_ICONS[i % RISK_ICONS.length];
              return (
              <div
                key={i}
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                className={`
                  bg-white/60 backdrop-blur-lg p-5 rounded-[28px] border border-white/50 shadow-[0_8px_30px_rgba(251,146,60,0.03)] flex flex-col gap-2 hover:-translate-y-1 transition-all cursor-pointer group shrink-0
                  ${items.length > 2 ? 'snap-start w-[86%] sm:w-[calc(50%-6px)]' : 'w-full'}
                `}
              >                <div className="flex justify-between items-start mb-1">
                  <span className="text-[22px] bg-[#fb923c]/10 w-10 h-10 rounded-[16px] flex items-center justify-center border border-[#fb923c]/10">
                    <RiskIcon className="text-[16px] text-[#fb923c]" />
                  </span>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[11px] font-bold text-[#fb923c] bg-[#fb923c]/10 px-2.5 py-1 rounded-full border border-[#fb923c]/20">
                      신뢰도 {n.confidence || 85}%
                    </span>
                    {items.length >= 3 && (
                      <span className="text-[9px] text-gray-300 font-bold px-1">{i + 1} / {items.length}</span>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-h-[108px]">
                  <p className={`text-[13px] font-extrabold text-gray-800 leading-snug mb-1.5 transition-all ${isExpanded ? '' : 'line-clamp-2'}`}>
                    {n.inferred}
                  </p>
                  <p className={`text-[11px] text-gray-500 font-medium leading-relaxed transition-all ${isExpanded ? 'max-h-24 overflow-y-auto pr-1' : 'line-clamp-2'}`}>
                    {n.reasoning}
                  </p>
                </div>
                <div className="text-center mt-auto flex justify-center items-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-[16px] text-gray-400 bg-gray-50 rounded-full w-6 h-6 flex items-center justify-center">
                    {isExpanded ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
              </div>
              );
            })}
            
            {(!items || items.length === 0) && (
              <div className="col-span-full w-full bg-white p-6 rounded-[24px] border border-[#009368]/10 text-center shadow-sm">
                <FaRegLightbulb className="text-[28px] text-emerald-500 mx-auto mb-2" />
                <p className="text-gray-400 text-[14px] font-medium">감지된 리스크가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI 분석 지표 (Radar Chart) */}
      <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-6 lg:p-8 border border-white/50 shadow-[0_12px_40px_rgba(0,147,104,0.06)] flex flex-col">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 bg-[#009368]/5 rounded-[24px] flex items-center justify-center text-[#009368] border border-[#009368]/10 shadow-[0_4px_15px_rgba(0,0,147,0.05)]">
            <span className="material-symbols-outlined text-[18px]">analytics</span>
          </div>
          <h3 className="text-[15px] font-extrabold text-gray-800 tracking-tight">AI 5각 분석 지표</h3>
        </div>
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#f1f5f9" />
              <PolarAngleAxis dataKey="subject" tick={<CustomTick />} />
              <Tooltip 
                formatter={(value) => [`${Number(value ?? 0)}점`, '점수']}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,147,104,0.15)', fontSize: '13px', fontWeight: 'bold' }}
              />
              <Radar name="Analysis" dataKey="A" stroke="#009368" fill="#009368" fillOpacity={0.08} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
    </div>
  );
};

export default DetailedAnalysis;
