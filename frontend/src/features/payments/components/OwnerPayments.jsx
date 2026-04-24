import React, { useState } from 'react';
import { useOwnerPayments } from '../hooks/useOwnerPayments';
import StatsCard from '../../../shared/components/StatsCard';
import { paymentsService } from '../services/paymentsService';
import { LeaseLedger } from '../../leases';

const OwnerPayments = ({ leases = [], initialPayments = [] }) => {
  const { payments: fetchedPayments, loading, error, revenueStats, refresh } = useOwnerPayments();
  const [selectedLeaseId, setSelectedLeaseId] = useState(null);

  // Use initialPayments if fetchedPayments is not available yet (initial load)
  const payments = fetchedPayments.length > 0 ? fetchedPayments : initialPayments;

  const handleExport = async () => {
    try {
      await paymentsService.exportPaymentsCsv();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const selectedLease = leases.find(l => l.id === selectedLeaseId);

  if (loading && payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-glow shadow-primary/20"></div>
        <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">Syncing Revenue Records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tightest">Financial Hub</h2>
          <p className="text-slate-500 font-medium mt-1">Master ledger and revenue tracking for your asset portfolio.</p>
        </div>
        <div className="flex gap-3">
          {selectedLeaseId && (
            <button
              onClick={() => setSelectedLeaseId(null)}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white border border-white/5 transition-all"
            >
              Back to Overview
            </button>
          )}
          <button
            onClick={handleExport}
            className="px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Export CSV
          </button>
        </div>
      </div>

      {!selectedLeaseId ? (
        <>
          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatsCard
              title="Total Collected"
              value={`৳ ${revenueStats.total.toLocaleString()}`}
              icon="💰"
              color="purple"
            />
            <StatsCard
              title="Pending Revenue"
              value={`৳ ${revenueStats.pending.toLocaleString()}`}
              icon="⏳"
              color="orange"
            />
            <StatsCard
              title="Transactions"
              value={revenueStats.count}
              icon="📊"
              color="blue"
            />
          </div>

          {/* Lease Selector (New for RentWise Ledger) */}
          {leases.length > 0 && (
            <section className="space-y-6">
              <h3 className="text-xl font-black text-white uppercase tracking-tightest">Active Contracts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {leases.filter(l => l.status === 'ACTIVE').map(lease => (
                  <button
                    key={lease.id}
                    onClick={() => setSelectedLeaseId(lease.id)}
                    className="glass-panel p-6 text-left border border-white/5 hover:border-primary-rentwise/30 transition-all group overflow-hidden relative"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                      <span className="material-symbols-outlined text-4xl">receipt_long</span>
                    </div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{lease.tenant_name || 'Resident'}</p>
                    <h4 className="text-lg font-bold text-white group-hover:text-primary-rentwise transition-colors truncate">{lease.property_title || 'Lease Record'}</h4>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-black text-primary-rentwise italic">৳ {lease.monthly_rent?.toLocaleString()} / mo</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">View Ledger →</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Transaction Table */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-white uppercase tracking-tightest">Master Transaction Log</h3>
            <div className="overflow-hidden rounded-3xl border border-white/5 bg-surface-rentwise shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/2">
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Resident</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Asset</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Value</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Timestamp</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {payments.length > 0 ? (
                      payments.map((p, idx) => (
                        <tr key={p.id} className={`hover:bg-white/2 transition-colors group ${idx % 2 === 1 ? 'bg-white/1' : ''}`}>
                          <td className="px-8 py-6">
                            <span className="font-bold text-white group-hover:text-primary transition-colors">{p.tenant_name || 'Resident'}</span>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-sm text-slate-400 font-medium">{p.property_title || 'N/A'}</span>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-white font-black tracking-tighter italic">৳ {p.amount?.toLocaleString()}</span>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${p.status === 'PAID' || p.status === 'SUCCESS' || p.status === 'COMPLETED'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                              }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right text-xs text-slate-500 font-medium uppercase tracking-widest">
                            {new Date(p.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-8 py-6 text-right">
                            {(p.status === 'PAID' || p.status === 'SUCCESS' || p.status === 'COMPLETED') && (
                              <button
                                onClick={() => paymentsService.downloadReceipt(p.id, true)}
                                className="p-3 bg-white/5 hover:bg-primary/20 rounded-xl text-white transition-all shadow-inner"
                                title="Download Verification"
                              >
                                <span className="material-symbols-outlined text-sm">download</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-8 py-32 text-center">
                          <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs italic">No financial movements manifest in your records.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <LeaseLedger lease={selectedLease} />
      )}
    </div>
  );
};

export default OwnerPayments;
