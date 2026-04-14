'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Apr 1', revenue: 8200 },
  { day: 'Apr 2', revenue: 6800 },
  { day: 'Apr 3', revenue: 11200 },
  { day: 'Apr 4', revenue: 9400 },
  { day: 'Apr 5', revenue: 14600 },
  { day: 'Apr 6', revenue: 12100 },
  { day: 'Apr 7', revenue: 8700 },
  { day: 'Apr 8', revenue: 10300 },
  { day: 'Apr 9', revenue: 9800 },
  { day: 'Apr 10', revenue: 15200 },
  { day: 'Apr 11', revenue: 13700 },
  { day: 'Apr 12', revenue: 11900 },
  { day: 'Apr 13', revenue: 16800 },
  { day: 'Apr 14', revenue: 14500 },
];

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '12px' }}
          formatter={(v) => [`KES ${Number(v).toLocaleString()}`, 'Revenue']}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#16a34a"
          strokeWidth={2.5}
          fill="url(#revenueGradient)"
          dot={false}
          activeDot={{ r: 5, fill: '#16a34a' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
