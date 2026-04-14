import React from 'react';
import { Link } from 'react-router-dom';
import { useConversations, useChat } from '../../features/messaging';

const ChatItem = ({ conversation, onClick }) => {
  const { context_title, last_message, last_message_at, unread_count, other_participant_name } = conversation;

  return (
    <div
      onClick={() => onClick(conversation)}
      className={`group flex items-start gap-4 p-4 transition-all hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 ${unread_count > 0 ? 'bg-white/2' : ''}`}
    >
      <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform`}>
        <span className="text-lg">💬</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className={`text-sm font-black truncate ${unread_count > 0 ? 'text-white' : 'text-slate-400'}`}>
            {other_participant_name}
          </h4>
          <span className="text-[10px] text-slate-500 whitespace-nowrap">
            {last_message_at ? new Date(last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
          </span>
        </div>
        <p className="text-[10px] font-black uppercase text-primary/60 tracking-widest truncate mt-0.5">
          {context_title}
        </p>
        <p className="mt-1 text-xs text-slate-500 line-clamp-1 italic">
          {last_message || 'Start a conversation...'}
        </p>
      </div>

      {unread_count > 0 && (
        <div className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
      )}
    </div>
  );
};

const ChatDropdown = ({ onClose }) => {
  const { conversations, loading } = useConversations();
  const { openChat } = useChat();

  const handleChatClick = (conversation) => {
    openChat(
      conversation.context_type,
      conversation.context_id,
      conversation.context_title
    );
    onClose();
  };

  return (
    <div className="absolute right-0 top-full mt-4 w-80 sm:w-96 rounded-2xl border border-white/10 bg-bg-base/95 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl animate-in fade-in slide-in-from-top-4 duration-300 z-110">
      <div className="flex items-center justify-between p-4 pb-2 border-b border-white/5">
        <h3 className="text-sm font-black uppercase tracking-widest text-white">Messages</h3>
      </div>

      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="p-8 text-center text-slate-500 animate-pulse font-bold tracking-widest text-[10px] uppercase">
            Loading Messages...
          </div>
        ) : conversations.length > 0 ? (
          conversations.slice(0, 8).map(conv => (
            <ChatItem 
              key={conv.id} 
              conversation={conv} 
              onClick={handleChatClick} 
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="mb-4 text-3xl opacity-30">💬</div>
            <p className="text-sm font-bold text-white mb-1">Silence is golden</p>
            <p className="text-xs text-slate-500">No active conversations found.</p>
          </div>
        )}
      </div>

      <div className="p-2 border-t border-white/5">
        <Link 
          to="/messages"
          onClick={onClose}
          className="block w-full text-center py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
        >
          View full inbox
        </Link>
      </div>
    </div>
  );
};

export default ChatDropdown;
