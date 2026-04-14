import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationItem from './NotificationItem';
import { useNotifications } from '../hooks/useNotifications';
import { useChat } from '../../features/messaging';

const NotificationDropdown = ({ onClose }) => {
  const navigate = useNavigate();
  const { notifications, markAsRead } = useNotifications();
  const { openChat } = useChat();

  const handleNotificationClick = async (notification) => {
    if (notification.type === 'MESSAGE') {
      const { data } = notification;
      openChat(
        data.contextType,
        data.contextId,
        notification.title,
        null, // No system message
        null  // participant ID handled by service
      );
      
      if (notification.unread) {
        await markAsRead(data.conversationId);
      }
    }
    
    // Closer dropdown after action
    onClose();
  };

  return (
    <div className="absolute right-0 top-full mt-4 w-80 sm:w-96 rounded-2xl border border-white/10 bg-bg-base/95 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl animate-in fade-in slide-in-from-top-4 duration-300 z-110">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2 border-b border-white/5">
        <h3 className="text-sm font-black uppercase tracking-widest text-white">Notifications</h3>
        <Link 
          to="/messages" 
          onClick={onClose}
          className="text-[10px] font-black uppercase tracking-tighter text-primary hover:text-white transition-colors"
        >
          View All Inbox
        </Link>
      </div>

      {/* List Area */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <NotificationItem 
              key={notif.id} 
              notification={notif} 
              onClick={handleNotificationClick} 
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="mb-4 text-3xl opacity-30">🔔</div>
            <p className="text-sm font-bold text-white mb-1">All caught up!</p>
            <p className="text-xs text-slate-500">Your property and inquiries are perfectly balanced.</p>
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      {notifications.length > 0 && (
        <div className="p-2 border-t border-white/5">
          <button className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
            Clear All Recent
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
