import React, { useState, useEffect } from 'react';
import { paymentsApi } from '../services/api';
import './PaymentModal.css'; // Reusing modal styles

const PaymentReceipt = ({ isOpen, onClose, request }) => {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && request) {
      const fetchPayment = async () => {
        try {
          const data = await paymentsApi.getByRequest(request.id);
          setPayment(data);
        } catch (err) {
          console.error('Failed to fetch payment receipt:', err);
          setError('The owner has not recorded a payment for this lease yet.');
        } finally {
          setLoading(false);
        }
      };

      fetchPayment();
    }
  }, [isOpen, request]);

  if (!isOpen) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return <span className="badge badge-success">PAID</span>;
      case 'pending': return <span className="badge badge-warning">PENDING</span>;
      case 'failed': return <span className="badge badge-danger">FAILED</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content payment-modal animate-slide-up">
        <div className="modal-header">
          <div className="header-text">
            <h2>Payment Receipt</h2>
            <p className="text-muted text-sm">{request.property_title}</p>
          </div>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="receipt-body m-top-4">
          {loading ? (
             <div className="flex-center p-4">
               <div className="spinner"></div>
             </div>
          ) : error || !payment ? (
            <div className="text-center p-4">
               <div className="text-muted m-bottom-2">📄</div>
               <p>{error || "No payment record found."}</p>
            </div>
          ) : (
            <div className="receipt-details">
              <div className="receipt-row">
                <span className="label">Amount Paid</span>
                <span className="value primary">৳ {payment.amount.toLocaleString()}</span>
              </div>
              <div className="receipt-row">
                <span className="label">Status</span>
                <span className="value">{getStatusBadge(payment.status)}</span>
              </div>
              <div className="receipt-row">
                <span className="label">Payment Method</span>
                <span className="value">{payment.method}</span>
              </div>
              <div className="receipt-row">
                <span className="label">Reference / TrxID</span>
                <span className="value">{payment.reference || 'N/A'}</span>
              </div>
              
              <div className="receipt-footer m-top-5 text-center text-muted text-xs">
                <p>This is a digital ledger entry recorded by the property owner.</p>
                <p>For disputes, please contact the owner directly.</p>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer m-top-4">
          <button className="btn btn-secondary w-full" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceipt;
