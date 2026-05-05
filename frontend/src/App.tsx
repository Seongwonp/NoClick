import { useState } from 'react'

function App() {
  const [content, setContent] = useState('')
  const [url, setUrl] = useState('')

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 font-sans text-slate-900">
      <div className="max-w-3xl w-full space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h1 className="text-6xl font-black tracking-tighter">
            No<span className="text-blue-600">-</span>Click
          </h1>
          <p className="text-xl text-slate-500 font-medium">
            블로그 본문을 붙여넣으세요. AI가 광고 뒤의 진실을 수사합니다.
          </p>
        </div>

        {/* Main Input Section */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">
                Blog URL (Optional)
              </label>
              <input
                type="text"
                placeholder="https://blog.naver.com/..."
                className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">
                Blog Content (Required)
              </label>
              <textarea
                placeholder="분석할 블로그 본문 전체를 복사해서 붙여넣으세요..."
                className="w-full h-64 px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500 transition-all resize-none text-base leading-relaxed"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <button className="w-full py-5 bg-slate-900 text-white text-xl font-bold rounded-2xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all transform active:scale-[0.98]">
              X-ray 분석 시작하기 🔍
            </button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2">
            <div className="text-3xl">🕵️‍♂️</div>
            <h3 className="font-bold text-blue-900">결핍 추론</h3>
            <p className="text-sm text-blue-700/70 leading-snug">작성자가 의도적으로 언급하지 않은 단점을 찾아냅니다.</p>
          </div>
          <div className="p-6 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
            <div className="text-3xl">🖍️</div>
            <h3 className="font-bold text-purple-900">광고 하이라이트</h3>
            <p className="text-sm text-purple-700/70 leading-snug">교묘한 바이럴 문구를 형광펜으로 즉시 표시합니다.</p>
          </div>
          <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
            <div className="text-3xl">✨</div>
            <h3 className="font-bold text-emerald-900">클린 요약</h3>
            <p className="text-sm text-emerald-700/70 leading-snug">광고 수식어를 걷어낸 핵심 팩트만 제공합니다.</p>
          </div>
        </div>

        <div className="text-center text-slate-300 text-sm font-medium pt-4">
          © 2026 No-Click Project Team • AI Detective Agency
        </div>
      </div>
    </div>
  )
}

export default App
