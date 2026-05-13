import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  
  // 상태: localStorage에서 초기값을 가져옵니다.
  const [selectedModel, setSelectedModel] = React.useState<'gemini' | 'huggingface'>(() => {
    return (localStorage.getItem('noclick_model') as 'gemini' | 'huggingface') || 'gemini';
  });
  const [apiKey, setApiKey] = React.useState(() => {
    return localStorage.getItem('noclick_apiKey') || '';
  });

  // 상태 변경 시 localStorage에 저장합니다.
  React.useEffect(() => {
    localStorage.setItem('noclick_model', selectedModel);
    localStorage.setItem('noclick_apiKey', apiKey);
  }, [selectedModel, apiKey]);

  return (
    <>
      <header className="fixed top-0 w-full z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md shadow-sm antialiased">
      <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
        <Link to="/" className="text-xl font-extrabold tracking-tight text-emerald-600">
          No-Click
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          <Link
            to="/"
            className={`font-semibold py-1 transition-all duration-200 hover:text-emerald-600 ${
              location.pathname === '/'
                ? 'text-emerald-600 border-b-2 border-emerald-500'
                : 'text-gray-500'
            }`}
          >
            홈
          </Link>
          <Link
            to="/history"
            className={`font-medium py-1 transition-all duration-200 hover:text-emerald-600 ${
              location.pathname === '/history'
                ? 'text-emerald-600 border-b-2 border-emerald-500'
                : 'text-gray-500'
            }`}
          >
            분석 내역
          </Link>
          <Link
            to="/how-it-works"
            className={`font-medium py-1 transition-all duration-200 hover:text-emerald-600 ${
              location.pathname === '/how-it-works'
                ? 'text-emerald-600 border-b-2 border-emerald-500'
                : 'text-gray-500'
            }`}
          >
            사용법
          </Link>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className={`font-medium py-1 transition-all duration-200 hover:text-emerald-600 ${
              isSettingsOpen ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-gray-500'
            }`}
          >
            API 설정
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-gray-500 hover:text-emerald-500 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="material-symbols-outlined">
            {isMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col p-4 space-y-4">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`font-semibold px-4 py-2 rounded-lg ${
                location.pathname === '/' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500'
              }`}
            >
              홈
            </Link>
            <Link
              to="/history"
              onClick={() => setIsMenuOpen(false)}
              className={`font-semibold px-4 py-2 rounded-lg ${
                location.pathname === '/history' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500'
              }`}
            >
              분석 내역
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setIsMenuOpen(false)}
              className={`font-semibold px-4 py-2 rounded-lg ${
                location.pathname === '/how-it-works' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500'
              }`}
            >
              사용법
            </Link>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setIsSettingsOpen(true);
              }}
              className={`text-left font-semibold px-4 py-2 rounded-lg transition-colors ${
                isSettingsOpen ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              API 설정
            </button>
          </nav>
        </div>
      )}
    </header>
      
      {/* Settings Modal (API) */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-md p-4 sm:p-6">
          <div className="relative w-full max-w-[420px]">
            {/* Glow effect behind modal */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-[2.5rem] blur opacity-25 animate-pulse"></div>
            
            {/* Modal Content */}
            <div className="bg-white rounded-[2rem] p-7 sm:p-9 w-full shadow-2xl border border-white/50 transform transition-all relative flex flex-col max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-emerald-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-emerald-50"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              
              <div className="mb-8 pr-8">
                <h2 className="text-[24px] sm:text-[28px] font-extrabold text-on-background mb-2 flex items-center gap-2 tracking-tight">
                  <span className="material-symbols-outlined text-emerald-600 text-[28px]">api</span>
                  <span className="break-keep">API 설정</span>
                </h2>
              <p className="text-[13px] sm:text-[14px] text-on-surface-variant break-keep leading-relaxed">
                원하는 AI 모델과 API 키를 설정할 수 있습니다.
              </p>
            </div>

            <div className="space-y-6">
              {/* Model Selection */}
              <div>
                <label className="block text-[15px] font-extrabold text-on-surface mb-3">AI 모델 선택</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    className={`flex-1 py-5 px-4 rounded-[1.25rem] border-2 flex sm:flex-col items-center justify-center gap-2 transition-all duration-300 ${
                      selectedModel === 'gemini' 
                        ? 'border-emerald-500 bg-emerald-50/70 text-emerald-700 shadow-md transform scale-[1.02]' 
                        : 'border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                    onClick={() => setSelectedModel('gemini')}
                  >
                    <span className="material-symbols-outlined text-[26px] sm:text-[30px] mb-1">auto_awesome</span>
                    <span className="font-bold text-[14px]">Gemini</span>
                  </button>
                  <button
                    className={`flex-1 py-5 px-4 rounded-[1.25rem] border-2 flex sm:flex-col items-center justify-center gap-2 transition-all duration-300 ${
                      selectedModel === 'huggingface' 
                        ? 'border-blue-500 bg-blue-50/70 text-blue-700 shadow-md transform scale-[1.02]' 
                        : 'border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                    onClick={() => setSelectedModel('huggingface')}
                  >
                    <span className="material-symbols-outlined text-[26px] sm:text-[30px] mb-1">smart_toy</span>
                    <span className="font-bold text-[14px]">HuggingFace</span>
                  </button>
                </div>
              </div>

              {/* API Key Input & Info Container */}
              <div className="relative grid">
                {/* Gemini Input */}
                <div className={`col-start-1 row-start-1 transition-all duration-300 ease-in-out ${selectedModel === 'gemini' ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-2 pointer-events-none -z-10'}`}>
                  <label className="block text-[15px] font-extrabold text-on-surface mb-2">
                    개인 API 키 <span className="text-gray-400 font-medium ml-1 text-[13px]">(선택사항)</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-[1rem] blur opacity-0 group-focus-within:opacity-20 transition duration-300"></div>
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px] z-10">key</span>
                    <input 
                      type="password"
                      placeholder="Gemini API 키 입력"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="relative w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-[1rem] focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-[14px] font-mono shadow-inner z-10"
                    />
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-gray-500 break-keep">
                    API 키를 입력하면 개인 할당량을 사용하여 더 빠르고 안정적인 분석이 가능합니다.
                  </p>
                </div>

                {/* HuggingFace Info */}
                <div className={`col-start-1 row-start-1 transition-all duration-300 ease-in-out flex flex-col justify-center ${selectedModel === 'huggingface' ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-2 pointer-events-none -z-10'}`}>
                  <div className="bg-blue-50/50 rounded-[1rem] p-5 text-center border border-blue-100/50 h-full flex flex-col justify-center items-center">
                    <span className="material-symbols-outlined text-blue-400 text-[28px] mb-2">cloud_done</span>
                    <p className="text-[14px] font-bold text-blue-800 mb-1">API 키가 필요하지 않습니다</p>
                    <p className="text-[13px] text-blue-600/80 break-keep">
                      HuggingFace 오픈소스 모델은 서버 자체 리소스를 활용하여 별도의 개인 API 키 없이 바로 사용할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-[16px] hover:bg-emerald-700 transition-all shadow-md hover:shadow-emerald-200/50 flex items-center justify-center gap-2 active:scale-95"
              >
                <span>설정 완료</span>
                <span className="material-symbols-outlined text-[20px]">check</span>
              </button>
            </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
