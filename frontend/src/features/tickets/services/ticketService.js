import BaseApiService from '../../../shared/services/BaseApiService';
import { apiRequest } from '../../../shared/services/api';

class TicketService extends BaseApiService {
  constructor() {
    super('/tickets');
  }

  async createTicket(propertyId, title, priority, initialMessage) {
    return await apiRequest('/tenant/tickets', {
      method: 'POST',
      body: JSON.stringify({
        property_id: propertyId,
        title,
        priority,
        initial_message: initialMessage
      })
    });
  }

  async getTenantTickets() {
    return await apiRequest('/tenant/tickets', { method: 'GET' });
  }

  async getOwnerTickets() {
    return await apiRequest('/owner/tickets', { method: 'GET' });
  }

  async updateTicketStatus(ticketId, status) {
    return await apiRequest(`/owner/tickets/${ticketId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  async getTenantTicket(ticketId) {
    return await apiRequest(`/tenant/tickets/${ticketId}`, { method: 'GET' });
  }

  async getOwnerTicket(ticketId) {
    return await apiRequest(`/owner/tickets/${ticketId}`, { method: 'GET' });
  }
}

export const ticketService = new TicketService();
export default ticketService;
