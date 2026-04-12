import { useState, useEffect, useRef, useCallback } from 'react';
import messageService from '../services/messageService';
import { useAuth } from '../../auth';
import { useWebSocket } from '../../../shared/context/WebSocketContext';

export const useMessages = (contextType, contextId, receiverId = null) => {
  const { user } = useAuth();
  const { subscribe } = useWebSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const fetchMessages = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const data = await messageService.getMessages(contextType, contextId, receiverId);
      setMessages(data || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setError(err.message || "Failed to load messages");
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [contextType, contextId, receiverId]);

  useEffect(() => {
    fetchMessages(true);
    
    // Polling fallback (slowed down to 30s for reliability)
    const interval = setInterval(() => fetchMessages(false), 30000);
    
    // Real-time message subscription
    const unsubscribe = subscribe('NEW_MESSAGE', (payload) => {
      if (payload.context_type === contextType && payload.context_id === contextId) {
        setMessages(prev => {
          // Prevent duplicates
          if (prev.some(m => m.id === payload.id)) return prev;
          // Filter out optimistic messages
          return [...prev.filter(m => !m.is_optimistic), payload];
        });
      }
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [fetchMessages, subscribe, contextType, contextId]);

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content) => {
    if (!content.trim()) return;

    // Optimistic Update
    const optimisticMsg = {
      id: `temp-${Date.now()}`,
      sender_id: user.id,
      content: content.trim(),
      created_at: new Date().toISOString(),
      is_optimistic: true
    };
    
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      await messageService.sendMessage(contextType, contextId, content.trim(), receiverId);
      // We don't need to fetchMessages() immediately anymore as the WebSocket will push it back
      // but we might want to refresh to ensure sync. Actually, let's just let WS handle it.
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message. Please try again.");
      // Rollback optimistic update
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
    }
  };

  return {
    messages,
    loading,
    error,
    messagesEndRef,
    sendMessage,
    refresh: fetchMessages,
    scrollToBottom
  };
};

export default useMessages;
