import React, { useState } from 'react';
import { useAuth } from '../../auth';
import { useMessages } from '../hooks/useMessages';

const ChatBox = ({ contextType, contextId, receiverId }) => {
  const { user } = useAuth();
  const {
    messages,
    loading,
    error,
    messagesEndRef,
    sendMessage
  } = useMessagesInternal(contextType, contextId, receiverId);
  const [inputText, setInputText] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const content = inputText;
    setInputText('');
    await sendMessage(content);
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-text-muted animate-pulse">Establishing connection...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white/1">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-40 text-center">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-sm font-bold uppercase tracking-widest text-text-muted">No messages yet</p>
            <p className="text-xs text-text-secondary mt-1">Start the conversation below.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender_id && user?.id &&
              String(msg.sender_id).replace(/-/g, '').toLowerCase() ===
              String(user.id).replace(/-/g, '').toLowerCase();

            const showTime = index === 0 ||
              new Date(msg.created_at) - new Date(messages[index - 1].created_at) > 300000; // 5 mins gap

            return (
              <div key={msg.id} className="flex flex-col">
                {showTime && (
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] text-center mb-4">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}

                <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm transition-all animate-in fade-in slide-in-from-${isMe ? 'right' : 'left'}-2 ${isMe
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-white/10 text-white border border-white/5 rounded-bl-none backdrop-blur-md'
                      } ${msg.is_optimistic ? 'opacity-70 italic' : ''}`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-6 border-t border-white/5 bg-white/2">
        <form onSubmit={handleSend} className="relative flex items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-primary/50 outline-none transition-all placeholder:text-text-muted/50 focus:bg-white/8"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 rotate-45">
              <path d="M12 19L19 12M19 12L12 5M19 12H5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
