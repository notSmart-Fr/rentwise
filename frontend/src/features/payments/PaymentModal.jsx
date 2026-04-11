import React, { useState, useEffect } from 'react';
import { paymentsApi } from '../../shared/services/api';
import './PaymentModal.css';

const PaymentModal = ({ request, isOpen, onClose, onSuccess, existingPayment = null }) => {
  const [formData, setFormData] = useState({
    amount: 0,
    method: 'CASH',
    status: 'PAID',
    reference: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = !!existingPayment;

  useEffect(() => {
    if (existingPayment) {
      setFormData({
        amount: existingPayment.amount,
        method: existingPayment.method,
        status: existingPayment.status,
        reference: existingPayment.reference || ''
      });
    } else if (request) {
      setFormData({
        amount: request.property_rent || 0,
        method: 'CASH',
        status: 'PAID',
        reference: ''
      });
    }
  }, [existingPayment, request, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isEditing) {
        await paymentsApi.update(existingPayment.id, formData);
      } else {
        await paymentsApi.create({
          ...formData,
          request_id: request.id
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to save payment:', err);
      setError('Failed to save payment record. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel animate-zoom-in">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Payment Record' : 'Record Payment'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <p className="text-muted m-bottom-4">
          Recording payment for <strong>{request.tenant_name}</strong> - {request.property_title}
        </p>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message m-bottom-3">{error}</div>}

          <div className="form-group">
            <label>Amount Received (৳)</label>
            <input
              type="number"
              name="amount"
              className="input-field"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid-cols-2 gap-md" style={{ display: 'grid' }}>
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
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="BKASH">bKash</option>
                <option value="NAGAD">Nagad</option>
                <option value="CREDIT_CARD">Credit Card</option>
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
                <option value="PAID">Paid (Success)</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
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
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : (isEditing ? 'Update Record' : 'Confirm Payment')}
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
