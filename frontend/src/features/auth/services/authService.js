import { apiRequest } from '../../../shared/services/api';

export const authService = {
  login: (email, password) => apiRequest('/auth/login', {
    method: 'POST',
    // FastAPI expects form data for OAuth2PasswordRequestForm
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username: email, password }).toString(),
  }),
  register: (data) => apiRequest('/auth/register', {
    method: 'POST',
    body: data,
  }),
  getMe: () => apiRequest('/auth/me', { method: 'GET' }),
};

export default authService;
