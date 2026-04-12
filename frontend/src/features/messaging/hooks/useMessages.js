import { useState, useEffect, useRef, useCallback } from 'react';
import messageService from '../services/messageService';
import { useAuth } from '../../auth';

export const useMessages = (contextType, contextId, receiverId = null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const fetchMessages = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const data = await messageService.getMessages(contextType, contextId, receiverId);
      setMessages(data);
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
    // Polling every 3 seconds for messages
    const interval = setInterval(() => fetchMessages(false), 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

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
      fetchMessages(false); // Refresh to get actual DB record
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
