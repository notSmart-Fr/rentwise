import { useState, useEffect, useCallback } from 'react';
import { leasesApi } from '../../../shared/services/api';

export const useLeases = (isOwner = false) => {
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeases = useCallback(async () => {
    setLoading(true);
    try {
      const data = isOwner 
        ? await leasesApi.getOwnerList()
        : await leasesApi.getMy();
      setLeases(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching leases:', err);
      setError(err.message || 'Failed to fetch leases');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeases();
  }, [fetchLeases]);

  return {
    leases,
    loading,
    error,
    refresh: fetchLeases
  };
};
