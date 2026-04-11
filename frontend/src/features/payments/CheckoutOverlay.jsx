import React, { useState } from 'react';
import { paymentsApi } from '../../shared/services/api';
import './CheckoutOverlay.css';

const CheckoutOverlay = ({ request, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSimulatePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      // Create a simulated successful payment for this request
      await paymentsApi.create({
        request_id: request.id,
        amount: request.property_rent,
        method: 'CREDIT_CARD',
        status: 'PAID',
        reference: `SIM-${Math.random().toString(36).substring(7).toUpperCase()}`
      });
      
      onSuccess();
    } catch (err) {
      console.error('Payment simulation failed:', err);
      setError('Simulated payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-overlay">
      <div className="checkout-modal glass-panel animate-zoom-in">
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="checkout-header">
          <h2>Secure Checkout</h2>
          <p className="text-muted">Finalizing lease for {request.property_title}</p>
        </div>

        <div className="checkout-summary">
          <div className="summary-row">
            <span>First Month Rent</span>
            <span className="amount">৳ {request.property_rent?.toLocaleString() || '0'}</span>
          </div>
          <div className="summary-row">
            <span>Security Deposit</span>
            <span className="amount">৳ 0</span>
          </div>
          <div className="summary-row total">
            <span>Total Payable</span>
            <span className="amount">৳ {request.property_rent?.toLocaleString() || '0'}</span>
          </div>
        </div>

        {error && <div className="error-message m-bottom-3">{error}</div>}

        <div className="payment-methods">
          <label className="text-sm font-bold">Secure Payment Simulation</label>
          <div className="method-card active">
            <div className="method-icon">💳</div>
            <div className="method-info">
              <span>Credit / Debit Card</span>
              <span className="text-xs text-muted">Secured by RentWise Pay</span>
            </div>
          </div>
        </div>

        <button 
          className="btn btn-primary w-full btn-lg m-top-4"
          onClick={handleSimulatePayment}
          disabled={loading}
        >
          {loading ? 'Processing...' : `Pay ৳ ${request.property_rent?.toLocaleString() || '0'}`}
        </button>
        
        <p className="text-center text-xs text-muted m-top-3">
          This is a sandbox environment. No actual money will be charged.
        </p>
      </div>
    </div>
  );
};

export default CheckoutOverlay;
