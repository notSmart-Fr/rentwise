import BaseApiService from '../../../shared/services/BaseApiService';
import { apiRequest } from '../../../shared/services/api';

class AuthService extends BaseApiService {
  constructor() {
    super('/auth');
  }

  async login(email, password) {
    return await apiRequest(`${this.resourcePath}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username: email, password }).toString(),
    });
  }

  async register(data) {
    return await apiRequest(`${this.resourcePath}/register`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async loginWithGoogle(idToken, role) {
    return await apiRequest(`${this.resourcePath}/google`, {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken, role }),
    });
  }

  async getMe() {
    return await apiRequest(`${this.resourcePath}/me`, { method: 'GET' });
  }
}

export const authService = new AuthService();
export default authService;
