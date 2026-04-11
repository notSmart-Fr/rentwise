import React, { useState, useEffect } from 'react';
import messageService from './messageService';
import InboxRow from './InboxRow';
import { useChat } from './ChatContext';
import './Inbox.css';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { openChat } = useChat();

  const fetchConversations = async () => {
    try {
      const data = await messageService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to fetch conversations', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenConversation = async (conv) => {
    openChat(
      conv.context_type, 
      conv.context_id, 
      conv.context_title, 
      null, 
      conv.other_participant_id
    );
    
    if (conv.unread_count > 0) {
      try {
        await messageService.markAsRead(conv.id);
        setConversations(prev => prev.map(c => 
          c.id === conv.id ? { ...c, unread_count: 0 } : c
        ));
      } catch (err) {
        console.error('Failed to mark as read', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="container p-top-5 flex-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="messages-page container animate-fade-in p-top-5">
      <div className="section-header m-bottom-5">
        <h1 className="dashboard-title">My Messages</h1>
        <p className="dashboard-subtitle">Track your inquiries and lease discussions</p>
      </div>

      {conversations.length > 0 ? (
        <div className="inbox-list">
          {conversations.map(conv => (
            <InboxRow 
              key={conv.id} 
              conversation={conv} 
              onClick={handleOpenConversation} 
            />
          ))}
        </div>
      ) : (
        <div className="inbox-empty glass-panel p-5">
          <h3>No messages yet</h3>
          <p>When you inquire about properties, your conversations will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
