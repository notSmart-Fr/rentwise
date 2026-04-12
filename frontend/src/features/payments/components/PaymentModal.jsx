import React, { useState, useEffect } from 'react';
import { usePayments } from '../hooks/usePayments';

const PaymentModal = ({ request, isOpen, onClose, onSuccess, existingPayment = null }) => {
  const { manageOwnerPayment, loading, error } = usePayments();
  const [formData, setFormData] = useState({
    amount: 0,
    method: 'CASH',
    status: 'PAID',
    reference: ''
  });

  const isEditing = !!existingPayment;

  useEffect(() => {
    if (existingPayment) {
      setFormData({
        amount: existingPayment.amount,
        method: existingPayment.method,
        status: existingPayment.status,
        reference: existingPayment.reference || ''
      });
    } else if (request) {
      setFormData({
        amount: request.property_rent || 0,
        method: 'CASH',
        status: 'PAID',
        reference: ''
      });
    }
  }, [existingPayment, request, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await manageOwnerPayment(
      request.id,
      formData,
      existingPayment?.id
    );
    if (result.success) {
      onSuccess();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-bg-base/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg glass-panel p-0 overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-500">

        {/* Header Strip */}
        <div className="p-8 border-b border-white/5 bg-white/2 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white leading-none">
              {isEditing ? 'Edit Ledger' : 'Record Payment'}
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold mt-3">Ledger Entry #{(existingPayment?.id || 'NEW').slice(0, 8)}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-text-muted hover:text-white transition-all outline-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl">
            <p className="text-xs text-text-secondary leading-relaxed">
              Updating account for <span className="font-bold text-white">{request.tenant_name}</span> at <span className="font-bold text-white italic">{request.property_title}</span>.
            </p>
          </div>

          {error && <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm">{error}</div>}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Amount Received (৳)</label>
              <input
                type="number"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-lg focus:border-primary/50 outline-none transition-all placeholder:text-text-muted/50"
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Method</label>
                <select
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm text-white focus:border-primary/50 outline-none transition-all"
                  value={formData.method}
                  onChange={e => setFormData({ ...formData, method: e.target.value })}
                >
                  <option value="CASH" className="bg-slate-900">Cash</option>
                  <option value="BANK_TRANSFER" className="bg-slate-900">Bank Transfer</option>
                  <option value="BKASH" className="bg-slate-900">bKash</option>
                  <option value="NAGAD" className="bg-slate-900">Nagad</option>
                  <option value="CREDIT_CARD" className="bg-slate-900">Credit Card</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Status</label>
                <select
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm text-white focus:border-primary/50 outline-none transition-all"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="PAID" className="bg-slate-900 text-success">Paid</option>
                  <option value="PENDING" className="bg-slate-900 text-warning">Pending</option>
                  <option value="FAILED" className="bg-slate-900 text-danger">Failed</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Reference Note</label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-primary/50 outline-none transition-all placeholder:text-text-muted/50"
                placeholder="Ex. TrxID or Cash Receipt #"
                value={formData.reference}
                onChange={e => setFormData({ ...formData, reference: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 btn btn-secondary py-4 text-sm">Cancel</button>
            <button
              type="submit"
              disabled={loading}
              className="flex-2 btn btn-primary py-4 text-sm shadow-xl shadow-primary/20"
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Entry' : 'Verify & Post')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
