import { useState, useEffect, useCallback } from 'react';
import messageService from '../services/messageService';

export const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await messageService.getConversations();
      setConversations(data);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      setError(err.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
    // Auto-refresh every 30 seconds for real-time feel (simple polling)
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

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
