import React from 'react';
import { format } from 'date-fns';

const LeaseLedger = ({ lease }) => {
  if (!lease) return null;

  const payments = lease.payments || [];
  const totalPaid = payments
    .filter(p => p.status === 'SUCCESS' || p.status === 'PAID' || p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Editorial Header */}
      <section className="space-y-2">
        <p className="text-primary-rentwise font-semibold tracking-[0.3em] uppercase text-[10px]">Financial Overview</p>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none uppercase">
          RentWise <br /> <span className="text-primary-rentwise/40 italic">Ledger</span>
        </h2>
      </section>

      {/* Bento Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-8 rounded-xl flex flex-col justify-between h-48 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-rentwise/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary-rentwise/10 transition-colors duration-700"></div>
          <div>
            <span className="material-symbols-outlined text-primary-rentwise mb-4 opacity-50">account_balance</span>
            <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest">Total Committed</h3>
          </div>
          <div>
            <p className="text-3xl font-black tracking-tight text-white">৳ {totalPaid.toLocaleString()}</p>
            <p className="text-primary-rentwise text-[10px] font-bold uppercase tracking-widest mt-1">Settled Revenue</p>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-xl flex flex-col justify-between h-48 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary-rentwise/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-tertiary-rentwise/10 transition-colors duration-700"></div>
          <div>
            <span className="material-symbols-outlined text-tertiary-rentwise mb-4 opacity-50">payments</span>
            <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest">Monthly Yield</h3>
          </div>
          <div>
            <p className="text-3xl font-black tracking-tight text-white">৳ {lease.monthly_rent?.toLocaleString()}</p>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Due every {lease.due_day || 1}th</p>
          </div>
        </div>

        <div className="bg-linear-to-br from-primary-rentwise to-secondary-rentwise p-8 rounded-xl flex flex-col justify-between h-48 shadow-2xl shadow-primary-rentwise/10 group hover:scale-[1.02] transition-transform duration-700">
          <div>
            <span className="material-symbols-outlined text-indigo-900 mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            <h3 className="text-indigo-900/60 text-xs font-black uppercase tracking-widest">Contract Status</h3>
          </div>
          <div>
            <p className="text-indigo-900 text-3xl font-black tracking-tight uppercase italic">{lease.status}</p>
            <p className="text-indigo-900/40 text-[10px] font-bold uppercase tracking-widest mt-1">Valid until {format(new Date(lease.end_date), 'MMM yyyy')}</p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tightest">Audit Trail</h3>
            <p className="text-slate-500 text-sm font-medium">Detailed transaction log for this residency cycle.</p>
          </div>
          <div className="px-4 py-2 bg-white/5 rounded-full border border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {payments.length} Records
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/5 bg-surface-container-low shadow-2xl">
          <div className="grid grid-cols-12 px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 bg-white/2 border-b border-white/5">
            <div className="col-span-5">Category / ID</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>

          <div className="divide-y divide-white/5">
            {payments.length > 0 ? (
              payments.map((p, idx) => (
                <div key={p.id} className={`grid grid-cols-12 px-8 py-8 items-center hover:bg-white/5 transition-colors group ${idx % 2 === 1 ? 'bg-white/1' : ''}`}>
                  <div className="col-span-5">
                    <p className="font-bold text-lg text-white group-hover:text-primary-rentwise transition-colors tracking-tight">
                      {p.method === 'CASH' ? 'Manual Remittance' : 'Automated Payment'}
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                      Ref: {p.transaction_id?.substring(0, 12) || p.reference || 'SYSTEM_GEN'}
                    </p>
                  </div>
                  <div className="col-span-3">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${p.status === 'SUCCESS' || p.status === 'PAID' || p.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                      }`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="col-span-2 text-slate-400 text-sm font-medium">
                    {format(new Date(p.created_at), 'MMM dd, yyyy')}
                  </div>
                  <div className="col-span-2 text-right font-black text-xl text-white tracking-tighter">
                    ৳ {p.amount.toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-24 text-center">
                <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs italic">No transactions manifest in the current cycle.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projection Block */}
      <section className="relative h-48 rounded-3xl overflow-hidden bg-surface-container-lowest flex items-center justify-center p-12 text-center group border border-white/5 shadow-inner">
        <div className="absolute inset-0 bg-linear-to-r from-primary-rentwise/5 via-transparent to-tertiary-rentwise/5 opacity-50"></div>
        <div className="relative z-10 space-y-2">
          <h3 className="text-slate-500 uppercase tracking-[0.4em] text-[10px] font-black">Projected Lifetime Value</h3>
          <p className="text-5xl font-black text-white tracking-tighter group-hover:scale-105 transition-transform duration-700">
            ৳ {(lease.monthly_rent * 12).toLocaleString()}
            <span className="text-xl text-slate-600 ml-3 uppercase font-black">Annual</span>
          </p>
        </div>
      </section>
    </div>
  );
};

export default LeaseLedger;
