import { apiRequest } from '../../../shared/services/api';

export const paymentsService = {
  getById: async (id) => {
    return await apiRequest(`/payments/${id}`, { method: 'GET' });
  },

  getByRequest: async (requestId) => {
    return await apiRequest(`/payments/request/${requestId}`, { method: 'GET' });
  },

  getTenantByRequest: async (requestId) => {
    return await apiRequest(`/payments/tenant/request/${requestId}`, { method: 'GET' });
  },

  create: async (paymentData) => {
    return await apiRequest('/payments', {
      method: 'POST',
      body: paymentData
    });
  },

  update: async (id, paymentData) => {
    return await apiRequest(`/payments/${id}`, {
      method: 'PATCH',
      body: paymentData
    });
  },

  listOwnerPayments: async () => {
    return await apiRequest('/owner/payments', { method: 'GET' });
  },

  listTenantPayments: async () => {
    return await apiRequest('/tenant/payments', { method: 'GET' });
  }
};

export default paymentsService;
