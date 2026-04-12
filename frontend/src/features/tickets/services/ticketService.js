import { apiRequest } from '../../../shared/services/api';

const ticketService = {
  createTicket: async (propertyId, title, priority, initialMessage) => {
    return await apiRequest('/tenant/tickets', {
      method: 'POST',
      body: {
        property_id: propertyId,
        title,
        priority,
        initial_message: initialMessage
      }
    });
  },

  getTenantTickets: async () => {
    return await apiRequest('/tenant/tickets', { method: 'GET' });
  },

  getOwnerTickets: async () => {
    return await apiRequest('/owner/tickets', { method: 'GET' });
  },

  updateTicketStatus: async (ticketId, status) => {
    return await apiRequest(`/owner/tickets/${ticketId}/status`, {
      method: 'PATCH',
      body: { status }
    });
  },

  getTenantTicket: async (ticketId) => {
    return await apiRequest(`/tenant/tickets/${ticketId}`, { method: 'GET' });
  },

  getOwnerTicket: async (ticketId) => {
    return await apiRequest(`/owner/tickets/${ticketId}`, { method: 'GET' });
  }
};

export default ticketService;
