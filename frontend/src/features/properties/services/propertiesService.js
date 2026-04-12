import { apiRequest } from '../../../shared/services/api';

const propertiesService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const endpoint = query ? `/properties?${query}` : '/properties';
    return apiRequest(endpoint, { method: 'GET' });
  },
  
  getById: (id) => apiRequest(`/properties/${id}`, { method: 'GET' }),
  
  // Owner only endpoints
  create: (data) => apiRequest('/owner/properties', {
    method: 'POST',
    body: data,
  }),
  
  getOwnerProperties: () => apiRequest('/owner/properties', { method: 'GET' }),
  
  update: (id, data) => apiRequest(`/owner/properties/${id}`, {
    method: 'PATCH',
    body: data,
  }),
  
  setAvailability: (id, isAvailable) => apiRequest(`/owner/properties/${id}/availability`, {
    method: 'PATCH',
    body: { is_available: isAvailable },
  }),
};

export default propertiesService;
