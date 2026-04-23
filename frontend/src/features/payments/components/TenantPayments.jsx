import React, { useState } from 'react';
import { useTenantPayments } from '../hooks/useTenantPayments';
import PaymentReceipt from './PaymentReceipt';
import { LeaseLedger } from '../../leases';
import { paymentsService } from '../services/paymentsService';

const TenantPayments = ({ leases = [] }) => {
  const { payments, loading, error, refresh } = useTenantPayments();
  const [selectedLeaseId, setSelectedLeaseId] = useState(leases.length > 0 ? leases[0].id : null);

  const selectedLease = leases.find(l => l.id === selectedLeaseId);

  if (loading && payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin shadow-glow shadow-accent/20"></div>
        <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">Architecting your Ledger...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tightest">Financial Ledger</h2>
          <p className="text-slate-500 font-medium mt-1">Full transparency on your residency transactions and commitments.</p>
        </div>
        <div className="flex gap-3">
          {leases.length > 1 && (
            <select
              value={selectedLeaseId || ''}
              onChange={(e) => setSelectedLeaseId(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:outline-hidden focus:ring-2 focus:ring-primary/20"
            >
              {leases.map(l => (
                <option key={l.id} value={l.id}>{l.property_title}</option>
              ))}
            </select>
          )}
          <button
            onClick={refresh}
            className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white border border-white/5 transition-all"
          >
            Sync Records
          </button>
        </div>
      </div>

      {selectedLease ? (
        <LeaseLedger lease={selectedLease} />
      ) : (
        <div className="space-y-10">
          {/* Fallback to simple list if no lease (e.g. pending ones) */}
          <div className="flex flex-col gap-8">
            {payments.length > 0 ? (
              payments.map((p) => (
                <div key={p.id} className="group">
                  <div className="glass-panel p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-white/5 group-hover:border-accent/30 transition-all duration-700 relative overflow-hidden">
                    <div className="flex items-center gap-8">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex flex-col items-center justify-center border border-white/5 shadow-inner">
                        <span className="text-[10px] font-black uppercase text-slate-500">
                          {new Date(p.created_at).toLocaleString('default', { month: 'short' })}
                        </span>
                        <span className="text-2xl font-black text-white leading-none">
                          {new Date(p.created_at).getDate()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xl tracking-tight">{p.property_title || 'Rent Payment'}</h4>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">{p.payment_method || 'Digital Transaction'}</p>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-2">
                      <span className="text-3xl font-black text-primary-sovereign tracking-tightest italic">
                        ৳ {p.amount?.toLocaleString()}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border ${p.status === 'PAID' || p.status === 'SUCCESS' || p.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                          {p.status}
                        </span>
                        {(p.status === 'PAID' || p.status === 'SUCCESS' || p.status === 'COMPLETED') && (
                          <button
                            onClick={() => paymentsService.downloadReceipt(p.id, false)}
                            className="p-3 bg-white/5 hover:bg-accent/20 rounded-xl text-white transition-all shadow-inner"
                            title="Download PDF Receipt"
                          >
                            <span className="material-symbols-outlined text-sm">download</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-32 text-center bg-surface-sovereign rounded-[2.5rem] border border-dashed border-white/10">
                <div className="text-8xl mb-8 grayscale opacity-20">🧾</div>
                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-widest">No Manifests</h3>
                <p className="text-slate-500 font-medium max-w-xs mx-auto">Once your residency manifest begins, your digital receipts will be verified and stored here.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantPayments;
