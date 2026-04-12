import React from 'react';

const StatsCard = ({ title, value, icon, trend, color = 'blue' }) => {
  const colorMap = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-blue-500/10',
    green: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-purple-500/10',
    orange: 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-amber-500/10',
  };

  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <div className="glass-panel group p-6 flex items-center gap-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border ${selectedColor} transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      <div className="flex flex-col">
        <h3 className="text-2xl font-black text-white">{value}</h3>
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-secondary">{title}</p>
        {trend && (
           <span className="text-[10px] font-bold text-success/80 mt-1">{trend}</span>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
