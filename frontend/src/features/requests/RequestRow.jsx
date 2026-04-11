import React from 'react';
import { Link } from 'react-router-dom';
import { useChat } from '../messaging/ChatContext';
import './RequestRow.css';

const RequestRow = ({ request, isOwner, onApprove, onReject, onManagePayment, onPay, onCreateTicket }) => {
  const { openChat } = useChat();

  const getStatusBadge = (status) => {
    switch(status) {
      case 'APPROVED': return <span className="badge badge-success">Active Lease</span>;
      case 'PENDING': return <span className="badge badge-warning">Pending Review</span>;
      case 'REJECTED': return <span className="badge badge-danger">Rejected</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  const handleOpenChat = (e) => {
    e.preventDefault();
    openChat(
      'RENTAL_REQUEST',
      request.id,
      `Lease: ${request.property_title || 'Property'}`,
      isOwner ? request.tenant_name : (request.owner_name || 'Owner'),
      isOwner ? request.tenant_id : request.owner_id
    );
  };

  return (
    <div className="request-card glass-panel animate-fade-in hover-card-lift">
      <div className="request-card-inner">
        <div className="request-visual-section">
          <div className="request-icon">
            {request.status === 'APPROVED' ? '🏠' : '📄'}
          </div>
          <div className="request-main-meta">
            <h3 className="request-title text-truncate">
              <Link to={`/properties/${request.property_id}`}>{request.property_title || 'Unknown Property'}</Link>
            </h3>
            <p className="request-location">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {request.property_area || 'N/A'}, {request.property_city || ''}
            </p>
          </div>
        </div>

        <div className="request-data-grid">
          <div className="data-item">
            <label>{isOwner ? 'Tenant' : 'Status'}</label>
            <div className="data-value">
              {isOwner ? request.tenant_name : getStatusBadge(request.status)}
            </div>
          </div>
          <div className="data-item">
            <label>Monthly Rent</label>
            <div className="data-value font-bold text-accent">
              ৳ {request.property_rent?.toLocaleString() || '0'}
            </div>
          </div>
          <div className="data-item">
            <label>Payment Status</label>
            <div className={`data-value status-indicator ${request.is_paid ? 'paid' : 'unpaid'}`}>
              <span className="dot"></span>
              {request.is_paid ? 'Paid' : 'Unpaid'}
            </div>
          </div>
        </div>

        <div className="request-actions-bar">
          <div className="request-metadata">
            <span className="date-badge">
              Applied: {new Date(request.created_at).toLocaleDateString()}
            </span>
            {isOwner && getStatusBadge(request.status)}
          </div>

          <div className="action-buttons">
            <button className="btn-chat-bubble" onClick={handleOpenChat} title="Open Chat">
              💬
            </button>

            {isOwner ? (
              <div className="owner-action-group">
                {request.status === 'PENDING' && (
                  <>
                    <button className="btn btn-sm btn-success" onClick={() => onApprove(request.id)}>Approve</button>
                    <button className="btn btn-sm btn-danger" onClick={() => onReject(request.id)}>Reject</button>
                  </>
                )}
                {request.status === 'APPROVED' && (
                  <button className="btn btn-sm btn-primary" onClick={() => onManagePayment(request)}>
                    Finance Hub
                  </button>
                )}
              </div>
            ) : (
              <div className="tenant-action-group">
                {request.status === 'APPROVED' && !request.is_paid && (
                  <button className="btn btn-sm btn-primary" onClick={onPay}>⚡ Pay Rent</button>
                )}
                {request.status === 'APPROVED' && request.is_paid && (
                  <button className="btn btn-sm btn-secondary" onClick={onCreateTicket}>Report Issue</button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestRow;
