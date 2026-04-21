import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { useWebSocket } from '../../../shared/context/WebSocketContext';
import messageService from '../services/messageService';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { subscribe } = useWebSocket();
  
  const [chat, setChat] = useState(null); // Active chat
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchConversations = useCallback(async (isInitial = false) => {
    if (!isAuthenticated) return;
    if (isInitial) setLoading(true);
    setError(null);
    try {
      const data = await messageService.getConversations();
      setConversations(data || []);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      setError(err.message || 'Failed to load conversations');
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setConversations([]);
      setLoading(false);
      return;
    }

    fetchConversations(true);
    
    // Auto-refresh every 60 seconds as a silent backup
    const interval = setInterval(() => fetchConversations(false), 60000);
    
    // Real-time inbox updates
    const unsubscribe = subscribe('INBOX_UPDATE', () => {
      fetchConversations(false);
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [fetchConversations, subscribe, isAuthenticated]);

  const markAsRead = async (conversationId) => {
    try {
      // Optimistic update for immediate UI response
      setConversations(prev => prev.map(c =>
        c.id === conversationId ? { ...c, unread_count: 0 } : c
      ));
      
      await messageService.markAsRead(conversationId);
      return { success: true };
    } catch (err) {
      console.error('Failed to mark as read:', err);
      // Optional: If we want to revert, we would need to save the old state
      return { success: false, error: err.message };
    }
  };

  const openChat = (contextType, contextId, title, subtitle = null, receiverId = null) => {
    setChat({ contextType, contextId, title, subtitle, receiverId });
    navigate('/messages');
  };

  const closeChat = () => setChat(null);

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);

  const value = {
    chat,
    openChat,
    closeChat,
    conversations,
    loading,
    error,
    refresh: fetchConversations,
    markAsRead,
    totalUnread
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
