import { useOwnerPayments } from '../hooks/useOwnerPayments';
import StatsCard from '../../../shared/components/StatsCard';
import { paymentsService } from '../services/paymentsService';

const OwnerPayments = () => {
  const { payments, loading, error, revenueStats, refresh } = useOwnerPayments();

  const handleExport = async () => {
    try {
      await paymentsService.exportPaymentsCsv();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  if (loading && payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-text-secondary text-sm font-medium">Syncing revenue records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white">Financial Hub</h2>
          <p className="text-text-secondary mt-1">Master ledger and revenue tracking for your portfolio.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            className="btn btn-secondary px-6 text-xs font-bold uppercase tracking-widest border-white/10 bg-white/5 hover:bg-white/10 flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export CSV
          </button>
          <button 
            onClick={refresh}
            className="btn btn-secondary px-6 text-xs font-bold uppercase tracking-widest border-white/5 bg-white/5 hover:bg-white/10"
          >
            Refresh Data
          </button>
        </div>
      </div>


      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Collected" 
          value={`৳ ${revenueStats.total.toLocaleString()}`} 
          icon="💰" 
          color="purple" 
        />
        <StatsCard 
          title="Pending Payments" 
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

      {/* Transaction Table */}
      <div className="glass-panel overflow-hidden border-white/5 bg-white/1">
        <div className="p-6 border-b border-white/5 bg-white/2">
          <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Tenant</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Property</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Method</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted text-right">Date</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payments.length > 0 ? (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/2 transition-colors group">
                    <td className="px-6 py-5 font-bold text-white">{p.tenant_name || 'Resident'}</td>
                    <td className="px-6 py-5 text-sm text-text-secondary">{p.property_title || 'N/A'}</td>
                    <td className="px-6 py-5">
                      <span className="text-accent font-black tracking-tight">৳ {p.amount?.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded border border-white/5 text-text-muted">
                        {p.payment_method || 'Other'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-tighter ${
                        p.status === 'PAID' || p.status === 'SUCCESS'
                        ? 'bg-success/10 text-success border border-success/20' 
                        : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right text-xs text-text-muted">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-right">
                      {(p.status === 'PAID' || p.status === 'SUCCESS') && (
                        <button
                          onClick={() => paymentsService.downloadReceipt(p.id, true)}
                          className="p-2 bg-white/5 hover:bg-primary/20 rounded-lg text-white transition-all"
                          title="Download PDF"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                        </button>

                      )}
                    </td>
                  </tr>
                ))

              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-text-muted italic">
                    No transactions found in your records.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OwnerPayments;
