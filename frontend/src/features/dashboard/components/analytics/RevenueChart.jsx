import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const RevenueChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
        <span className="text-4xl mb-4">📊</span>
        <p className="text-white font-bold">No revenue data yet</p>
        <p className="text-slate-500 text-xs uppercase tracking-widest mt-1">Start recording payments to see analytics</p>
      </div>
    );
  }

  return (
    <div className="w-full h-80 p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden relative group">
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary to-accent opacity-50"></div>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-white font-black uppercase tracking-widest text-xs">Revenue Trends</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Monthly breakdown (৳)</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]"></div>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Gross Income</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="80%" minWidth={0} minHeight={0} debounce={50}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.9)', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              backdropFilter: 'blur(16px)',
              padding: '12px'
            }}
            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
            labelStyle={{ color: '#64748b', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'black' }}
            formatter={(value) => [`৳${value.toLocaleString()}`, 'Revenue']}
          />
          <Bar 
            dataKey="amount" 
            radius={[6, 6, 0, 0]}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === data.length - 1 ? 'url(#barGradPrimary)' : 'rgba(255,255,255,0.1)'} 
                className="transition-all duration-300 hover:opacity-80"
              />
            ))}
          </Bar>
          <defs>
            <linearGradient id="barGradPrimary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
