import React from 'react';
import { Link } from 'react-router-dom';
import { useChat } from '../../messaging';

const RequestRow = ({ request, isOwner, onApprove, onReject, onManagePayment, onPay, onCreateTicket }) => {
  const { openChat } = useChat();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <span className="badge-success badge">Active Lease</span>;
      case 'PENDING':
        return <span className="badge-warning badge">Pending Review</span>;
      case 'REJECTED':
        return <span className="badge-danger badge">Rejected</span>;
      default:
        return <span className="badge">{status}</span>;
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
    <div className="glass-panel group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-glow hover:border-primary">
      <div className="p-6 flex flex-col gap-6">
        {/* Visual Section */}
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-bg-surface-elevated border border-white/5 rounded-lg flex items-center justify-center text-2xl shadow-sm">
            {request.status === 'APPROVED' ? '🏠' : '📄'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold mb-1 truncate">
              <Link to={`/properties/${request.property_id}`} className="text-text-primary hover:text-primary-hover transition-colors">
                {request.property_title || 'Unknown Property'}
              </Link>
            </h3>
            <p className="flex items-center gap-1.5 text-text-secondary text-sm">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {request.property_area || 'N/A'}, {request.property_city || ''}
            </p>
          </div>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-5 bg-white/2 rounded-lg border border-white/5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">{isOwner ? 'Tenant' : 'Status'}</label>
            <div className="text-base font-semibold text-text-primary">
              {isOwner ? request.tenant_name : getStatusBadge(request.status)}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Monthly Rent</label>
            <div className="text-base font-bold text-accent">
              ৳ {request.property_rent?.toLocaleString() || '0'}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Payment Status</label>
            <div className="flex items-center gap-2 text-base font-semibold text-text-primary">
              <span className={`w-2 h-2 rounded-full ${request.is_paid ? 'bg-success shadow-[0_0_8px_var(--color-success)]' : 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'}`}></span>
              {request.is_paid ? 'Paid' : 'Unpaid'}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-text-muted bg-white/5 px-2.5 py-1 rounded-full">
              Applied: {new Date(request.created_at).toLocaleDateString()}
            </span>
            {isOwner && getStatusBadge(request.status)}
          </div>

          <div className="flex items-center gap-3">
            <button
              className="w-10 h-10 rounded-lg bg-bg-surface-elevated border border-white/5 flex items-center justify-center text-lg transition-all duration-300 hover:scale-110 hover:bg-primary/15 hover:border-primary"
              onClick={handleOpenChat}
              title="Open Chat"
            >
              💬
            </button>

            {isOwner ? (
              <div className="flex gap-2">
                {request.status === 'PENDING' && (
                  <>
                    <button className="btn btn-sm bg-success/20 text-success border border-success/30 hover:bg-success hover:text-white" onClick={() => onApprove(request.id)}>Approve</button>
                    <button className="btn btn-sm bg-danger/20 text-danger border border-danger/30 hover:bg-danger hover:text-white" onClick={() => onReject(request.id)}>Reject</button>
                  </>
                )}
                {request.status === 'APPROVED' && (
                  <button className="btn btn-sm btn-primary" onClick={() => onManagePayment(request)}>
                    Finance Hub
                  </button>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
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

