import React from 'react';

// Custom lightweight relative time formatter to avoid extra dependencies
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

const NotificationItem = ({ notification, onClick }) => {
  const { type, title, subtitle, timestamp, unread } = notification;

  const getIcon = () => {
    switch (type) {
      case 'MESSAGE': return '💬';
      case 'MAINTENANCE': return '🛠️';
      case 'PAYMENT': return '💰';
      default: return '🔔';
    }
  };

  const getColorClass = () => {
    switch (type) {
      case 'MESSAGE': return 'text-primary';
      case 'MAINTENANCE': return 'text-orange-400';
      case 'PAYMENT': return 'text-success';
      default: return 'text-blue-400';
    }
  };

  return (
    <div
      onClick={() => onClick(notification)}
      className={`group flex items-start gap-4 p-4 transition-all hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 ${
        unread ? 'bg-white/2' : ''
      }`}
    >
      <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform ${getColorClass()}`}>
        <span className="text-lg">{getIcon()}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className={`text-sm font-bold truncate ${unread ? 'text-white' : 'text-slate-400'}`}>
            {title}
          </h4>
          <span className="text-[10px] text-slate-500 whitespace-nowrap">
            {getRelativeTime(timestamp)}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {unread && (
        <div className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
      )}
    </div>
  );
};

export default NotificationItem;
