import BaseApiService from '../../../shared/services/BaseApiService';
import { apiRequest } from '../../../shared/services/api';

class PaymentsService extends BaseApiService {
  constructor() {
    super('/payments');
  }

  async getByRequest(requestId) {
    return await apiRequest(`${this.resourcePath}/request/${requestId}`, { method: 'GET' });
  }

  async getTenantByRequest(requestId) {
    return await apiRequest(`/tenant/requests/${requestId}/payments`, { method: 'GET' });
  }

  async recordManualPayment(requestId, paymentData) {
    return await apiRequest(`/owner/requests/${requestId}/payments`, {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  }

  async listOwnerPayments() {
    return await apiRequest('/owner/payments', { method: 'GET' });
  }

  async listTenantPayments() {
    return await apiRequest('/tenant/payments', { method: 'GET' });
  }
}

export const paymentsService = new PaymentsService();
export default paymentsService;
