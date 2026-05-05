import React from 'react';
import { useNavigate } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: 'content_paste',
      title: '1. 리뷰 입력',
      description: '분석하고 싶은 네이버 블로그 URL을 복사해서 붙여넣거나, 리뷰 텍스트를 직접 입력하세요.',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      icon: 'psychology',
      title: '2. AI 패턴 분석',
      description: 'No-Click AI가 수천 개의 광고 데이터를 기반으로 협찬 문구, 과장된 수식어, 그리고 일부러 언급하지 않은 단점들을 추론합니다.',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: 'fact_check',
      title: '3. 정제된 결과 확인',
      description: '광고가 제거된 진짜 요약본과 함께, 이 리뷰를 믿어도 될지 결정해주는 "진실 지수"를 확인하세요.',
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  return (
    <div className="flex-grow pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <section className="text-center mb-20">
          <h1 className="font-display-lg text-[40px] font-bold text-on-background mb-6">
            어떻게 광고를 찾아내나요?
          </h1>
          <p className="font-body-lg text-[18px] text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            단순히 키워드만 찾는 것이 아닙니다. <br/>
            No-Click은 문맥 속에 숨겨진 <strong>'결핍'</strong>을 분석하여 진실을 파헤칩니다.
          </p>
        </section>

        <div className="space-y-12 mb-20">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-3xl border border-gray-100 custom-shadow">
              <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center shrink-0`}>
                <span className="material-symbols-outlined text-[40px]">{step.icon}</span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-on-surface mb-3">{step.title}</h3>
                <p className="text-on-surface-variant leading-relaxed font-body-lg">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="bg-primary/5 rounded-3xl p-12 text-center border border-primary/10">
          <h2 className="text-2xl font-bold text-primary mb-4">광고에 속아 시간과 돈을 낭비하지 마세요.</h2>
          <p className="text-on-surface-variant mb-10">지금 바로 첫 번째 리뷰 분석을 시작해보세요.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-primary text-white px-12 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            지금 시작하기
          </button>
        </section>
      </div>
    </div>
  );
};

export default HowItWorks;
