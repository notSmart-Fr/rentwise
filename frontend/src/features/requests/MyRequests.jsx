import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { requestsApi } from '../../shared/services/api';
import RequestRow from './RequestRow';
import PaymentReceipt from '../payments/PaymentReceipt';
import CheckoutOverlay from '../payments/CheckoutOverlay';
import './MyRequests.css';

const MyRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // active, pending, all
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchRequests = async () => {
    try {
      const data = await requestsApi.getTenantRequests();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
      setError('Failed to load your lease requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handlePay = (request) => {
    setSelectedRequest(request);
    setShowCheckout(true);
  };

  const handlePaymentSuccess = () => {
    setShowCheckout(false);
    fetchRequests();
  };

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'active') return req.status === 'APPROVED';
    if (activeTab === 'pending') return req.status === 'PENDING';
    return true;
  });

  if (loading) {
    return (
      <div className="container p-top-5 flex-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="my-requests-page container animate-fade-in">
      <header className="dashboard-header m-bottom-5">
        <div className="header-content">
          <h1 className="dashboard-title">My Lease Requests</h1>
          <p className="dashboard-subtitle">Manage your current rentals and track new applications</p>
        </div>
        
        <div className="dashboard-tabs glass-panel p-05 m-top-3">
          <button 
            className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active
          </button>
          <button 
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All History
          </button>
        </div>
      </header>

      {error && <div className="alert alert-danger m-bottom-4">{error}</div>}

      <div className="requests-grid">
        {filteredRequests.length > 0 ? (
          filteredRequests.map(req => (
            <div key={req.id} className="request-card-wrapper m-bottom-4">
              <RequestRow
                request={req}
                isOwner={false}
                onPay={() => handlePay(req)}
                onCreateTicket={() => {}} // Integration point for tickets
              />
              
              {req.is_paid && (
                <div className="receipt-container animate-fade-in-up">
                  <div className="receipt-divider">
                    <span>Payment Receipt</span>
                  </div>
                  <PaymentReceipt request={req} />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-state glass-panel p-5 text-center">
            <div className="empty-icon">🏠</div>
            <h3>No {activeTab} requests found</h3>
            <p className="m-bottom-4">
              {activeTab === 'active' 
                ? "You don't have any active leases yet." 
                : "You haven't applied for any properties recently."}
            </p>
            <a href="/" className="btn btn-primary">Browse Properties</a>
          </div>
        )}
      </div>

      {showCheckout && (
        <CheckoutOverlay
          request={selectedRequest}
          onClose={() => setShowCheckout(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default MyRequests;
