import { useState, useEffect, useCallback, useMemo } from 'react';
import { requestsService } from '../services/requestsService';

export const useTenantRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // active, pending, all

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await requestsService.getTenantRequests();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch tenant requests:', err);
      setError('Failed to load your lease requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      if (activeTab === 'active') return req.status === 'APPROVED';
      if (activeTab === 'pending') return req.status === 'PENDING';
      return true;
    });
  }, [requests, activeTab]);

  return {
    requests: filteredRequests,
    allRequests: requests,
    loading,
    error,
    activeTab,
    setActiveTab,
    refresh: fetchRequests
  };
};

export default useTenantRequests;
