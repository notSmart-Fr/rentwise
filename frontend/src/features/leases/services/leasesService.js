import { apiRequest } from '../../../shared/services/api';

class LeasesService {
  async onboardTenant(data) {
    return await apiRequest('/leases/onboard', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOwnerLeases() {
    return await apiRequest('/leases/owner/list', { method: 'GET' });
  }

  async getMyLeases() {
    return await apiRequest('/leases/my', { method: 'GET' });
  }

  async getLeaseDetails(id) {
    return await apiRequest(`/leases/${id}`, { method: 'GET' });
  }
}

export const leasesService = new LeasesService();
export default leasesService;
