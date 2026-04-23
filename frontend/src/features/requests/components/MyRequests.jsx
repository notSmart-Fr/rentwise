import React, { useState } from 'react';
import { useTenantRequests } from '../hooks/useTenantRequests';
import RequestRow from './RequestRow';
import { PaymentReceipt, CheckoutOverlay } from '../../payments';

const MyRequests = ({ hideHeader = false }) => {
  const {
    requests,
    loading,
    error,
    activeTab,
    setActiveTab,
    refresh
  } = useTenantRequests();

  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handlePay = (request) => {
    setSelectedRequest(request);
    setShowCheckout(true);
  };

  const handlePaymentSuccess = () => {
    setShowCheckout(false);
    refresh();
  };

  if (loading && requests.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-10">
      {!hideHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-white">Lease Management</h2>
            <p className="text-sm text-text-secondary">Track your active applications and residential agreements.</p>
          </div>

          <div className="flex gap-2 p-1.5 bg-white/5 border border-white/5 rounded-xl w-fit">
            {['active', 'pending', 'all'].map((tab) => (
              <button
                key={tab}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 capitalize whitespace-nowrap ${activeTab === tab
                  ? 'bg-accent text-white shadow-lg shadow-accent/20'
                  : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'all' ? 'All History' : tab}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-6">
        {requests.length > 0 ? (
          requests.map(req => (
            <div key={req.id} className="flex flex-col">
              <RequestRow
                request={req}
                isOwner={false}
                onPay={() => handlePay(req)}
                onCreateTicket={() => { }} // Logic stays here for now, unified in dashboard later
              />

              {req.is_paid && (
                <div className="px-6 pb-6 bg-white/1 border border-white/5 border-t-0 rounded-b-4xl -mt-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center my-6">
                    <div className="flex-1 h-px bg-white/5"></div>
                    <span className="px-5 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Payment Receipt</span>
                    <div className="flex-1 h-px bg-white/5"></div>
                  </div>
                  <PaymentReceipt request={req} />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="glass-panel py-24 flex flex-col items-center justify-center text-center border-dashed">
            <div className="text-5xl mb-6 grayscale opacity-20">🏠</div>
            <h3 className="text-xl font-bold text-white mb-2">No {activeTab} applications</h3>
            <p className="text-text-secondary text-sm max-w-sm">
              {activeTab === 'active'
                ? "You don't have any current active leases."
                : "You haven't submitted any applications recently."}
            </p>
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
