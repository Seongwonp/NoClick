import React, { useState } from 'react';

const steps = [
  {
    icon: 'content_paste',
    title: '리뷰 붙여넣기',
    desc: '네이버, 쿠팡, 인스타 등 어디서든 리뷰 텍스트를 그대로 넣어주세요.',
  },
  {
    icon: 'psychology',
    title: '분석 실행',
    desc: '광고성 표현, 과장 문구, 누락된 단점 신호를 AI가 동시에 분석해요.',
  },
  {
    icon: 'fact_check',
    title: '결과 확인',
    desc: '광고 확률, 신뢰 점수, 원문 근거를 보고 바로 판단할 수 있어요.',
  },
];

const faqs = [
  {
    q: '어떤 텍스트가 잘 분석되나요?',
    a: '실제 사용 경험, 효과, 아쉬운 점이 함께 들어간 리뷰일수록 정확도가 높아요. 링크만 붙여넣기보다는 본문 텍스트 전체를 넣어주세요. 특히 협찬 고지 문장, 과장 표현, 비교 표현이 포함된 문장은 분석 품질을 크게 높여줘요.',
  },
  {
    q: 'API 키는 꼭 필요한가요?',
    a: '필수는 아니에요. 기본 설정만으로도 바로 분석할 수 있어요. 다만 사용량이 많거나 더 안정적인 응답 속도를 원하면 개인 API 키를 연결하는 게 좋아요. 키를 연결해도 리뷰 원문은 서비스 외부에 저장하지 않도록 설계되어 있어요.',
  },
  {
    q: '결과는 저장되나요?',
    a: '같은 브라우저 세션 기준으로 히스토리에 저장돼요. 이후 히스토리에서 검색, 위험도 필터, 페이지 이동으로 다시 비교할 수 있어요. 특정 기간이 지나면 세션이 초기화될 수 있으니 중요한 분석은 캡처로 남겨두는 걸 권장해요.',
  },
  {
    q: '광고 확률이 낮으면 무조건 믿어도 되나요?',
    a: '아니에요. 광고 확률은 신호를 종합한 추정값이라 절대 기준은 아니에요. 확률이 낮더라도 성분, 피부 타입, 사용 기간 같은 핵심 정보가 빠져 있으면 실제 구매 판단에는 부족할 수 있어요. 점수와 함께 원문 하이라이트, 숨겨진 단점 추론을 같이 보는 게 가장 정확해요.',
  },
];

const HowItWorks: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] pt-28 pb-20 px-6 relative overflow-hidden">
      <div className="fixed top-[-10%] right-[-5%] w-[420px] h-[420px] bg-emerald-100/10 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-100/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-5xl mx-auto">
        <section className="min-h-[68vh] md:min-h-[74vh] flex flex-col justify-center">
        <header className="mb-12 text-center">
          <p className="text-[11px] font-extrabold text-on-surface-variant uppercase tracking-wider mb-3">사용법</p>
          <h1 className="text-[36px] md:text-[46px] leading-[1.1] tracking-[-0.03em] font-extrabold text-on-background mb-4">
            3단계로 바로 확인해요
          </h1>
          <p className="text-[16px] md:text-[18px] leading-[1.6] text-on-surface-variant break-keep max-w-2xl mx-auto">
            복잡한 설정 없이 리뷰 텍스트만 넣으면, 광고성 여부와 근거를 한 번에 볼 수 있어요.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-14">
          {steps.map((s, idx) => (
            <div key={s.title} className="bg-white rounded-2xl border border-emerald-50 custom-shadow p-5 md:p-6">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
              </div>
              <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">STEP {idx + 1}</p>
              <h2 className="text-[18px] font-extrabold text-on-surface tracking-tight mb-2">{s.title}</h2>
              <p className="text-[13px] text-on-surface-variant leading-relaxed break-keep">{s.desc}</p>
            </div>
          ))}
        </section>
        </section>

        <section className="mb-14 pt-8 md:pt-12">
          <div className="flex flex-col items-center mb-10">
            <div className="w-px h-14 bg-gradient-to-b from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 mb-5" />
            <h2 className="text-[24px] md:text-[28px] font-black text-on-surface tracking-tight text-center">
              <span className="text-emerald-600">No-Click</span> 분석 기준
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                icon: 'rule',
                iconTone: 'text-emerald-600',
                quote: '신호 조합 기반 판단',
                title: '단일 문장보다 패턴을 봐요',
                desc: '한 문장만 보고 결론내리지 않고, 협찬 고지·과장·광고 부인 표현의 조합으로 확률을 계산해요.',
              },
              {
                icon: 'analytics',
                iconTone: 'text-emerald-600',
                quote: '점수 + 근거 동시 제공',
                title: '결과는 숫자와 원문을 같이 보여줘요',
                desc: '광고 확률, 신뢰 점수와 함께 실제 하이라이트 문장을 연결해서 왜 그런 결론인지 바로 확인할 수 있어요.',
              },
              {
                icon: 'visibility',
                iconTone: 'text-emerald-600',
                quote: '구매 전 리스크 체크',
                title: '빠진 정보까지 함께 점검해요',
                desc: '칭찬 위주 리뷰에서 누락된 부작용, 사용 기간, 조건 정보를 추론해서 판단 실수를 줄여줘요.',
              },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-[1.2rem] bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6">
                  <span className={`material-symbols-outlined text-[30px] ${item.iconTone}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {item.icon}
                  </span>
                </div>
                <span className="text-[12px] font-bold text-on-surface-variant/70 leading-relaxed px-4 py-1.5 bg-gray-50 rounded-full border border-gray-100 mb-4">
                  {item.quote}
                </span>
                <h3 className="text-[18px] font-extrabold text-on-surface tracking-tight mb-2">{item.title}</h3>
                <p className="text-[14px] text-on-surface-variant leading-relaxed break-keep max-w-[270px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-emerald-50 custom-shadow p-4 md:p-5">
          <h2 className="text-[20px] font-extrabold text-on-surface tracking-tight mb-4">자주 묻는 질문</h2>
          <div className="space-y-3">
            {faqs.map((f, idx) => {
              const open = openFaq === idx;
              return (
                <div key={f.q} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : idx)}
                    className="w-full px-4 md:px-5 py-3.5 flex items-center justify-between text-left"
                  >
                    <span className="text-[14px] md:text-[15px] font-bold text-on-surface">{f.q}</span>
                    <span className="material-symbols-outlined text-on-surface-variant">{open ? 'expand_less' : 'expand_more'}</span>
                  </button>
                  {open && (
                    <div className="px-4 md:px-5 pb-4">
                      <p className="text-[13px] text-on-surface-variant leading-relaxed break-keep">{f.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowItWorks;
