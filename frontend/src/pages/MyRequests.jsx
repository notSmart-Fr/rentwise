import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { requestsApi } from '../services/api';
import RequestRow from '../components/RequestRow';
import PaymentReceipt from '../components/PaymentReceipt';
import './MyRequests.css';

const MyRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await requestsApi.getTenantRequests();
        setRequests(data);
      } catch (err) {
        console.error('Failed to fetch tenant requests:', err);
        setError('Failed to load your requests. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleViewReceipt = (request) => {
    setSelectedRequest(request);
    setIsReceiptModalOpen(true);
  };

  if (loading) {
    return (
      <div className="container p-top-5 flex-center">
        <div className="spinner"></div>
        <p className="m-left-2">Loading your requests...</p>
      </div>
    );
  }

  return (
    <div className="requests-page container animate-fade-in">
      <header className="page-header">
        <h1 className="page-title">My Rental Requests</h1>
        <p className="page-subtitle">Track the status of your rental applications.</p>
      </header>

      {error && <div className="error-message m-bottom-4">{error}</div>}

      <PaymentReceipt 
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        request={selectedRequest}
      />

      <div className="requests-list">
        {requests.length > 0 ? (
          requests.map(req => (
            <RequestRow 
              key={req.id} 
              request={req} 
              isOwner={false} 
              onViewReceipt={handleViewReceipt}
            />
          ))
        ) : (
          <div className="empty-state">
            <p>You haven't submitted any rental requests yet.</p>
            <button className="btn btn-primary m-top-2" onClick={() => window.location.href = '/'}>
              Browse Properties
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
