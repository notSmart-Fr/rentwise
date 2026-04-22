import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useConversations, useChat } from '../../features/messaging';
import { useNotifications } from '../hooks/useNotifications';
import AlertItem from './AlertItem';

const MessageItem = ({ conversation, onClick }) => {
  const { 
    other_participant_name, 
    context_title, 
    last_message, 
    last_message_at, 
    unread_count,
    user_role 
  } = conversation;

  return (
    <div
      onClick={() => onClick(conversation)}
      className={`group flex items-start gap-4 p-4 transition-all hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 ${unread_count > 0 ? 'bg-white/2' : ''}`}
    >
      <div className="relative mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
        <span className="text-lg">👤</span>
        {unread_count > 0 && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary shadow-[0_0_10px_rgba(124,58,237,0.8)] animate-pulse" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h4 className={`text-sm font-black truncate ${unread_count > 0 ? 'text-white' : 'text-slate-400'}`}>
              {other_participant_name}
            </h4>
            <span className="text-[8px] font-black uppercase px-1 rounded bg-white/5 text-slate-500 border border-white/5">
              {user_role === 'OWNER' ? 'Tenant' : 'Host'}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 whitespace-nowrap font-medium">
            {last_message_at ? new Date(last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
          </span>
        </div>
        <p className="text-[9px] font-black uppercase text-primary/70 tracking-widest truncate mt-0.5">
          {context_title}
        </p>
        <p className={`mt-1 text-xs line-clamp-1 italic ${unread_count > 0 ? 'text-text-primary font-medium' : 'text-slate-500'}`}>
          {last_message || 'Start a conversation...'}
        </p>
      </div>
    </div>
  );
};

import { useAuth } from '../../features/auth';

const InboxDropdown = ({ onClose }) => {
  const navigate = useNavigate();
  const { activeRole } = useAuth();
  const [activeTab, setActiveTab] = useState('messages');
  const { conversations, loading: loadingMsgs, markAsRead } = useConversations();
  const { openChat } = useChat();
  const { notifications, markOneRead, markAllRead, loading: loadingAlerts, unreadCount: unreadAlerts } = useNotifications();

  const handleChatClick = async (conversation) => {
    openChat(
      conversation.context_type,
      conversation.context_id,
      conversation.context_title
    );
    if (conversation.unread_count > 0) {
      await markAsRead(conversation.id);
    }
    onClose();
  };

  const handleAlertClick = async (alert) => {
    await markOneRead(alert.id);
    if (alert.context_type === 'RENTAL_REQUEST') navigate('/dashboard');
    else if (alert.context_type === 'TICKET') navigate('/my-tickets');
    onClose();
  };

  const unreadMessages = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);

  return (
    <div className="absolute right-0 top-full mt-4 w-80 sm:w-96 rounded-3xl border border-white/10 bg-bg-base/95 p-2 shadow-[20px_40px_80px_rgba(0,0,0,0.7)] backdrop-blur-3xl animate-in fade-in slide-in-from-top-4 duration-300 z-110 overflow-hidden">
      {/* Tabs Header */}
      <div className="flex border-b border-white/5">
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
            activeTab === 'messages' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Messages
          {unreadMessages > 0 && <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-glow shadow-primary" />}
          {activeTab === 'messages' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-in slide-in-from-left duration-300" />}
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
            activeTab === 'alerts' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Alerts
          {unreadAlerts > 0 && <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-glow shadow-accent" />}
          {activeTab === 'alerts' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent animate-in slide-in-from-right duration-300" />}
        </button>
      </div>

      {/* Content Area */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {activeTab === 'messages' ? (
          <div className="animate-in fade-in slide-in-from-left-2 duration-300">
            {loadingMsgs ? (
              <div className="p-12 text-center text-[10px] font-black uppercase tracking-widest text-slate-600 animate-pulse">Syncing Inbox...</div>
            ) : conversations.filter(c => c.unread_count > 0).length > 0 ? (
              conversations
                .filter(c => c.unread_count > 0)
                .slice(0, 6)
                .map(conv => (
                  <MessageItem key={conv.id} conversation={conv} onClick={handleChatClick} />
                ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-8 text-center opacity-40">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-xs font-black uppercase tracking-widest">Your inbox is clear</p>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-2 duration-300">
            {loadingAlerts ? (
              <div className="p-12 text-center text-[10px] font-black uppercase tracking-widest text-slate-600 animate-pulse">Fetching Alerts...</div>
            ) : notifications.length > 0 ? (
              <>
                <div className="flex justify-end p-2 px-4 border-b border-white/5">
                   <button onClick={markAllRead} className="text-[9px] font-black uppercase text-accent hover:text-white transition-colors">Clear All</button>
                </div>
                {notifications.slice(0, 6).map(alert => (
                  <AlertItem key={alert.id} alert={alert} onClick={handleAlertClick} />
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-8 text-center opacity-40">
                <div className="text-4xl mb-4">✨</div>
                <p className="text-xs font-black uppercase tracking-widest">No system alerts</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/5 bg-white/2 flex items-center justify-between">
        <Link 
          to={activeTab === 'messages' ? "/messages" : (activeRole === 'OWNER' ? "/owner-dashboard" : "/tenant-dashboard")}
          onClick={onClose}
          className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors px-2 py-1 bg-white/5 rounded-lg border border-white/10"
        >
          {activeTab === 'messages' ? 'View All Messages' : 'Manage on Dashboard'}
        </Link>
        <span className="text-[9px] font-black uppercase tracking-tighter text-slate-600 pr-2">RentWise</span>
      </div>
    </div>
  );
};

export default InboxDropdown;
