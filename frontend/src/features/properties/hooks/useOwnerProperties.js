import { useState, useEffect, useCallback } from 'react';
import propertiesService from '../services/propertiesService';

export const useOwnerProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOwnerProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await propertiesService.getOwnerProperties();
      setProperties(data);
    } catch (err) {
      console.error('Failed to fetch owner properties:', err);
      setError(err.message || 'Failed to load your properties');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOwnerProperties();
  }, [fetchOwnerProperties]);

  const toggleAvailability = async (id, currentStatus) => {
    try {
      await propertiesService.setAvailability(id, !currentStatus);
      setProperties(prev => prev.map(p => 
        p.id === id ? { ...p, is_available: !currentStatus } : p
      ));
      return { success: true };
    } catch (err) {
      console.error('Failed to update availability:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    properties,
    loading,
    error,
    refresh: fetchOwnerProperties,
    toggleAvailability
  };
};

export default useOwnerProperties;
