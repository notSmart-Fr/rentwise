import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { useChartDimensions } from '../../../../shared/hooks/useChartDimensions';

const OccupancyChart = ({ data }) => {
  const [containerRef, dimensions] = useChartDimensions();

  if (!data || data.length === 0) return null;

  const COLORS = ['#7C3AED', '#334155']; // Primary and Slate-700
  
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const rentedPercentage = Math.round((data.find(d => d.name === 'Rented')?.value || 0) / total * 100);

  return (
    <div className="w-full h-full p-8 bg-[#131b2e] rounded-[2.5rem] shadow-2xl overflow-hidden relative outline-none" tabIndex="-1">
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-emerald-500 to-primary opacity-60"></div>
      
      <div className="mb-4">
        <h3 className="text-white font-black uppercase tracking-widest text-xs">Property Occupancy</h3>
        <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Portfolio Status</p>
      </div>

      <div className="relative w-full h-56" ref={containerRef}>
        {dimensions.width > 0 && dimensions.height > 0 && (
          <PieChart 
            width={dimensions.width} 
            height={dimensions.height}
            className="outline-none"
            accessibilityLayer={false}
          >
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={8}
              dataKey="value"
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  stroke="none"
                  className="transition-all duration-300 hover:scale-105 transform-origin-center"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                backdropFilter: 'blur(16px)',
                padding: '8px'
              }}
              itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
            />
          </PieChart>
        )}
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-black text-white leading-none">{rentedPercentage}%</span>
          <span className="text-[10px] text-slate-500 font-black uppercase tracking-tighter mt-1">Full</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-6">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
            <span className="text-[10px] font-bold text-white uppercase tracking-tighter">{entry.name} ({entry.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OccupancyChart;
