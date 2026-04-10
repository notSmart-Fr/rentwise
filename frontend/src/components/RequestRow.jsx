import React from 'react';
import './RequestRow.css';

const RequestRow = ({ request, onApprove, onReject, onManagePayment, onViewReceipt, onPayRent, isOwner = false }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'APPROVED': return 'status-approved';
      case 'REJECTED': return 'status-rejected';
      case 'PENDING': return 'status-pending';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const hasPayment = request.payment && (request.payment.status === 'PAID' || request.payment.status === 'SUCCESS');

  return (
    <div className="request-row">
      <div className="request-info">
        <div className="request-main">
          <span className="request-property">{request.property_title}</span>
          <span className={`request-status ${getStatusClass(request.status)}`}>
            {request.status}
          </span>
        </div>
        <div className="request-details">
          {isOwner ? (
            <span className="request-user">Tenant: <strong>{request.tenant_name}</strong> ({request.tenant_email})</span>
          ) : (
            <span className="request-user"><strong>৳ {request.property_rent?.toLocaleString()}</strong> / month</span>
          )}
        </div>
        {request.message && (
          <div className="request-message">
            "{request.message}"
          </div>
        )}
      </div>

      <div className="request-actions">
        {isOwner && request.status === 'PENDING' && (
          <>
            <button 
              className="btn btn-sm btn-outline-success" 
              onClick={() => onApprove(request.id)}
            >
              Approve
            </button>
            <button 
              className="btn btn-sm btn-outline-danger" 
              onClick={() => onReject(request.id)}
            >
              Reject
            </button>
          </>
        )}
        
        {isOwner && request.status === 'APPROVED' && onManagePayment && (
          <button 
            className="btn btn-sm btn-primary btn-payment" 
            onClick={() => onManagePayment(request)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" style={{marginRight: '6px'}}>
              <rect x="2" y="5" width="20" height="14" rx="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
            Lease Ledger
          </button>
        )}
      </div>
      
      {!isOwner && (
        <div className="request-actions-tenant">
           {request.status === 'APPROVED' && !hasPayment && onPayRent && (
             <button 
               className="btn btn-sm btn-payment hover-card-lift"
               onClick={() => onPayRent(request)}
             >
               Pay Rent
             </button>
           )}
           
           {hasPayment && onViewReceipt && (
             <button 
               className="btn btn-xs btn-outline-success m-top-1"
               onClick={() => onViewReceipt(request)}
             >
               View Receipt
             </button>
           )}
           
           <div className="request-date-compact m-top-1">
              Applied on: {formatDate(request.created_at)}
           </div>
        </div>
      )}
    </div>
  );
};

export default RequestRow;
