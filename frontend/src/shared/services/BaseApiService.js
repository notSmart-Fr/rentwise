import { apiRequest } from './api';

/**
 * Base class for all API feature services.
 * Standardizes CRUD operations and endpoint management.
 */
class BaseApiService {
  constructor(resourcePath) {
    this.resourcePath = resourcePath;
  }

  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${this.resourcePath}?${query}` : this.resourcePath;
    return await apiRequest(url, { method: 'GET' });
  }

  async getById(id) {
    return await apiRequest(`${this.resourcePath}/${id}`, { method: 'GET' });
  }

  async create(data) {
    return await apiRequest(this.resourcePath, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update(id, data) {
    return await apiRequest(`${this.resourcePath}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(id) {
    return await apiRequest(`${this.resourcePath}/${id}`, {
      method: 'DELETE',
    });
  }
}

export default BaseApiService;
