import { useState, useEffect, useCallback } from 'react';
import paymentsService from '../services/paymentsService';

export const useTenantPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentsService.listTenantPayments();
      setPayments(data || []);
    } catch (err) {
      console.error('Failed to fetch tenant payments:', err);
      setError(err.message || 'Failed to load your rent history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return {
    payments,
    loading,
    error,
    refresh: fetchPayments
  };
};

export default useTenantPayments;
