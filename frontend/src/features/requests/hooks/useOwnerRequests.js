import { useState, useEffect, useCallback } from 'react';
import { requestsService } from '../services/requestsService';

export const useOwnerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await requestsService.getOwnerRequests();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch owner requests:', err);
      setError(err.message || 'Failed to load rental requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const approveRequest = async (id) => {
    try {
      await requestsService.approve(id);
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const rejectRequest = async (id) => {
    try {
      await requestsService.reject(id);
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    requests,
    loading,
    error,
    refresh: fetchRequests,
    approveRequest,
    rejectRequest
  };
};

export default useOwnerRequests;
