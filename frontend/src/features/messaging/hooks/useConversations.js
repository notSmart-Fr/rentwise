import { useChat } from '../context/ChatContext';

export const useConversations = () => {
  const { 
    conversations, 
    loading, 
    error, 
    refresh, 
    markAsRead, 
    totalUnread 
  } = useChat();

  return {
    conversations,
    loading,
    error,
    refresh,
    markAsRead,
    totalUnread
  };
};

export default useConversations;
