import { useState, useEffect, useCallback } from 'react';
import messageService from '../services/messageService';
import { useWebSocket } from '../../../shared/context/WebSocketContext';

export const useConversations = () => {
  const { subscribe } = useWebSocket();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConversations = useCallback(async (isInitial = false) => {
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
  }, []);

  useEffect(() => {
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
  }, [fetchConversations, subscribe]);

  const markAsRead = async (conversationId) => {
    try {
      await messageService.markAsRead(conversationId);
      setConversations(prev => prev.map(c =>
        c.id === conversationId ? { ...c, unread_count: 0 } : c
      ));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);

  return {
    conversations,
    loading,
    error,
    refresh: fetchConversations,
    markAsRead,
    totalUnread
  };
};

export default useConversations;
