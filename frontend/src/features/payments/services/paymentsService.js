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

  async getAnalytics() {
    return await apiRequest('/owner/analytics', { method: 'GET' });
  }

  async downloadReceipt(paymentId, isOwner = false) {
    const rolePrefix = isOwner ? '/owner' : '/tenant';
    const response = await fetch(`${import.meta.env.VITE_API_URL}${rolePrefix}/payments/${paymentId}/receipt`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to download receipt');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${paymentId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async exportPaymentsCsv() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/owner/payments/export/csv`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to export payments');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rentwise-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}




export const paymentsService = new PaymentsService();
export default paymentsService;
