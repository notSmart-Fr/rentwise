const API_BASE_URL = 'VITE_API_URL_PLACEHOLDER';

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

  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    
    if (response.status === 204) return null;

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorObj = {
        status: response.status,
        message: data.detail || 'An unexpected error occurred',
        errorType: data.error_type || 'UnknownError',
        data,
      };

      // Emit global event for interceptors (like AlertProvider)
      window.dispatchEvent(new CustomEvent('API_ERROR', { detail: errorObj }));

      // Handle session expiration
      if (response.status === 401 && !endpoint.includes('/login')) {
        removeAuthToken();
        window.location.href = '/login?expired=true';
      }

      throw errorObj;
    }

    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      const networkError = {
        status: 0,
        message: 'Network error. Please check if the server is running.',
        errorType: 'NetworkError'
      };
      window.dispatchEvent(new CustomEvent('API_ERROR', { detail: networkError }));
      throw networkError;
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
