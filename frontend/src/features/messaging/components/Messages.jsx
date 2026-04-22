import { useState, useEffect, useRef } from 'react';
import { useConversations, useChat } from '../';
import { useAuth } from '../../auth';
import InboxRow from './InboxRow';
import ChatBox from './ChatBox';
import { requestsService } from '../../requests/services/requestsService';

const Messages = () => {
  const { activeRole } = useAuth();
  const { chat, closeChat } = useChat();
  const { conversations, loading, error, refresh, markAsRead } = useConversations();
  const [selectedConv, setSelectedConv] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const processedChatRef = useRef(null);

  // Sync selected conversation with global chat state (from openChat calls)
  useEffect(() => {
    // Only process if chat is present AND it's different from the last one we handled
    const chatKey = chat ? `${chat.contextType}-${chat.contextId}-${chat.receiverId}` : null;
    
    if (chat && chatKey !== processedChatRef.current) {
      // Find the conversation that matches the context or receiver
      const match = conversations.find(c => 
        (c.context_type === chat.contextType && c.context_id === chat.contextId) ||
        (c.other_participant_id === chat.receiverId && c.context_id === chat.contextId)
      );
      
      if (match) {
        setSelectedConv(match);
        if (match.unread_count > 0) {
          markAsRead(match.id);
        }
        processedChatRef.current = chatKey;
      } else if (conversations.length > 0 || !loading) {
        // Only create virtual if we've finished loading or have some data
        // to avoid race conditions with initial fetch
        setSelectedConv({
          id: 'v-' + chat.contextId,
          is_virtual: true,
          context_type: chat.contextType,
          context_id: chat.contextId,
          context_title: chat.title,
          other_participant_name: chat.subtitle || 'Owner',
          other_participant_id: chat.receiverId,
          user_role: activeRole,
          messages: []
        });
        processedChatRef.current = chatKey;
      }
    }
  }, [chat, conversations, markAsRead, activeRole, loading]);

  // Role filtering for the inbox list
  const [inboxFilter, setInboxFilter] = useState(activeRole);
  const filteredConversations = conversations.filter(conv => conv.user_role === inboxFilter);

  // Sync filter if global role changes (e.g. from navbar)
  useEffect(() => {
    setInboxFilter(activeRole);
  }, [activeRole]);

  const handleSelectConv = async (conv) => {
    setSelectedConv(conv);
    if (conv.unread_count > 0) {
      await markAsRead(conv.id);
    }
  };

  // Reset selected conversation if filter switches and it's no longer in view
  useEffect(() => {
    if (selectedConv && !selectedConv.id.startsWith('v-') && !filteredConversations.find(c => c.id === selectedConv.id)) {
      setSelectedConv(null);
    }
  }, [inboxFilter, filteredConversations, selectedConv]);

  const handleRequestAction = async (action) => {
    if (!selectedConv || actionLoading) return;
    setActionLoading(true);
    try {
      if (action === 'approve') {
        await requestsService.approve(selectedConv.context_id);
      } else {
        await requestsService.reject(selectedConv.context_id);
      }
      // Refresh to get updated status
      await refresh();
      // Update selected conv locally to reflect status change immediately
      setSelectedConv(prev => ({ ...prev, context_status: action === 'approve' ? 'APPROVED' : 'REJECTED' }));
    } catch (err) {
      console.error('Action failed:', err);
      alert('Failed to update request status. Please try again.');
    } finally {
      setActionLoading(false);
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
        <h1 className="text-4xl font-black text-white">
          Inbox
        </h1>
        <p className="text-text-secondary mt-1">
          {inboxFilter === 'OWNER' 
            ? 'Manage inquiries and requests for your properties.' 
            : 'Track your applications and messages with owners.'}
        </p>
      </div>

      {/* Main Split-Pane */}
      <div className="flex-1 flex overflow-hidden glass-panel border-white/5 bg-white/1 rounded-3xl shadow-2xl">
        {/* Sidebar */}
        <div className={`flex-col border-r border-white/5 bg-white/1 transition-all duration-500 overflow-hidden ${
          selectedConv ? 'hidden lg:flex lg:w-96' : 'flex w-full lg:w-96'
        }`}>
          {/* Role Toggle Sidebar */}
          <div className="p-4 bg-white/2 border-b border-white/5 flex gap-2">
            <button 
              onClick={() => setInboxFilter('TENANT')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${
                inboxFilter === 'TENANT' ? 'bg-accent text-white shadow-lg' : 'text-text-muted hover:bg-white/5'
              }`}
            >
              Renting
              {conversations.filter(c => c.user_role === 'TENANT' && c.unread_count > 0).length > 0 && (
                <span className="w-2 h-2 rounded-full bg-danger animate-pulse"></span>
              )}
            </button>
            <button 
              onClick={() => setInboxFilter('OWNER')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${
                inboxFilter === 'OWNER' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:bg-white/5'
              }`}
            >
              Hosting
              {conversations.filter(c => c.user_role === 'OWNER' && c.unread_count > 0).length > 0 && (
                <span className="w-2 h-2 rounded-full bg-danger animate-pulse"></span>
              )}
            </button>
          </div>

          <div className="p-4 border-b border-white/5 bg-white/1">
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search messages..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-xs text-white focus:border-primary/50 outline-none transition-all placeholder:text-text-muted/50"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-white/5">
            {filteredConversations.length > 0 ? (
              filteredConversations.map(conv => (
                <div key={conv.id} className="p-1">
                  <InboxRow 
                    conversation={conv} 
                    onClick={handleSelectConv}
                    active={selectedConv?.id === conv.id}
                  />
                </div>
              ))
            ) : (
              <div className="p-12 text-center opacity-70">
                 <div className="text-4xl mb-4">{inboxFilter === 'OWNER' ? '🏠' : '📭'}</div>
                 <p className="text-sm font-bold uppercase tracking-widest text-text-muted">
                   No {inboxFilter === 'OWNER' ? 'hosting' : 'renting'} messages
                 </p>
              </div>
            )}
          </div>
        </div>

        {/* Content Pane */}
        <div className={`flex-1 flex flex-col bg-bg-base/20 transition-all duration-500 overflow-hidden ${
          !selectedConv ? 'hidden lg:flex' : 'flex'
        }`}>
          {selectedConv ? (
            <div className="flex flex-row h-full">
              {/* Chat Thread */}
              <div className="flex-1 flex flex-col border-r border-white/5">
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
                          <div className="flex items-center gap-2">
                             <h3 className="font-bold text-white text-base leading-tight">
                               {selectedConv.other_participant_name}
                             </h3>
                             <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-text-muted uppercase tracking-tighter">
                                {selectedConv.user_role === 'OWNER' ? 'Tenant' : 'Host'}
                             </span>
                          </div>
                          <p className="text-[10px] uppercase tracking-widest text-primary font-bold mt-0.5">
                            {selectedConv.context_title || selectedConv.context_type}
                          </p>
                        </div>
                     </div>
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

              {/* Contextual Sidebar (Airbnb Style) */}
              <div className="hidden xl:flex w-80 flex-col bg-white/2 p-8">
                 <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-text-muted mb-6">Details</h4>
                 <div className="glass-panel p-6 border-white/10 flex flex-col gap-5">
                    <div className="aspect-video w-full rounded-xl bg-white/5 flex items-center justify-center text-3xl">
                       {selectedConv.context_type === 'PROPERTY' ? '🏠' : selectedConv.context_type === 'TICKET' ? '🔧' : '📝'}
                    </div>
                    <div>
                       <div className="flex items-center justify-between gap-2 mb-2">
                          <p className="text-xs font-bold text-primary uppercase tracking-widest">{selectedConv.context_type}</p>
                          {selectedConv.context_status && (
                             <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                                selectedConv.context_status === 'APPROVED' || selectedConv.context_status === 'Available'
                                ? 'text-success border-success/20 bg-success/5'
                                : selectedConv.context_status === 'PENDING'
                                ? 'text-warning border-warning/20 bg-warning/5'
                                : 'text-text-muted border-white/10 bg-white/5'
                             }`}>
                                {selectedConv.context_status}
                             </span>
                          )}
                       </div>
                       <h5 className="font-bold text-white text-base leading-tight">{selectedConv.context_title}</h5>
                    </div>
                    
                    <div className="pt-4 border-t border-white/5 flex flex-col gap-4">
                       <div className="flex justify-between items-center text-[11px]">
                          <span className="text-text-muted font-medium italic">
                             {selectedConv.user_role === 'OWNER' ? 'Applicant' : 'Property Owner'}
                          </span>
                          <span className="text-white font-bold">{selectedConv.other_participant_name}</span>
                       </div>
                       <div className="flex justify-between items-center text-[11px]">
                          <span className="text-text-muted font-medium">Last active</span>
                          <span className="text-white font-bold">{new Date(selectedConv.last_message_at || Date.now()).toLocaleDateString()}</span>
                       </div>
                    </div>
                 </div>

                 {/* Role-Specific Actions */}
                 {selectedConv.context_type === 'RENTAL_REQUEST' && activeRole === 'OWNER' && selectedConv.context_status === 'PENDING' && (
                    <div className="mt-8 flex flex-col gap-3">
                       <button 
                          onClick={() => handleRequestAction('approve')}
                          disabled={actionLoading}
                          className="btn btn-primary w-full py-3 text-sm flex items-center justify-center"
                       >
                          {actionLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Approve Request'}
                       </button>
                       <button 
                          onClick={() => handleRequestAction('reject')}
                          disabled={actionLoading}
                          className="w-full py-3 text-sm font-bold text-danger border border-danger/20 rounded-xl hover:bg-danger/5 transition-colors disabled:opacity-50"
                       >
                          Reject Request
                       </button>
                    </div>
                 )}
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
