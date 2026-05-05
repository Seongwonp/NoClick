import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');

  const handleStartAnalysis = () => {
    if (!inputText.trim()) {
      alert('분석할 내용을 입력해주세요!');
      return;
    }
    // 분석 페이지로 텍스트 전달 (state 사용)
    navigate('/analysis', { state: { text: inputText } });
  };

  return (
    <div className="flex-grow pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        {/* Hero & Input Section */}
        <section className="mb-24">
          <h1 className="font-display-lg text-[48px] md:text-[56px] leading-[1.1] tracking-[-0.03em] font-extrabold text-on-background mb-6">
            리뷰의 진실, <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">No-Click</span>이 찾아드릴게요
          </h1>
          <p className="font-body-lg text-[18px] md:text-[20px] leading-[1.6] text-on-surface-variant max-w-2xl mx-auto mb-12">
            광고와 협찬에 지친 당신을 위해 AI가 진짜 리뷰만 골라냅니다.<br className="hidden md:block" />
            분석하고 싶은 내용을 아래에 바로 붙여넣어 보세요.
          </p>

          {/* Input Area Integrated into Hero */}
          <div id="analysis-input" className="relative max-w-3xl mx-auto group scroll-mt-32">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-[2rem] blur opacity-15 group-focus-within:opacity-30 transition duration-500"></div>
            <div className="relative bg-white rounded-[2rem] border border-emerald-50 custom-shadow overflow-hidden">
              <textarea 
                className="w-full h-56 p-8 border-none focus:ring-0 text-on-surface text-[18px] placeholder-outline bg-transparent resize-none font-body-md outline-none" 
                placeholder="분석하고 싶은 리뷰 내용을 이곳에 붙여넣어주세요..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              ></textarea>
              <div className="flex items-center justify-between px-8 py-5 bg-emerald-50/30 border-t border-emerald-50">
                <span className="text-[14px] text-on-surface-variant font-medium">
                  {inputText.length}자 입력됨
                </span>
                <button 
                  type="button"
                  onClick={handleStartAnalysis}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 active:scale-95 transition-all shadow-md hover:bg-emerald-700 hover:shadow-emerald-200/50 cursor-pointer"
                >
                  분석 시작하기
                  <span className="material-symbols-outlined text-[20px]">analytics</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-16">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[28px]" style={{fontVariationSettings: "'FILL' 1"}}>shield</span>
            </div>
            <h3 className="text-[20px] font-bold mb-3">광고 패턴 감지</h3>
            <p className="text-[15px] leading-[1.6] text-on-surface-variant">
              인공지능이 수천 개의 데이터를 기반으로 협찬 문구와 숨겨진 광고 패턴을 완벽하게 분석합니다.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-14 h-14 bg-blue-50 text-secondary rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[28px]" style={{fontVariationSettings: "'FILL' 1"}}>visibility</span>
            </div>
            <h3 className="text-[20px] font-bold mb-3">숨겨진 단점 복원</h3>
            <p className="text-[15px] leading-[1.6] text-on-surface-variant">
              좋은 말로만 가득 찬 리뷰 사이에서 실제 사용자가 느낀 미묘한 불편함과 단점을 찾아냅니다.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-14 h-14 bg-purple-50 text-tertiary rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[28px]" style={{fontVariationSettings: "'FILL' 1"}}>edit_note</span>
            </div>
            <h3 className="text-[20px] font-bold mb-3">탈광고 재작성</h3>
            <p className="text-[15px] leading-[1.6] text-on-surface-variant">
              불필요한 수식어는 빼고 팩트만 남겨서 한눈에 읽기 쉽게 핵심만 요약해드립니다.
            </p>
          </div>
        </section>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-100/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-100/20 rounded-full blur-[120px] -z-10 pulse-slow"></div>
    </div>
  );

};

export default Home;
