import BaseApiService from '../../../shared/services/BaseApiService';
import { apiRequest } from '../../../shared/services/api';

class PropertiesService extends BaseApiService {
  constructor() {
    super('/properties');
    this.ownerPath = '/owner/properties';
  }

  // Public methods use super (which uses /properties)
  // getAll and getById are already handled by BaseApiService

  // Owner specific methods
  async create(data) {
    return await apiRequest(this.ownerPath, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOwnerProperties() {
    return await apiRequest(this.ownerPath, { method: 'GET' });
  }

  async update(id, data) {
    return await apiRequest(`${this.ownerPath}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async setAvailability(id, isAvailable) {
    return await apiRequest(`${this.ownerPath}/${id}/availability`, {
      method: 'PATCH',
      body: JSON.stringify({ is_available: isAvailable }),
    });
  }
}

export const propertiesService = new PropertiesService();
export default propertiesService;
