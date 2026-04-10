import React, { useState, useEffect } from 'react';
import { paymentsApi } from '../services/api';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, request, onPaymentSaved }) => {
  const [formData, setFormData] = useState({
    amount: '',
    method: 'CASH',
    reference: '',
    status: 'completed'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [paymentId, setPaymentId] = useState(null);

  useEffect(() => {
    if (isOpen && request) {
      // Check if there's already a payment for this request
      const fetchPayment = async () => {
        try {
          const payment = await paymentsApi.getByRequest(request.id);
          if (payment) {
            setFormData({
              amount: payment.amount,
              method: payment.method,
              reference: payment.reference || '',
              status: payment.status
            });
            setPaymentId(payment.id);
            setIsEditing(true);
          }
        } catch (err) {
          // If 404, it just means no payment recorded yet, which is fine
          setIsEditing(false);
          setPaymentId(null);
          setFormData({
            amount: request.rent_amount || '',
            method: 'CASH',
            reference: '',
            status: 'completed'
          });
        }
      };

      fetchPayment();
    }
  }, [isOpen, request]);

  if (!isOpen || !request) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      amount: parseInt(formData.amount),
      method: formData.method,
      reference: formData.reference || null,
      status: formData.status
    };

    try {
      let savedPayment;
      if (isEditing && paymentId) {
        savedPayment = await paymentsApi.updatePayment(paymentId, payload);
      } else {
        savedPayment = await paymentsApi.record(request.id, payload);
      }
      onPaymentSaved(savedPayment);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save payment record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content payment-modal animate-slide-up">
        <div className="modal-header">
          <div className="header-text">
            <h2>{isEditing ? 'Payment Ledger Entry' : 'Record New Payment'}</h2>
            <p className="text-muted text-sm">{request.property_title} • {request.tenant_name}</p>
          </div>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message m-bottom-3">{error}</div>}
          
          <div className="form-group">
            <label>Amount Recieved (৳)</label>
            <input 
              type="number" 
              name="amount" 
              className="input-field" 
              value={formData.amount} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Payment Method</label>
              <select 
                name="method" 
                className="input-field" 
                value={formData.method} 
                onChange={handleChange}
                required
              >
                <option value="CASH">Cash</option>
                <option value="BKASH">bKash</option>
                <option value="NAGAD">Nagad</option>
                <option value="BANK">Bank Transfer</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select 
                name="status" 
                className="input-field" 
                value={formData.status} 
                onChange={handleChange}
                required
              >
                <option value="pending">⏳ Pending</option>
                <option value="completed">✅ Completed / Paid</option>
                <option value="failed">❌ Failed</option>
                <option value="refunded">↩️ Refunded</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Reference Note (e.g. TrxID, Receipt #)</label>
            <input 
              type="text" 
              name="reference" 
              className="input-field" 
              value={formData.reference} 
              onChange={handleChange} 
              placeholder="Ex. TXID9928347"
            />
          </div>

          <div className="modal-footer m-top-4">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (isEditing ? 'Update Record' : 'Save Payment Ledger')}
            </button>
          </div>

          {isEditing && (
             <p className="text-xs text-center m-top-3 text-muted">
               Note: To maintain ledger integrity, old records should be marked as "Failed" or "Refunded" instead of being deleted.
             </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
