import React, { useState, useEffect } from 'react';
import { useConversations } from '../hooks/useConversations';
import InboxRow from './InboxRow';
import ChatBox from './ChatBox';

const Messages = () => {
  const { conversations, loading, error, refresh, markAsRead } = useConversations();
  const [selectedConv, setSelectedConv] = useState(null);

  const handleSelectConv = async (conv) => {
    setSelectedConv(conv);
    if (conv.unread_count > 0) {
      await markAsRead(conv.id);
    }
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="container pt-40 px-6 mx-auto min-h-[70vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg shadow-primary/20"></div>
        <p className="text-text-secondary font-medium animate-pulse">Gathering your conversations...</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 container mx-auto px-6 h-[90vh] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="mb-8 border-l-4 border-primary pl-6">
        <h1 className="text-4xl font-black text-white">Inbox</h1>
        <p className="text-text-secondary mt-1">Manage all your platform inquiries in one place.</p>
      </div>

      {/* Main Split-Pane */}
      <div className="flex-1 flex overflow-hidden glass-panel border-white/5 bg-white/1 rounded-3xl shadow-2xl">
        {/* Sidebar */}
        <div className={`flex-col border-r border-white/5 bg-white/1 transition-all duration-500 overflow-hidden ${
          selectedConv ? 'hidden lg:flex lg:w-96' : 'flex w-full lg:w-96'
        }`}>
          <div className="p-6 border-b border-white/5 bg-white/2">
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="Filter inquiries..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-xs text-white focus:border-primary/50 outline-none transition-all placeholder:text-text-muted/50"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-white/5">
            {conversations.length > 0 ? (
              conversations.map(conv => (
                <div key={conv.id} className="p-1">
                  <InboxRow 
                    conversation={conv} 
                    onClick={handleSelectConv}
                    // Since InboxRow uses glass-panel already, maybe we should simplify it or use different style here
                  />
                </div>
              ))
            ) : (
              <div className="p-12 text-center opacity-70">
                 <div className="text-4xl mb-4">📭</div>
                 <p className="text-sm font-bold uppercase tracking-widest text-text-muted">Inbox is empty</p>
              </div>
            )}
          </div>
        </div>

        {/* Content Pane */}
        <div className={`flex-1 flex flex-col bg-bg-base/20 transition-all duration-500 overflow-hidden ${
          !selectedConv ? 'hidden lg:flex' : 'flex'
        }`}>
          {selectedConv ? (
            <div className="flex flex-col h-full">
              {/* Active Header */}
              <div className="p-5 border-b border-white/5 bg-white/3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <button 
                     onClick={() => setSelectedConv(null)}
                     className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white"
                   >
                     ←
                   </button>
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-primary to-accent flex items-center justify-center text-white font-black text-sm shadow-lg">
                        {selectedConv.other_participant_name?.[0]?.toUpperCase() || '👤'}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base leading-tight">
                          {selectedConv.other_participant_name}
                        </h3>
                        <p className="text-[10px] uppercase tracking-widest text-primary font-bold mt-0.5">
                          {selectedConv.context_title || selectedConv.context_type}
                        </p>
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-text-muted hover:text-white transition-colors">
                     ⋮
                   </button>
                </div>
              </div>

              {/* Chat View */}
              <div className="flex-1 overflow-hidden">
                <ChatBox 
                  contextType={selectedConv.context_type} 
                  contextId={selectedConv.context_id} 
                  receiverId={selectedConv.other_participant_id} 
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-80">
               <div className="text-6xl mb-6">📬</div>
               <h3 className="text-xl font-bold text-white mb-2">Select a conversation</h3>
               <p className="text-text-secondary text-base max-w-xs px-6">Pick an inquiry from the side list to start managing the conversation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
