import BaseApiService from './BaseApiService';
import { apiRequest } from './api';

class NotificationService extends BaseApiService {
  constructor() {
    super('/notifications');
  }

  async getNotifications(limit = 20) {
    return this.getAll({ limit });
  }

  async getUnreadCount() {
    const data = await apiRequest(`${this.resourcePath}/unread-count`, { method: 'GET' });
    return data.count;
  }

  async markAllAsRead() {
    return await apiRequest(`${this.resourcePath}/read`, { method: 'POST' });
  }

  async markAsRead(notificationId) {
    return await apiRequest(`${this.resourcePath}/${notificationId}/read`, { method: 'POST' });
  }
}

export const notificationService = new NotificationService();
export default notificationService;
