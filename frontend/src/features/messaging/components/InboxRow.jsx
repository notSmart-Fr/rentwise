import React from 'react';

const InboxRow = ({ conversation, onClick, active }) => {
  const isUnread = conversation.unread_count > 0;

  return (
    <button
      onClick={() => onClick(conversation)}
      className={`w-full text-left p-6 flex items-center gap-5 transition-all duration-300 hover:bg-white/3 active:scale-[0.98] ${
        active ? 'bg-primary/10 border-primary/20 border-l-4 border-l-primary' : 'bg-transparent border-white/5'
      } ${
        isUnread ? 'ring-1 ring-primary/5' : ''
      }`}
    >
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-primary/20 to-accent/20 flex items-center justify-center text-xl shadow-lg">
          {conversation.other_participant_name?.[0]?.toUpperCase() || '👤'}
        </div>
        {isUnread && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger rounded-full border-2 border-bg-base animate-pulse shadow-lg" />
        )}
      </div>

      <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={`text-lg transition-colors group-hover:text-white truncate ${isUnread ? 'font-black text-white' : 'font-bold text-text-primary'}`}>
              {conversation.other_participant_name || 'Resident'}
            </h4>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted shrink-0">
            {new Date(conversation.last_message_at || conversation.last_message_time).toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </span>
        
        <div className="flex items-center justify-between gap-4">
          <p className={`text-sm truncate ${isUnread ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
            {conversation.last_message_content || 'No messages yet'}
          </p>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
            {conversation.context_type || 'General'}
          </span>
        </div>
      </div>
    </button>
  );
};

export default InboxRow;
