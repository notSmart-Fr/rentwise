import { useState, useEffect, useCallback, useMemo } from 'react';
import paymentsService from '../services/paymentsService';

export const useOwnerPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentsService.listOwnerPayments();
      setPayments(data || []);
    } catch (err) {
      console.error('Failed to fetch owner payments:', err);
      setError(err.message || 'Failed to load payment history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const recordPayment = async (data) => {
    try {
      const newPayment = await paymentsService.create(data);
      setPayments(prev => [newPayment, ...prev]);
      return { success: true, data: newPayment };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const revenueStats = useMemo(() => {
    return {
      total: payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + (p.amount || 0), 0),
      pending: payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + (p.amount || 0), 0),
      count: payments.length
    };
  }, [payments]);

  return {
    payments,
    loading,
    error,
    refresh: fetchPayments,
    recordPayment,
    revenueStats
  };
};

export default useOwnerPayments;
