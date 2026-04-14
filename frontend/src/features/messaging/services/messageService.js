import BaseApiService from '../../../shared/services/BaseApiService';
import { apiRequest } from '../../../shared/services/api';

class MessageService extends BaseApiService {
  constructor() {
    super('/conversations');
  }

  async getMessages(contextType, contextId, receiverId = null) {
    let url = `/messages/context/${contextType}/${contextId}`;
    if (receiverId) url += `?receiver_id=${receiverId}`;
    return await apiRequest(url, { method: 'GET' });
  }

  async sendMessage(contextType, contextId, content, receiverId = null) {
    let url = `/messages/context/${contextType}/${contextId}`;
    if (receiverId) url += `?receiver_id=${receiverId}`;
    
    return await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify({ content })
    });
  }

  async getConversations() {
    return this.getAll();
  }

  async markAsRead(conversationId) {
    return await apiRequest(`${this.resourcePath}/${conversationId}/read`, { method: 'POST' });
  }
}

export const messageService = new MessageService();
export default messageService;
