import BaseApiService from '../../../shared/services/BaseApiService';
import { apiRequest } from '../../../shared/services/api';

class RequestsService extends BaseApiService {
  constructor() {
    super('/requests');
  }

  // Tenant actions
  async create(propertyId, message) {
    return await apiRequest(`/tenant/properties/${propertyId}/requests`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }
  
  async getTenantRequests() {
    return await apiRequest('/tenant/requests', { method: 'GET' });
  }
  
  // Owner actions
  async getOwnerRequests() {
    return await apiRequest('/owner/requests', { method: 'GET' });
  }
  
  async approve(requestId) {
    return await apiRequest(`/owner/requests/${requestId}/approve`, { method: 'PATCH' });
  }
  
  async reject(requestId) {
    return await apiRequest(`/owner/requests/${requestId}/reject`, { method: 'PATCH' });
  }
}

export const requestsService = new RequestsService();
export default requestsService;
