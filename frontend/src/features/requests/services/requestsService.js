import { apiRequest } from '../../../shared/services/api';

export const requestsService = {
  // Tenant actions
  create: (propertyId, message) => 
    apiRequest(`/tenant/properties/${propertyId}/requests`, {
      method: 'POST',
      body: { message },
    }),
  
  getTenantRequests: () => 
    apiRequest('/tenant/requests', { method: 'GET' }),
  
  // Owner actions
  getOwnerRequests: () => 
    apiRequest('/owner/requests', { method: 'GET' }),
  
  approve: (requestId) => 
    apiRequest(`/owner/requests/${requestId}/approve`, { method: 'PATCH' }),
  
  reject: (requestId) => 
    apiRequest(`/owner/requests/${requestId}/reject`, { method: 'PATCH' }),
};

export default requestsService;
