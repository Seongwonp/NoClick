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
      <header className="fixed top-0 w-full z-50 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm font-plus-jakarta-sans antialiased">
      <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
        <Link to="/" className="text-xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
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
            Home
          </Link>
          <Link
            to="/history"
            className={`font-medium py-1 transition-all duration-200 hover:text-emerald-600 ${
              location.pathname === '/history'
                ? 'text-emerald-600 border-b-2 border-emerald-500'
                : 'text-gray-500'
            }`}
          >
            My History
          </Link>
          <Link
            to="/how-it-works"
            className={`font-medium py-1 transition-all duration-200 hover:text-emerald-600 ${
              location.pathname === '/how-it-works'
                ? 'text-emerald-600 border-b-2 border-emerald-500'
                : 'text-gray-500'
            }`}
          >
            How it Works
          </Link>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="font-medium py-1 transition-all duration-200 text-gray-500 hover:text-emerald-600 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">api</span>
            API
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
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col p-4 space-y-4">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`font-semibold px-4 py-2 rounded-lg ${
                location.pathname === '/' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500'
              }`}
            >
              Home
            </Link>
            <Link
              to="/history"
              onClick={() => setIsMenuOpen(false)}
              className={`font-semibold px-4 py-2 rounded-lg ${
                location.pathname === '/history' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500'
              }`}
            >
              My History
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setIsMenuOpen(false)}
              className={`font-semibold px-4 py-2 rounded-lg ${
                location.pathname === '/how-it-works' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500'
              }`}
            >
              How it Works
            </Link>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setIsSettingsOpen(true);
              }}
              className="text-left font-semibold px-4 py-2 rounded-lg text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">api</span>
              API
            </button>
          </nav>
        </div>
      )}
    </header>
      
      {/* Settings Modal (API) */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 w-full max-w-[400px] shadow-2xl border border-emerald-50 transform transition-all relative flex flex-col max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-5 right-5 sm:top-6 sm:right-6 text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <div className="mb-6 pr-8">
              <h2 className="text-[22px] sm:text-[24px] font-bold text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600">api</span>
                <span className="break-keep">API 설정</span>
              </h2>
              <p className="text-[13px] sm:text-[14px] text-on-surface-variant break-keep leading-relaxed">
                원하는 AI 모델과 API 키를 설정할 수 있습니다.
              </p>
            </div>

            <div className="space-y-6">
              {/* Model Selection */}
              <div>
                <label className="block text-[14px] font-bold text-on-surface mb-3">AI 모델 선택</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    className={`flex-1 py-4 px-4 rounded-2xl border-2 flex sm:flex-col items-center justify-center gap-3 transition-all ${
                      selectedModel === 'gemini' 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' 
                        : 'border-gray-100 text-gray-500 hover:border-emerald-200 hover:bg-emerald-50/30'
                    }`}
                    onClick={() => setSelectedModel('gemini')}
                  >
                    <span className="material-symbols-outlined text-[24px] sm:text-[28px]">auto_awesome</span>
                    <span className="font-bold text-[14px]">Gemini</span>
                  </button>
                  <button
                    className={`flex-1 py-4 px-4 rounded-2xl border-2 flex sm:flex-col items-center justify-center gap-3 transition-all ${
                      selectedModel === 'huggingface' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                        : 'border-gray-100 text-gray-500 hover:border-blue-200 hover:bg-blue-50/30'
                    }`}
                    onClick={() => setSelectedModel('huggingface')}
                  >
                    <span className="material-symbols-outlined text-[24px] sm:text-[28px]">smart_toy</span>
                    <span className="font-bold text-[14px]">HuggingFace</span>
                  </button>
                </div>
              </div>

              {/* API Key Input */}
              <div>
                <label className="block text-[14px] font-bold text-on-surface mb-2">
                  개인 API 키 <span className="text-gray-400 font-medium ml-1">(선택사항)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px]">key</span>
                  <input 
                    type="password"
                    placeholder={`${selectedModel === 'gemini' ? 'Gemini' : 'HuggingFace'} API 키 입력`}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-[14px] font-mono"
                  />
                </div>
                <p className="mt-2.5 text-[12px] sm:text-[12.5px] leading-relaxed text-gray-500 break-keep">
                  API 키를 입력하면 개인 할당량을 사용하여 더 빠르고 안정적인 분석이 가능합니다.
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>설정 완료</span>
                <span className="material-symbols-outlined text-[18px]">check</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
