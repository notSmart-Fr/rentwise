import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth';
import { usePayments } from '../hooks/usePayments';

const PaymentReceipt = ({ request }) => {
   const { isOwner } = useAuth();
   const { fetchPaymentByRequest, loading: hookLoading, error: hookError } = usePayments();
   const [payment, setPayment] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      if (request?.id) {
         const loadData = async () => {
            setLoading(true);
            const data = await fetchPaymentByRequest(request.id, isOwner);
            if (data) setPayment(data);
            else setError("No payment record found.");
            setLoading(false);
         };
         loadData();
      }
   }, [request, isOwner, fetchPaymentByRequest]);

   const handlePrint = () => {
      window.print();
   };

   if (!request) return null;

   if (loading) {
      return (
         <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Fetching Record...</p>
         </div>
      );
   }

   if (error || !payment) {
      return (
         <div className="glass-panel p-8 text-center border-dashed">
            <div className="text-4xl mb-4 grayscale opacity-20">📄</div>
            <p className="text-sm font-bold text-text-secondary">{error || "No payment record found."}</p>
         </div>
      );
   }

   return (
      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
         <div className="glass-panel p-0 overflow-hidden border-white/10 shadow-2xl bg-white/2">
            {/* Receipt Header (Non-Print) */}
            <div className="p-6 border-b border-white/5 bg-white/2 flex items-center justify-between print:hidden">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center text-success">
                     <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                  </div>
                  <h3 className="font-black text-white text-sm uppercase tracking-widest">Digital Receipt</h3>
               </div>
               <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all active:scale-95"
               >
                  Download PDF
               </button>
            </div>

            {/* Receipt Content (The "Invoice" Feel) */}
            <div className="p-8 space-y-8 bg-white/1 print:text-black print:bg-white print:p-12">
               <div className="flex justify-between items-start">
                  <div>
                     <h2 className="text-2xl font-black text-white print:text-black">RentWise <span className="text-primary italic">Pay</span></h2>
                     <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold mt-1">Transaction Verified</p>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Date Generated</p>
                     <p className="text-sm font-bold text-white print:text-black">{new Date(payment.created_at).toLocaleDateString()}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6 py-8 border-y border-white/5 print:border-slate-200">
                  <div className="space-y-4">
                     <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted mb-1">Property</p>
                        <p className="text-sm font-bold text-white print:text-black">{request.property_title}</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted mb-1">Resident</p>
                        <p className="text-sm font-bold text-white print:text-black">{payment.tenant_name || request.tenant_name}</p>
                     </div>
                  </div>
                  <div className="space-y-4 text-right">
                     <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted mb-1">Payment Method</p>
                        <p className="text-sm font-bold text-white print:text-black">{payment.method}</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted mb-1">Status</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black bg-success/20 text-success border border-success/20 uppercase tracking-widest">
                           {payment.status}
                        </span>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center justify-between p-6 bg-white/2 rounded-2xl print:bg-slate-50">
                     <span className="text-sm font-bold text-text-secondary print:text-slate-600">Total Amount Received</span>
                     <span className="text-3xl font-black text-white print:text-black tracking-tighter">৳{payment.amount?.toLocaleString()}</span>
                  </div>

                  {payment.transaction_id && (
                     <div className="flex items-center justify-between px-6 py-2">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Transaction ID</span>
                        <span className="text-[10px] font-mono text-text-secondary select-all">{payment.transaction_id}</span>
                     </div>
                  )}
               </div>

               <div className="pt-8 text-center space-y-2 opacity-50">
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-text-muted">Authentic Digital Document</p>
                  <div className="flex justify-center gap-2">
                     {[1, 2, 3, 4].map(i => <div key={i} className="w-1 h-1 rounded-full bg-white/20"></div>)}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default PaymentReceipt;
