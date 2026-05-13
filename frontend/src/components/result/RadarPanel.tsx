import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts';
import type { AnalysisResponse } from '../../types/analysis';

interface RadarDataPoint {
  subject: string;
  A: number;
}

interface Props {
  result: AnalysisResponse;
  radarData: RadarDataPoint[];
}

const CustomTick = (props: any) => {
  const { x, y, payload } = props;
  return (
    <text x={x} y={y} dy={4} textAnchor="middle" fill="#94a3b8" fontSize={11} fontWeight={700}>
      {payload.value}
    </text>
  );
};

const RadarPanel: React.FC<Props> = ({ result, radarData }) => {
  const ds = result.dimension_scores;

  const bars = [
    { label: '진정성', value: ds?.authenticity ?? 50, color: '#10b981', desc: '개인 경험 기반 여부', textColor: 'text-emerald-600' },
    { label: '정보성', value: ds?.information ?? 50, color: '#10b981', desc: '가격·수치 등 실질 정보', textColor: 'text-emerald-600' },
    { label: '상세함', value: ds?.specificity ?? 50, color: '#10b981', desc: '구체적 묘사 수준', textColor: 'text-emerald-600' },
    { label: '과장성', value: ds?.exaggeration ?? 50, color: '#ef4444', desc: '수치가 높을수록 광고 신호', textColor: 'text-red-500', bad: true },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 flex-shrink-0">
          <span className="material-symbols-outlined text-[18px]">analytics</span>
        </div>
        <h3 className="text-[14px] md:text-[15px] font-extrabold text-on-surface tracking-tight">리뷰 성향 분석</h3>
      </div>

      {/* 레이더 차트 */}
      <div className="h-[200px] md:h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#f1f5f9" />
            <PolarAngleAxis dataKey="subject" tick={<CustomTick />} />
            <Radar name="Analysis" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.08} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* 바 차트 */}
      <div className="space-y-3">
        {bars.map((b) => (
          <div key={b.label}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[12px] font-bold text-gray-700">{b.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400">{b.desc}</span>
                <span className={`text-[12px] font-extrabold ${b.textColor}`}>{b.value}</span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${b.value}%`, backgroundColor: b.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-gray-300 text-right">{result.original_content?.length || 0}자 분석</p>
    </div>
  );
};

export default RadarPanel;
