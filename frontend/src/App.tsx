import { useState } from 'react'

function App() {
  const [url, setUrl] = useState('')

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Logo & Hero */}
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            No<span className="text-blue-600">-</span>Click
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            블로그 광고 뒤에 숨겨진 '진짜' 정보를 찾아냅니다.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <input
            type="text"
            placeholder="네이버 블로그 URL을 입력하세요"
            className="w-full px-6 py-4 text-lg bg-white border-2 border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button className="absolute right-2 top-2 bottom-2 px-6 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
            분석하기
          </button>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
            <span className="text-2xl mb-2 block">🔍</span>
            <span className="font-bold text-slate-800">광고 패턴 탐지</span>
          </div>
          <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
            <span className="text-2xl mb-2 block">💡</span>
            <span className="font-bold text-slate-800">숨겨진 단점 추론</span>
          </div>
          <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
            <span className="text-2xl mb-2 block">📝</span>
            <span className="font-bold text-slate-800">탈광고 요약</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-8 text-slate-400 text-xs">
          © 2026 No-Click Project Team 성원, 아미, 예솔
        </div>
      </div>
    </div>
  )
}

export default App
