"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type PrepProgressProps = {
  baselinePerDay: number;
  trend: { day: string; count: number; fewerThanBaseline: number }[];
};

export function PrepProgress({ baselinePerDay, trend }: PrepProgressProps) {
  return (
    <section className="panel panel--hero">
      <div className="panel__eyebrow">减烟趋势</div>
      <h2 className="panel__title">最近 7 天的数量变化</h2>
      <p className="panel__copy">
        图表对比基线：建档时填写的最近 7 天日均 <strong>{baselinePerDay} 支/天</strong>。
      </p>
      <div className="chart-shell">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={trend} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="smokingTrendFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#1e6f5c" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#1e6f5c" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(20, 18, 15, 0.08)" vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#1e6f5c"
              strokeWidth={3}
              fill="url(#smokingTrendFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="trend-list">
        {trend.map((item) => (
          <article key={item.day} className="trend-row">
            <div>
              <strong className="timeline-item__title">{item.day}</strong>
              <span className="timeline-item__kind">比基线少 {item.fewerThanBaseline} 支</span>
            </div>
            <strong className="trend-row__value">{item.count} 支</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
