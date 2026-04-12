import { useState, useCallback } from 'react';
import { paymentsService } from '../services/paymentsService';

export const usePayments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPaymentByRequest = useCallback(async (requestId, isOwner = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = isOwner 
        ? await paymentsService.getByRequest(requestId)
        : await paymentsService.getTenantByRequest(requestId);
      return data;
    } catch (err) {
      console.error('Failed to fetch payment:', err);
      setError('No payment record found.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const simulateTenantPayment = async (requestId, amount, method = 'CREDIT_CARD') => {
    setLoading(true);
    setError(null);
    try {
      // Step-based simulation could be managed in the calling component, 
      // but the core logic is here.
      const reference = `SIM-${Math.random().toString(36).substring(7).toUpperCase()}`;
      
      const res = await paymentsService.create({
        request_id: requestId,
        amount,
        method,
        status: 'PAID',
        reference
      });
      
      return { success: true, data: res };
    } catch (err) {
      console.error('Payment simulation failed:', err);
      const msg = err.response?.data?.detail || 'Simulated payment failed.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const manageOwnerPayment = async (requestId, formData, paymentId = null) => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (paymentId) {
        res = await paymentsService.update(paymentId, formData);
      } else {
        res = await paymentsService.create({
          ...formData,
          request_id: requestId
        });
      }
      return { success: true, data: res };
    } catch (err) {
      console.error('Failed to save payment record:', err);
      const msg = err.response?.data?.detail || 'Failed to save payment record.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchPaymentByRequest,
    simulateTenantPayment,
    manageOwnerPayment
  };
};

export default usePayments;
