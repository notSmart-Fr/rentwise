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

  async updateProfile(data) {
    return await apiRequest(`${this.resourcePath}/me`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('file', file);
    return await apiRequest(`${this.resourcePath}/avatar`, {
      method: 'POST',
      body: formData,
      // Note: apiRequest should handle removing Content-Type for FormData
    });
  }

  async requestVerification(docType, file) {
    const formData = new FormData();
    formData.append('doc_type', docType);
    formData.append('file', file);
    return await apiRequest(`${this.resourcePath}/verify`, {
      method: 'POST',
      body: formData,
    });
  }

  async getVerificationStatus() {
    return await apiRequest(`${this.resourcePath}/verify/status`, { method: 'GET' });
  }
}



export const authService = new AuthService();
export default authService;
