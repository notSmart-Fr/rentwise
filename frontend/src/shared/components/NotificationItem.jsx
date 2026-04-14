import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const NotificationItem = ({ notification, onClick }) => {
  const { type, title, subtitle, timestamp, unread } = notification;

  // Polymorphic Icon selection
  const getIcon = () => {
    switch (type) {
      case 'MESSAGE': return '💬';
      case 'MAINTENANCE': return '🛠️';
      case 'PAYMENT': return '💰';
      default: return '🔔';
    }
  };

  // Polymorphic Color selection
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
      className={`group flex items-start gap-4 p-4 transition-all hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 ${unread ? 'bg-white/2' : ''
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
            {timestamp ? formatDistanceToNow(new Date(timestamp), { addSuffix: true }) : ''}
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
