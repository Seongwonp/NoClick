import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SiNaver, SiInstagram } from 'react-icons/si';
import { FaShoppingCart } from 'react-icons/fa';
const platforms = [
  { id: 'naver', name: '네이버', icon: <SiNaver className="text-[#03C75A]" /> },
  { id: 'insta', name: '인스타', icon: <SiInstagram className="text-[#E1306C]" /> },
  { id: 'coupang', name: '쿠팡', icon: <FaShoppingCart className="text-[#CB1400]" /> },
  { id: 'other', name: '기타', icon: <span className="material-symbols-outlined text-gray-500 text-[16px]">public</span> },
];

const EXAMPLE_REVIEW = `정말 완벽한 제품이에요! 협찬 받았지만 솔직하게 리뷰해요 :) 피부가 엄청 촉촉해지고 화사해졌어요. 주변 친구들도 다 피부 좋아졌다고 물어봐요. 향도 너무 좋고 발림도 너무 좋아서 이제 이것만 쓸 것 같아요. 단점을 찾기가 너무 힘들 정도로 완벽한 제품!`;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [platform, setPlatform] = useState(platforms[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputError, setInputError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStartAnalysis = () => {
    if (!inputText.trim()) {
      setInputError(true);
      return;
    }
    navigate('/result', { state: { text: inputText, platform: platform.id } });
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
            <div className={`absolute -inset-1.5 bg-gradient-to-r ${
              platform.id === 'naver' ? 'from-emerald-400 to-green-400' :
              platform.id === 'insta' ? 'from-fuchsia-400 to-pink-400' :
              platform.id === 'coupang' ? 'from-rose-400 to-orange-400' :
              'from-emerald-400 to-blue-400'
            } rounded-[2rem] blur opacity-15 group-focus-within:opacity-30 transition-all duration-700`}></div>
            <div className={`relative z-10 bg-white rounded-[2rem] border custom-shadow overflow-visible transition-colors ${inputError ? 'border-red-300' : 'border-emerald-50'}`}>
              <textarea
                className="w-full h-56 p-8 border-none focus:ring-0 text-on-surface text-[18px] placeholder-outline bg-transparent resize-none font-body-md outline-none"
                placeholder="네이버 블로그, 인스타그램, 쿠팡 등의 리뷰 텍스트를 그대로 복사해서 붙여넣어주세요..."
                value={inputText}
                onChange={(e) => { setInputText(e.target.value); setInputError(false); }}
              ></textarea>
              {inputError && (
                <p className="px-8 pb-3 text-[13px] text-red-500 font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  분석할 리뷰 내용을 입력해주세요.
                </p>
              )}
              <div className="flex items-center justify-between px-8 py-5 bg-emerald-50/30 border-t border-emerald-50 rounded-b-[2rem]">
                <div className="flex items-center gap-4">
                  <div className="relative group/platform" ref={dropdownRef}>
                    <div
                      className="flex items-center gap-2 bg-white border border-emerald-100 text-on-surface text-[14px] rounded-xl px-4 py-2 hover:border-emerald-300 focus:ring-2 focus:ring-emerald-500/20 font-medium cursor-pointer shadow-sm transition-colors"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <div className="text-[16px]">{platform.icon}</div>
                      <span>{platform.name}</span>
                      <span className={`material-symbols-outlined text-[18px] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                    </div>
                    
                    {/* 툴팁 */}
                    <div className="absolute bottom-full left-0 mb-2 w-44 bg-gray-800 text-white text-[11px] px-3 py-2 rounded-lg opacity-0 group-hover/platform:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed">
                      플랫폼 특성에 맞게 광고 패턴을 분석합니다
                    </div>

                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-full bg-white border border-emerald-100 rounded-xl shadow-lg z-50 overflow-hidden">
                        {platforms.map((p) => (
                          <div 
                            key={p.id}
                            className={`flex items-center gap-2 px-4 py-2.5 cursor-pointer hover:bg-emerald-50 transition-colors ${platform.id === p.id ? 'bg-emerald-50/50 text-emerald-700' : 'text-on-surface'}`}
                            onClick={() => {
                              setPlatform(p);
                              setIsDropdownOpen(false);
                            }}
                          >
                            <div className="text-[16px]">{p.icon}</div>
                            <span className="font-medium text-[14px]">{p.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => { setInputText(EXAMPLE_REVIEW); setInputError(false); setPlatform(platforms[0]); }}
                    className="text-[13px] text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-1 transition-colors hidden sm:flex"
                  >
                    <span className="material-symbols-outlined text-[15px]">edit_note</span>
                    예시 넣어보기
                  </button>
                  {inputText.length > 0 && (
                    <span className="text-[13px] text-on-surface-variant font-medium hidden sm:inline-block">
                      {inputText.length}자
                    </span>
                  )}
                </div>
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
