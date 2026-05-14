import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AnalysisResponse } from '../types/analysis';
import { apiService } from '../services/api';

const PAGE_SIZE = 6;

const getRank = (score: number) => {
  if (score >= 93) return { grade: 'S', tone: 'text-emerald-600' };
  if (score >= 85) return { grade: 'A', tone: 'text-emerald-600' };
  if (score >= 70) return { grade: 'B', tone: 'text-amber-600' };
  return { grade: 'C', tone: 'text-red-500' };
};

const History: React.FC = () => {
  const navigate = useNavigate();
  const [allItems, setAllItems] = useState<AnalysisResponse[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [queryInput, setQueryInput] = useState('');
  const [query, setQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'mid' | 'low'>('all');
  const [loadError, setLoadError] = useState<string | null>(null);

  const filtered = allItems.filter((item) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      (item.blog_title || '').toLowerCase().includes(q) ||
      (item.real_summary || '').toLowerCase().includes(q) ||
      (item.original_content || '').toLowerCase().includes(q) ||
      (item.platform || '').toLowerCase().includes(q);

    const ad = item.ad_probability ?? 0;
    const matchesRisk =
      riskFilter === 'all' ||
      (riskFilter === 'high' && ad >= 70) ||
      (riskFilter === 'mid' && ad >= 40 && ad < 70) ||
      (riskFilter === 'low' && ad < 40);

    return matchesQuery && matchesRisk;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const hasActiveSearch = query.trim().length > 0 || queryInput.trim().length > 0 || riskFilter !== 'all';

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const result = await apiService.getHistory(1, 50);
        setAllItems(result.items);
      } catch (e) {
        console.error(e);
        setAllItems([]);
        setLoadError('히스토리 조회 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query, riskFilter]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen pt-16 relative overflow-hidden">
      <div className="fixed top-[-10%] right-[-5%] w-[420px] h-[420px] bg-emerald-100/10 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-100/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-12 pb-20 relative z-10">

        {/* 헤더 */}
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-[11px] font-extrabold text-on-surface-variant uppercase tracking-wider mb-1">분석 기록</p>
            <h1 className="text-[34px] md:text-[38px] font-black text-on-surface tracking-tight leading-none">내 리뷰 히스토리</h1>
            <p className="text-[13px] text-slate-400 mt-2">한눈에 비교하고 필요한 결과만 빠르게 찾을 수 있어요</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-[13px] rounded-2xl hover:bg-emerald-700 transition-all active:scale-95"
          >
            새 분석
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center py-24 gap-4">
            <div className="w-8 h-8 border-[3px] border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-[13px] text-on-surface-variant font-medium">불러오는 중...</p>
          </div>
        ) : (
          <>
            <div className="bg-white border border-emerald-50 rounded-2xl p-4 md:p-5 mb-4 custom-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3">
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <div className="relative">
                    <span className="material-symbols-outlined text-[18px] text-gray-400 absolute left-3 top-1/2 -translate-y-1/2">search</span>
                    <input
                      value={queryInput}
                      onChange={(e) => setQueryInput(e.target.value)}
                      placeholder="제목, 요약, 플랫폼 검색"
                    className="w-full h-10 pl-10 pr-3 rounded-xl border border-gray-200 text-[13px] outline-none focus:border-emerald-400"
                  />
                  </div>
                  <button
                    onClick={() => setQuery(queryInput.trim())}
                    className="px-4 h-10 rounded-xl bg-slate-900 text-white text-[12px] font-bold hover:bg-slate-700 transition-colors"
                  >
                    검색
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { key: 'all', label: '전체' },
                    { key: 'high', label: '고위험' },
                    { key: 'mid', label: '중간' },
                    { key: 'low', label: '낮음' },
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setRiskFilter(f.key as typeof riskFilter)}
                      className={`px-3 h-10 rounded-xl text-[12px] font-bold border transition-all ${
                        riskFilter === f.key
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-white border-gray-200 text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setQuery('');
                      setQueryInput('');
                      setRiskFilter('all');
                      setPage(1);
                    }}
                    className={`px-3 h-10 rounded-xl text-[12px] font-bold border transition-all ${
                      hasActiveSearch
                        ? 'bg-white border-gray-300 text-gray-600 hover:text-gray-800'
                        : 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                    }`}
                    disabled={!hasActiveSearch}
                  >
                    초기화
                  </button>
                </div>
              </div>
            </div>

            {loadError && (
              <div className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                {loadError}
              </div>
            )}

            <div className="bg-white border border-emerald-50 rounded-2xl overflow-hidden custom-shadow">
              <div className="grid grid-cols-[minmax(0,1fr)_64px_56px] md:grid-cols-[1fr_76px_68px] gap-3 md:gap-4 px-4 md:px-6 py-3 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <div>리뷰</div>
                <div className="text-right">광고</div>
                <div className="text-right">등급</div>
              </div>

              {pagedItems.length > 0 ? pagedItems.map((item) => {
                const rank = getRank(item.trust_score);
                const adTone = item.ad_probability >= 70 ? 'bg-red-400' : item.ad_probability >= 40 ? 'bg-amber-400' : 'bg-emerald-400';
                return (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/result?id=${item.id}`)}
                    className="grid grid-cols-[minmax(0,1fr)_64px_56px] md:grid-cols-[1fr_76px_68px] gap-3 md:gap-4 px-4 md:px-6 py-4 cursor-pointer hover:bg-emerald-50/40 transition-colors group border-b border-gray-50 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <p className="text-[14px] font-extrabold text-on-surface truncate group-hover:text-emerald-600 transition-colors">
                        {item.blog_title || '제목 없음'}
                      </p>
                      {item.real_summary && (
                        <p className="text-[12px] text-on-surface-variant mt-0.5 line-clamp-1 break-keep">
                          {item.real_summary}
                        </p>
                      )}
                      <p className="text-[11px] text-gray-300 font-medium mt-1.5">
                        {formatDate(item.created_at)} · {(item.platform || 'general').toUpperCase()}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0 flex items-center justify-end gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${adTone}`} />
                      <p className="text-[15px] font-extrabold leading-tight text-slate-700">
                        {item.ad_probability}%
                      </p>
                    </div>

                    <div className="flex justify-end items-center">
                      <span className={`text-[15px] font-black ${rank.tone}`}>{rank.grade}</span>
                    </div>
                  </div>
                );
              }) : (
                <div className="px-4 md:px-5 py-12 text-center">
                  <p className="text-[14px] font-bold text-slate-700 mb-1">조건에 맞는 분석 내역이 없어요</p>
                  <p className="text-[12px] text-slate-400">검색어를 바꾸거나 필터를 조정해보세요</p>
                </div>
              )}
            </div>

            {/* 페이지네이션 */}
            {total > 0 && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-xl border border-emerald-50 bg-white custom-shadow flex items-center justify-center text-on-surface-variant disabled:opacity-30 hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .reduce<(number | '…')[]>((acc, p, i, arr) => {
                    if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push('…');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === '…' ? (
                      <span key={`ellipsis-${i}`} className="text-[13px] text-gray-300 px-1">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={`w-9 h-9 rounded-xl text-[13px] font-bold transition-all ${
                          currentPage === p
                            ? 'bg-emerald-600 text-white custom-shadow'
                            : 'bg-white border border-emerald-50 custom-shadow text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 rounded-xl border border-emerald-50 bg-white custom-shadow flex items-center justify-center text-on-surface-variant disabled:opacity-30 hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            )}

            {/* 총 개수 */}
            <p className="text-center text-[11px] text-gray-300 font-medium mt-4">
              총 {total}건 · {currentPage}/{totalPages} 페이지
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default History;
