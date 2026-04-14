import React from 'react';

const getRelativeTime = (date) => {
  if (!date) return '';
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now - then) / 1000);

  if (diffInSeconds < 60) return 'just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return then.toLocaleDateString();
};

const AlertItem = ({ alert, onClick }) => {
  const { type, title, message, created_at, is_read } = alert;

  const getIcon = () => {
    switch (type) {
      case 'LEASE': return '📜';
      case 'PAYMENT': return '💰';
      case 'TICKET': return '🛠️';
      default: return '🔔';
    }
  };

  const getColorClass = () => {
    switch (type) {
      case 'LEASE': return 'text-primary';
      case 'PAYMENT': return 'text-success';
      case 'TICKET': return 'text-orange-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div
      onClick={() => onClick(alert)}
      className={`group flex items-start gap-4 p-4 transition-all hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 ${!is_read ? 'bg-white/2' : ''}`}
    >
      <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform ${getColorClass()}`}>
        <span className="text-lg">{getIcon()}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className={`text-sm font-black truncate ${!is_read ? 'text-white' : 'text-slate-400'}`}>
            {title}
          </h4>
          <span className="text-[10px] text-slate-500 whitespace-nowrap">
            {getRelativeTime(created_at)}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {message}
        </p>
      </div>

      {!is_read && (
        <div className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-accent shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
      )}
    </div>
  );
};

export default AlertItem;
