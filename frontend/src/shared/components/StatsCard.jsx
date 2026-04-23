import React from 'react';

const StatsCard = ({ title, value, icon, trend, color = 'blue', onClick }) => {
  const colorMap = {
    blue: 'text-sky-400 bg-sky-500/10 border-sky-500/20 shadow-sky-500/10',
    green: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10',
    purple: 'text-primary bg-primary/10 border-primary/20 shadow-primary/10',
    orange: 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-amber-500/10',
  };

  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <div 
      onClick={onClick}
      className={`bg-[#131b2e] rounded-[2rem] group p-8 flex items-center gap-8 transition-all duration-700 border border-white/5 ${
        onClick 
          ? 'cursor-pointer hover:-translate-y-2 hover:border-primary/40 hover:bg-white/8 active:scale-95' 
          : 'hover:border-white/10'
      }`}
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border ${selectedColor} transition-all duration-700 group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0 shadow-2xl`}>
        {icon}
      </div>
      <div className="flex flex-col select-none">
        <h3 className="text-4xl font-black text-white leading-none tracking-tight">{value}</h3>
        <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500 mt-2">{title}</p>
        {trend && (
           <div className="flex items-center gap-1 mt-2">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-glow shadow-emerald-500"></span>
             <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{trend}</span>
           </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
