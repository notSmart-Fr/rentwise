import React, { useState } from 'react';
import { paymentsApi } from '../services/api';
import './CheckoutOverlay.css';

const CheckoutOverlay = ({ isOpen, onClose, requestId, rentAmount, onPaymentSuccess }) => {
  const [step, setStep] = useState('method'); // method, simulation, success
  const [method, setMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  if (!isOpen) return null;

  const handleSelectMethod = (m) => {
    setMethod(m);
    setStep('simulation');
  };

  const handleSimulatePayment = async () => {
    setLoading(true);
    try {
      // 1. Initialize
      const initRes = await paymentsApi.initializeAutomated(requestId, method);
      
      // 2. Simulate Delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 3. Verify
      const verifyRes = await paymentsApi.verifyAutomated(initRes.id);
      
      setPaymentData(verifyRes);
      setStep('success');
      onPaymentSuccess(verifyRes);
    } catch (err) {
      alert('Payment failed: ' + (err.message || 'Unknown error'));
      setStep('method');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = () => {
    window.print();
  };

  const renderMethodSelection = () => (
    <div className="checkout-methods animate-fade-in">
      <h3>Select Payment Method</h3>
      <div className="method-grid">
        <div className="method-card mobile-pay" onClick={() => handleSelectMethod('BKASH')}>
           <div className="method-logo bkash"></div>
           <span>bKash</span>
        </div>
        <div className="method-card mobile-pay" onClick={() => handleSelectMethod('NAGAD')}>
           <div className="method-logo nagad"></div>
           <span>Nagad</span>
        </div>
        <div className="method-card bank-pay" onClick={() => handleSelectMethod('BANK')}>
           <div className="method-icon">🏦</div>
           <span>Bank Transfer</span>
        </div>
      </div>
    </div>
  );

  const renderSimulation = () => (
    <div className="checkout-simulation animate-slide-up">
      {method === 'BANK' ? (
        <div className="bank-details">
          <h3>Bank Transfer</h3>
          <div className="bank-info-box glass-panel m-top-3">
             <p><strong>Account Name:</strong> RentWise Holdings Ltd.</p>
             <p><strong>Account No:</strong> 123.456.78910</p>
             <p><strong>Bank:</strong> City Bank (Gulshan Branch)</p>
          </div>
          <p className="m-top-3 text-sm text-muted">Please transfer <strong>৳ {rentAmount.toLocaleString()}</strong> to the account above.</p>
          <button className="btn btn-primary w-full m-top-4" onClick={handleSimulatePayment} disabled={loading}>
             {loading ? 'Verifying Transfer...' : 'I have transferred the money'}
          </button>
        </div>
      ) : (
        <div className="mobile-simulation">
          <div className={`simulation-header ${method.toLowerCase()}`}>
             <div className="method-logo-white"></div>
          </div>
          <div className="simulation-body">
             <p>Amount: <strong>৳ {rentAmount.toLocaleString()}</strong></p>
             <div className="form-group m-top-4">
                <label>{method} Account Number</label>
                <input type="text" className="input-field" placeholder="01XXXXXXXXX" defaultValue="01712345678" />
             </div>
             <div className="form-group">
                <label>PIN Number</label>
                <input type="password" className="input-field" placeholder="****" defaultValue="1234" />
             </div>
             <button className="btn btn-primary w-full m-top-3" onClick={handleSimulatePayment} disabled={loading}>
                {loading ? 'Processing...' : `Pay with ${method}`}
             </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderSuccess = () => (
    <div className="checkout-success animate-bounce-in">
      <div className="success-banner">
         <div className="success-icon">✨</div>
         <h2>Payment Successful!</h2>
      </div>
      <div className="receipt-preview glass-panel m-top-4">
         <div className="receipt-header">
            <h3>RentWise Receipt</h3>
            <span className="receipt-date">{new Date().toLocaleDateString()}</span>
         </div>
         <hr className="divider" />
         <div className="receipt-body">
            <div className="receipt-row"><span>Amount Paid:</span> <strong>৳ {paymentData?.amount.toLocaleString()}</strong></div>
            <div className="receipt-row"><span>Method:</span> <strong>{paymentData?.method}</strong></div>
            <div className="receipt-row"><span>TRX ID:</span> <span className="text-secondary">{paymentData?.transaction_id}</span></div>
         </div>
      </div>
      <div className="success-footer m-top-4">
         <button className="btn btn-secondary w-full" onClick={handleDownloadReceipt}>Download Receipt (PDF)</button>
         <button className="btn btn-primary w-full m-top-2" onClick={onClose}>Done</button>
      </div>
    </div>
  );

  return (
    <div className="checkout-overlay">
      <div className="checkout-container glass-panel">
        <div className="checkout-header">
           <h2>RentWise Checkout</h2>
           {step !== 'success' && <div className="close-checkout" onClick={onClose}>&times;</div>}
        </div>
        <div className="checkout-content">
          {step === 'method' && renderMethodSelection()}
          {step === 'simulation' && renderSimulation()}
          {step === 'success' && renderSuccess()}
        </div>
      </div>
    </div>
  );
};

export default CheckoutOverlay;
