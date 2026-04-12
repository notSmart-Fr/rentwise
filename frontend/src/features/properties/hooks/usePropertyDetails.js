import { useState, useEffect } from 'react';
import propertiesService from '../services/propertiesService';
import { requestsService } from '../../requests/services/requestsService';

export const usePropertyDetails = (id) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [requestStatus, setRequestStatus] = useState('idle'); // idle, loading, success

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await propertiesService.getById(id);
        setProperty(data);
      } catch (err) {
        console.error('Failed to fetch property:', err);
        setError(err.message || 'Failed to load property details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const requestLease = async () => {
    setRequestStatus('loading');
    try {
      await requestsService.create(id, "I'm interested in this property.");
      setRequestStatus('success');
      return { success: true };
    } catch (err) {
      console.error('Lease request failed:', err);
      setRequestStatus('idle');
      return { success: false, error: err.message };
    }
  };

  return {
    property,
    loading,
    error,
    activeImage,
    setActiveImage,
    requestStatus,
    requestLease
  };
};

export default usePropertyDetails;
