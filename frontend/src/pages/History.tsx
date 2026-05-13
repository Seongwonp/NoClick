import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AnalysisResponse } from '../types/analysis';
import { apiService } from '../services/api';

const PAGE_SIZE = 10;

const getRank = (score: number) => {
  if (score >= 93) return { grade: 'S', color: '#10b981' };
  if (score >= 85) return { grade: 'A', color: '#22c55e' };
  if (score >= 70) return { grade: 'B', color: '#f59e0b' };
  return { grade: 'C', color: '#ef4444' };
};

const History: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<AnalysisResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const result = await apiService.getHistory(page, PAGE_SIZE);
        setItems(result.items);
        setTotal(result.total);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [page]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen pt-16 relative">
      <div className="fixed top-[-10%] right-[-5%] w-[420px] h-[420px] bg-emerald-100/10 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-100/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-2xl mx-auto px-4 md:px-6 pt-10 pb-20">

        {/* 헤더 */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] font-extrabold text-on-surface-variant uppercase tracking-wider mb-1">분석 기록</p>
            <h1 className="text-[28px] font-black text-on-surface tracking-tight leading-none">내 리뷰 히스토리</h1>
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
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="w-16 h-16 bg-white rounded-[1.5rem] border border-emerald-50 custom-shadow flex items-center justify-center mb-5">
              <span className="material-symbols-outlined text-[28px] text-gray-300">history</span>
            </div>
            <p className="text-[16px] font-extrabold text-on-surface mb-1">아직 분석 내역이 없어요</p>
            <p className="text-[13px] text-on-surface-variant mb-6">첫 번째 리뷰를 분석해보세요</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-emerald-600 text-white font-bold text-[14px] rounded-2xl hover:bg-emerald-700 transition-all"
            >
              분석 시작하기
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {items.map((item) => {
                const rank = getRank(item.trust_score);
                const adColor = item.ad_probability >= 70 ? '#ef4444' : item.ad_probability >= 40 ? '#f59e0b' : '#10b981';
                return (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/result?id=${item.id}`)}
                    className="bg-white rounded-[2rem] border border-emerald-50 custom-shadow px-6 py-5 cursor-pointer hover:translate-y-[-2px] transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      {/* 등급 뱃지 */}
                      <div
                        className="w-10 h-10 rounded-[1rem] flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: `${rank.color}15`, border: `1.5px solid ${rank.color}40` }}
                      >
                        <span className="text-[18px] font-black" style={{ color: rank.color }}>{rank.grade}</span>
                      </div>

                      {/* 내용 */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-extrabold text-on-surface truncate group-hover:text-emerald-600 transition-colors">
                          {item.blog_title || '제목 없음'}
                        </p>
                        {item.real_summary && (
                          <p className="text-[12px] text-on-surface-variant mt-0.5 line-clamp-1 break-keep">
                            {item.real_summary}
                          </p>
                        )}
                        <p className="text-[11px] text-gray-300 font-medium mt-1.5">{formatDate(item.created_at)}</p>
                      </div>

                      {/* 오른쪽 수치 */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-[11px] text-on-surface-variant font-semibold">광고</p>
                        <p className="text-[18px] font-black leading-tight" style={{ color: adColor }}>
                          {item.ad_probability}%
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-9 h-9 rounded-xl border border-emerald-50 bg-white custom-shadow flex items-center justify-center text-on-surface-variant disabled:opacity-30 hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
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
                          page === p
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
                  disabled={page === totalPages}
                  className="w-9 h-9 rounded-xl border border-emerald-50 bg-white custom-shadow flex items-center justify-center text-on-surface-variant disabled:opacity-30 hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            )}

            {/* 총 개수 */}
            <p className="text-center text-[11px] text-gray-300 font-medium mt-4">
              총 {total}건 · {page}/{totalPages} 페이지
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default History;
