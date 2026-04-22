import React from 'react';
import { useTenantPayments } from '../hooks/useTenantPayments';
import PaymentReceipt from './PaymentReceipt';

const TenantPayments = () => {
  const { payments, loading, error, refresh } = useTenantPayments();

  if (loading && payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin shadow-glow"></div>
        <p className="text-text-secondary text-sm font-medium">Loading your rent history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white">Payment History</h2>
          <p className="text-text-secondary mt-1">Review all your past and pending rent payments.</p>
        </div>
        <button 
          onClick={refresh}
          className="btn btn-secondary px-6 text-xs font-bold uppercase tracking-widest border-white/5 bg-white/5"
        >
          Refresh Ledger
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {payments.length > 0 ? (
          payments.map((p) => (
            <div key={p.id} className="group">
              <div className="glass-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/1 border-white/5 group-hover:border-accent/30 transition-all duration-500">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 rounded-2xl bg-white/5 flex flex-col items-center justify-center border border-white/5">
                      <span className="text-[10px] font-black uppercase text-text-muted">
                        {new Date(p.created_at).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-xl font-black text-white leading-none">
                        {new Date(p.created_at).getDate()}
                      </span>
                   </div>
                   <div>
                      <h4 className="font-bold text-white text-lg">{p.property_title || 'Rent Payment'}</h4>
                      <p className="text-sm text-text-secondary">{p.payment_method || 'Digital Transaction'}</p>
                   </div>
                </div>

                <div className="flex flex-col md:items-end gap-1">
                   <span className="text-2xl font-black text-accent tracking-tighter">
                     ৳ {p.amount?.toLocaleString()}
                   </span>
                   <div className="flex items-center gap-2">
                     <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                       p.status === 'PAID' || p.status === 'SUCCESS'
                       ? 'bg-success/10 text-success border border-success/20' 
                       : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                     }`}>
                       {p.status}
                     </span>
                     {(p.status === 'PAID' || p.status === 'SUCCESS') && (
                        <button
                          onClick={() => paymentsService.downloadReceipt(p.id, false)}
                          className="p-1.5 bg-white/5 hover:bg-accent/20 rounded-lg text-white transition-all"
                          title="Download PDF Receipt"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                        </button>
                      )}
                   </div>
                </div>

              </div>

              {/* Instant Receipt Preview */}
              {p.status === 'PAID' && (
                <div className="mx-6 p-6 pb-12 bg-white/2 border border-white/5 border-t-0 rounded-b-[40px] -mt-2 animate-in fade-in slide-in-from-top-4 duration-700 hidden group-hover:block transition-all">
                  <div className="flex items-center my-6">
                    <div className="flex-1 h-px bg-white/5"></div>
                    <span className="px-5 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted/50">Digital Signature & Receipt</span>
                    <div className="flex-1 h-px bg-white/5"></div>
                  </div>
                  <PaymentReceipt request={{
                    id: p.request_id,
                    property_title: p.property_title,
                    tenant_name: p.tenant_name,
                    property_rent: p.amount,
                    created_at: p.created_at,
                    is_paid: true
                  }} />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="glass-panel py-24 flex flex-col items-center justify-center text-center opacity-50 border-dashed">
            <div className="text-6xl mb-6 grayscale">🧾</div>
            <h3 className="text-xl font-bold text-white mb-2">Empty Records</h3>
            <p className="text-text-secondary text-sm">Once you start paying rent, your digital receipts will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantPayments;
