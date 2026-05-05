import React from 'react';
import { useNavigate } from 'react-router-dom';

const Result: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-grow pt-32 pb-12 px-6 max-w-7xl mx-auto w-full">
      {/* Score Section */}
      <section className="mb-20 flex flex-col md:flex-row items-center justify-between bg-white rounded-3xl p-12 shadow-[0_4px_20px_rgba(0,0,0,0.04)] gap-6">
        <div className="flex-1 text-center md:text-left">
          <h1 className="font-display-lg text-[40px] font-bold mb-4 text-on-surface">분석 완료! 🔍</h1>
          <p className="font-headline-md text-[24px] font-semibold text-on-surface-variant">
            이 리뷰의 진실 지수는 <span className="text-tertiary">35%</span>입니다.
          </p>
          <p className="mt-4 text-outline font-body-lg text-[16px]">
            일부 광고성 표현과 과장된 문구가 발견되었습니다. 구매 전 신중하게 고려하세요.
          </p>
        </div>
        <div className="relative flex items-center justify-center">
          <svg className="w-48 h-48">
            <circle className="text-surface-container stroke-current" cx="96" cy="96" fill="transparent" r="70" strokeWidth="12"></circle>
            <circle 
              className="text-tertiary-container stroke-current progress-ring__circle" 
              cx="96" cy="96" fill="transparent" r="70" strokeLinecap="round" strokeWidth="12" 
              style={{ strokeDasharray: 440, strokeDashoffset: `calc(440 - (440 * 35) / 100)` }}
            ></circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold text-tertiary">35%</span>
            <span className="text-label-sm text-[12px] font-semibold text-outline">TRUTH SCORE</span>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
        {/* Original Review */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-50">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-outline">history</span>
            <h3 className="font-headline-sm text-[18px] font-semibold text-on-surface">원본 리뷰</h3>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-6 leading-relaxed font-body-lg text-[16px] text-on-surface-variant">
            진짜 인생 맛집이에요! <span className="bg-error-container text-on-error-container rounded px-1">사장님도 너무 친절하시고</span> 분위기까지 미쳤어요.. ✨ 
            스테이크 입에서 살살 녹아요 <span className="bg-orange-100 text-orange-800 rounded px-1">웨이팅 하나도 안 아깝고 꼭 가보세요 강추!!!</span>
            <span className="bg-error-container text-on-error-container rounded px-1">#광고 #협찬아님</span> 소문내고 싶지 않은데 넘 맛있어서 올려요.
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="bg-error-container text-on-error-container px-3 py-1 rounded-full text-label-sm text-[12px] font-semibold">🚨 광고성 의심</span>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-label-sm text-[12px] font-semibold">⚠️ 과장된 감정</span>
          </div>
        </div>

        {/* AI Rewrite */}
        <div className="bg-primary-container/5 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-primary-container/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            <h3 className="font-headline-sm text-[18px] font-semibold text-on-surface">AI 재작성 (객관적 사실)</h3>
          </div>
          <div className="bg-white rounded-xl p-6 leading-relaxed font-body-lg text-[16px] text-on-surface border border-primary-container/10">
            직원들의 응대가 친절한 편이며, 매장 분위기가 세련되어 데이트 장소로 적합합니다. 
            스테이크의 육질은 부드러운 편이나, 주말 점심 시간대에는 평균 40분 이상의 긴 대기 시간이 발생할 수 있습니다. 
            전반적인 만족도는 높지만 홍보용 문구가 섞인 리뷰임을 참고하시기 바랍니다.
          </div>
          <div className="mt-6">
            <div className="flex items-center gap-2 text-primary font-label-sm text-[12px] font-semibold">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>중립적 관점으로 정제되었습니다</span>
            </div>
          </div>
        </div>
      </section>

      {/* Restored Weaknesses */}
      <section className="mb-20">
        <h3 className="font-headline-md text-[24px] font-semibold mb-3 px-2">복원된 단점 🧐</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex items-start gap-4 hover:translate-y-[-2px] transition-transform duration-200">
            <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-outline">event_seat</span>
            </div>
            <div>
              <h4 className="font-headline-sm text-[18px] font-semibold mb-1 text-on-surface">좁은 좌석</h4>
              <p className="text-outline font-body-md text-[14px]">테이블 간격이 좁아 주변 소음이 큰 편입니다.</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex items-start gap-4 hover:translate-y-[-2px] transition-transform duration-200">
            <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-outline">payments</span>
            </div>
            <div>
              <h4 className="font-headline-sm text-[18px] font-semibold mb-1 text-on-surface">비싼 가격대</h4>
              <p className="text-outline font-body-md text-[14px]">양에 비해 가격이 다소 높게 책정되어 있습니다.</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex items-start gap-4 hover:translate-y-[-2px] transition-transform duration-200">
            <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-outline">timer</span>
            </div>
            <div>
              <h4 className="font-headline-sm text-[18px] font-semibold mb-1 text-on-surface">긴 대기 시간</h4>
              <p className="text-outline font-body-md text-[14px]">예약 없이는 최소 30분 이상의 대기가 필수입니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Actions */}
      <section className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <button 
          type="button"
          onClick={() => navigate('/')}
          className="w-full sm:w-auto bg-primary text-on-primary px-20 py-4 rounded-2xl font-headline-sm text-[18px] font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined">search</span>
          다른 리뷰도 분석하기
        </button>
        <button type="button" className="w-full sm:w-auto bg-white text-on-surface border border-outline-variant px-20 py-4 rounded-2xl font-headline-sm text-[18px] font-semibold hover:bg-gray-50 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer">
          <span className="material-symbols-outlined">share</span>
          결과 공유하기
        </button>
      </section>

      {/* Product Image Section (Visual Anchor) */}
      <section className="mt-20 rounded-3xl overflow-hidden h-64 relative group">
        <img 
          alt="Restaurant interior" 
          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2070"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
          <div className="text-white">
            <p className="font-headline-md text-[24px] font-semibold">분석된 장소: '더 스테이크 하우스'</p>
            <p className="font-body-md text-[14px] opacity-80">서울시 강남구 논현동 인근</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Result;
