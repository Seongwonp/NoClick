import React from 'react';

const HowItWorks: React.FC = () => {

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

        <div className="space-y-12 mb-16">
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

        {/* API Settings Guide Section */}
        <section className="mt-12 mb-20 relative">
          <div className="text-center mb-12">
            <h2 className="text-[28px] sm:text-[32px] font-extrabold text-on-background mb-4 flex items-center justify-center gap-3 tracking-tight">
              <span className="material-symbols-outlined text-emerald-600 text-[36px]">settings_suggest</span>
              최적의 AI 경험을 위한 설정
            </h2>
            <p className="text-on-surface-variant font-body-lg text-[16px] sm:text-[18px] max-w-2xl mx-auto break-keep leading-relaxed">
              더 빠르고 정확한 분석을 위해 내게 맞는 AI 모델을 선택하세요. <br className="hidden sm:block" />
              몇 번의 클릭만으로 완벽한 맞춤형 환경이 준비됩니다.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[110px] left-[10%] right-[10%] h-[2px] bg-emerald-50 z-0"></div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
              {/* Step 1 */}
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:-translate-y-2 hover:shadow-lg hover:border-emerald-100 transition-all duration-300 text-center group">
                <div className="w-20 h-20 mx-auto bg-gray-50 group-hover:bg-emerald-50 rounded-[1.5rem] flex items-center justify-center mb-6 transition-colors duration-300">
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-emerald-600 text-[36px] transition-colors duration-300">tune</span>
                </div>
                <div className="inline-block bg-emerald-50 text-emerald-700 text-[12px] font-extrabold px-3 py-1 rounded-full mb-4 tracking-wider">STEP 1</div>
                <h3 className="font-bold text-[20px] mb-3 text-on-surface">설정 메뉴 열기</h3>
                <p className="text-on-surface-variant text-[15px] leading-relaxed break-keep">
                  화면 상단의 <strong>'API Settings'</strong> 탭을 클릭해 설정 모달창을 엽니다.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:-translate-y-2 hover:shadow-lg hover:border-blue-100 transition-all duration-300 text-center group">
                <div className="w-20 h-20 mx-auto bg-gray-50 group-hover:bg-blue-50 rounded-[1.5rem] flex items-center justify-center mb-6 transition-colors duration-300">
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-blue-600 text-[36px] transition-colors duration-300">smart_toy</span>
                </div>
                <div className="inline-block bg-blue-50 text-blue-700 text-[12px] font-extrabold px-3 py-1 rounded-full mb-4 tracking-wider">STEP 2</div>
                <h3 className="font-bold text-[20px] mb-3 text-on-surface">AI 모델 선택</h3>
                <p className="text-on-surface-variant text-[15px] leading-relaxed break-keep">
                  압도적 성능의 <strong>Gemini</strong>와 무제한 무료인 <strong>HuggingFace</strong> 중 하나를 고르세요.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:-translate-y-2 hover:shadow-lg hover:border-purple-100 transition-all duration-300 text-center group relative overflow-hidden">
                <div className="w-20 h-20 mx-auto bg-gray-50 group-hover:bg-purple-50 rounded-[1.5rem] flex items-center justify-center mb-6 transition-colors duration-300">
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-purple-600 text-[36px] transition-colors duration-300">key</span>
                </div>
                <div className="inline-block bg-purple-50 text-purple-700 text-[12px] font-extrabold px-3 py-1 rounded-full mb-4 tracking-wider">STEP 3 (선택)</div>
                <h3 className="font-bold text-[20px] mb-3 text-on-surface">개인 API 키 입력</h3>
                <p className="text-on-surface-variant text-[15px] leading-relaxed break-keep relative z-10">
                  Gemini 선택 시 <strong>개인 키</strong>를 입력하면 대기 시간 없이 가장 빠르게 분석을 즐길 수 있습니다.
                </p>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-10 flex items-center justify-center gap-2 text-[14px] text-gray-500 bg-gray-50/80 py-3 rounded-full w-max mx-auto px-6">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              입력된 API 키는 서버로 전송되지 않으며 고객님의 브라우저에만 안전하게 저장됩니다.
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default HowItWorks;
