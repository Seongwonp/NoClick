import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { AnalysisResult } from '../types/analysis';
import { mockAnalysisService } from '../services/mockApi';

const Result: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');

    if (id) {
      const data = mockAnalysisService.getResult(id);
      if (data) {
        setResult(data);
      } else {
        alert('결과를 찾을 수 없습니다.');
        navigate('/history');
      }
    } else {
      navigate('/');
    }
  }, [location.search, navigate]);

  if (!result) return null;

  return (
    <div className="flex-grow pt-32 pb-12 px-6 max-w-7xl mx-auto w-full">
      {/* Score Section */}
      <section className="mb-20 flex flex-col md:flex-row items-center justify-between bg-white rounded-3xl p-12 shadow-[0_4px_20px_rgba(0,0,0,0.04)] gap-10">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold mb-4">분석 완료</div>
          <h1 className="font-display-lg text-[40px] font-bold mb-4 text-on-surface">리뷰 X-ray 결과</h1>
          <p className="font-headline-md text-[24px] font-semibold text-on-surface-variant leading-relaxed">
            이 리뷰의 진실 지수는 <span className={result.trust_score < 40 ? 'text-tertiary' : 'text-primary'}>{result.trust_score}%</span>입니다.
          </p>
          <div className="mt-6 flex gap-4 justify-center md:justify-start">
            <div className="bg-surface-container px-6 py-3 rounded-2xl">
              <p className="text-xs text-outline font-bold uppercase mb-1">예상 절약 비용</p>
              <p className="text-xl font-bold text-on-surface">{result.saved_cost}</p>
            </div>
            <div className="bg-surface-container px-6 py-3 rounded-2xl">
              <p className="text-xs text-outline font-bold uppercase mb-1">예상 절약 시간</p>
              <p className="text-xl font-bold text-on-surface">{result.saved_time}</p>
            </div>
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <svg className="w-56 h-56">
            <circle className="text-surface-container stroke-current" cx="112" cy="112" fill="transparent" r="90" strokeWidth="16"></circle>
            <circle 
              className={`${result.trust_score < 40 ? 'text-tertiary' : 'text-primary'} stroke-current progress-ring__circle`} 
              cx="112" cy="112" fill="transparent" r="90" strokeLinecap="round" strokeWidth="16" 
              style={{ strokeDasharray: 565, strokeDashoffset: `calc(565 - (565 * ${result.trust_score}) / 100)` }}
            ></circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-extrabold ${result.trust_score < 40 ? 'text-tertiary' : 'text-primary'}`}>{result.trust_score}%</span>
            <span className="text-label-sm text-[12px] font-semibold text-outline mt-1">TRUTH SCORE</span>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-outline">history</span>
              <h3 className="font-headline-sm text-[20px] font-bold text-on-surface">원본 리뷰 분석</h3>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl p-8 leading-relaxed font-body-lg text-[18px] text-on-surface-variant flex-grow border border-gray-50 whitespace-pre-wrap">
            {result.original_text}
          </div>
        </div>

        <div className="bg-primary/5 rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-primary/10 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            <h3 className="font-headline-sm text-[20px] font-bold text-on-surface">AI 팩트 체크 요약</h3>
          </div>
          <div className="bg-white rounded-2xl p-8 leading-relaxed font-body-lg text-[18px] text-on-surface flex-grow border border-primary/10 shadow-sm">
            {result.real_summary}
          </div>
        </div>
      </section>

      {/* Restored Weaknesses */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-8 px-2">
          <h3 className="font-headline-md text-[26px] font-bold text-on-surface">복원된 숨은 단점</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {result.hidden_negatives.map((neg, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 hover:border-primary/30 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-surface-container rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-outline group-hover:text-primary">warning</span>
                </div>
                <span className="text-xs font-bold text-outline">신뢰도 {neg.confidence}%</span>
              </div>
              <h4 className="text-xl font-bold mb-2 text-on-surface">{neg.inferred}</h4>
              <p className="text-on-surface-variant font-body-md text-[15px] leading-relaxed">{neg.reasoning}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
        <button 
          type="button"
          onClick={() => navigate('/')}
          className="w-full sm:w-auto bg-primary text-white px-16 py-5 rounded-2xl font-bold text-lg shadow-lg hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined">search</span>
          다른 리뷰 분석하기
        </button>
      </section>
    </div>
  );
};

export default Result;
