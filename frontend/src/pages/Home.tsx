import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleStartAnalysis = () => {
    navigate('/analysis');
  };

  return (
    <div className="flex-grow pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="font-display-lg text-[40px] leading-[1.2] tracking-[-0.02em] font-bold text-on-background mb-4">
            리뷰의 진실, <span className="text-primary">No-Click</span>이 찾아드릴게요
          </h1>
          <p className="font-body-lg text-[16px] leading-[1.6] text-on-surface-variant max-w-2xl mx-auto">
            네이버, 쿠팡, 인스타그램 등 어디든 텍스트만 붙여넣으세요. 
            광고에 지친 당신을 위해 AI가 진짜 리뷰를 골라냅니다.
          </p>
        </section>

        {/* Input Area */}
        <section className="mb-20">
          <div className="relative max-w-3xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-3xl blur opacity-10 group-focus-within:opacity-25 transition duration-500"></div>
            <div className="relative bg-white rounded-3xl border border-gray-100 custom-shadow p-6">
              <textarea 
                className="w-full h-64 border-none focus:ring-0 text-on-surface text-[16px] placeholder-outline bg-transparent resize-none font-body-md outline-none" 
                placeholder="분석하고 싶은 리뷰 내용을 이곳에 붙여넣어주세요..."
              ></textarea>
              <div className="flex items-center justify-between mt-4 border-t border-gray-50 pt-4">
                <div className="flex gap-4">
                  {/* 향후 기능 추가 시 구현 예정 */}
                </div>
                <button 
                  type="button"
                  onClick={handleStartAnalysis}
                  className="bg-primary-container text-on-primary-container px-8 py-3 rounded-xl font-bold flex items-center gap-2 active:scale-95 transition-all shadow-md hover:shadow-emerald-100 cursor-pointer"
                >
                  진실 확인하기
                  <span className="material-symbols-outlined">analytics</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards (Asymmetric/Modern Layout) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 custom-shadow hover:translate-y-[-4px] transition-transform duration-300">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>shield</span>
            </div>
            <h3 className="font-headline-sm text-[18px] font-semibold mb-3">광고 패턴 감지</h3>
            <p className="font-body-md text-[14px] leading-[1.6] text-on-surface-variant">
              인공지능이 수천 개의 광고 데이터를 기반으로 협찬 문구와 숨겨진 광고 패턴을 완벽하게 분석합니다.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 custom-shadow hover:translate-y-[-4px] transition-transform duration-300">
            <div className="w-12 h-12 bg-blue-50 text-secondary rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>visibility</span>
            </div>
            <h3 className="font-headline-sm text-[18px] font-semibold mb-3">숨겨진 단점 복원</h3>
            <p className="font-body-md text-[14px] leading-[1.6] text-on-surface-variant">
              좋은 말로만 가득 찬 리뷰 사이에서 실제 사용자가 느낀 미묘한 불편함과 단점을 놓치지 않고 찾아냅니다.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 custom-shadow hover:translate-y-[-4px] transition-transform duration-300">
            <div className="w-12 h-12 bg-purple-50 text-tertiary rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>edit_note</span>
            </div>
            <h3 className="font-headline-sm text-[18px] font-semibold mb-3">탈광고 재작성</h3>
            <p className="font-body-md text-[14px] leading-[1.6] text-on-surface-variant">
              수식어는 빼고 팩트만 남겨서 한눈에 읽기 쉽게 요약해드립니다. 광고 제거 후 핵심만 파악하세요.
            </p>
          </div>
        </section>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed top-20 right-[10%] w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-20 left-[5%] w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>
    </div>
  );
};

export default Home;
