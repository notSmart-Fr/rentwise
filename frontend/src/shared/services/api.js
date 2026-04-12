const API_BASE_URL = 'http://localhost:8000';

export const getAuthToken = () => localStorage.getItem('token');
export const setAuthToken = (token) => localStorage.setItem('token', token);
export const removeAuthToken = () => localStorage.removeItem('token');

/**
 * Core API request wrapper that handles JSON formatting and Authorization header automatically.
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle FormData (like file uploads) where we don't want Content-Type to be application/json
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const config = {
    ...options,
    headers,
  };

  // Stringify the body if it's a plain object (not FormData)
  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    
    // If response is 204 No Content, don't try to parse JSON
    if (response.status === 204) {
      return null;
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Throw a custom error object containing the API error message
      throw {
        status: response.status,
        message: data.detail || 'An unexpected error occurred',
        data,
      };
    }

    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw {
        status: 0,
        message: 'Network error. Please check if the server is running.',
      };
    }
    throw error;
  }
}

// ----------------------------------------------------------------------------
// Specific API methods (Vertical slices will use these)
// ----------------------------------------------------------------------------


export const propertiesApi = {
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
};


export const paymentsApi = {
  // Common creation
  create: (data) => {
    // Both owner and automated-tenant paths hit the same record logic on the backend (conceptually)
    // But owners record for a specific request.
    const endpoint = data.request_id 
      ? `/owner/requests/${data.request_id}/payments` 
      : '/owner/payments';
    return apiRequest(endpoint, {
      method: 'POST',
      body: data,
    });
  },
  update: (paymentId, data) => apiRequest(`/owner/payments/${paymentId}`, {
    method: 'PATCH',
    body: data,
  }),

  // Retrieval
  getByRequest: (requestId) => apiRequest(`/owner/requests/${requestId}/payments`, { method: 'GET' }),
  getTenantByRequest: (requestId) => apiRequest(`/tenant/requests/${requestId}/payments`, { method: 'GET' }),
  listOwnerPayments: () => apiRequest('/owner/payments', { method: 'GET' }),
  
  // Automated Checkout (Simulation)
  initializeAutomated: (requestId, method) => 
    apiRequest(`/tenant/payments/initialize?request_id=${requestId}&method=${method}`, { method: 'POST' }),
  verifyAutomated: (paymentId) => 
    apiRequest(`/tenant/payments/${paymentId}/verify`, { method: 'POST' }),
};
