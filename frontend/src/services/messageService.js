import { apiRequest } from './api';

const messageService = {
  getMessages: async (contextType, contextId) => {
    return await apiRequest(`/messages/context/${contextType}/${contextId}`, { method: 'GET' });
  },

  sendMessage: async (contextType, contextId, content) => {
    return await apiRequest(`/messages/context/${contextType}/${contextId}`, {
      method: 'POST',
      body: { content }
    });
  }
};

export default messageService;
