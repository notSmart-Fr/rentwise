import { apiRequest } from '../../../shared/services/api';

const messageService = {
  getMessages: async (contextType, contextId, receiverId = null) => {
    let url = `/messages/context/${contextType}/${contextId}`;
    if (receiverId) url += `?receiver_id=${receiverId}`;
    return await apiRequest(url, { method: 'GET' });
  },

  sendMessage: async (contextType, contextId, content, receiverId = null) => {
    let url = `/messages/context/${contextType}/${contextId}`;
    if (receiverId) url += `?receiver_id=${receiverId}`;
    
    return await apiRequest(url, {
      method: 'POST',
      body: { content }
    });
  },

  getConversations: async () => {
    return await apiRequest('/conversations', { method: 'GET' });
  },

  markAsRead: async (conversationId) => {
    return await apiRequest(`/conversations/${conversationId}/read`, { method: 'PATCH' });
  }
};

export default messageService;
