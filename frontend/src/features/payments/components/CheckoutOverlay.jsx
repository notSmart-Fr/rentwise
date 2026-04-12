import React, { useState } from 'react';
import { usePayments } from '../hooks/usePayments';

const CheckoutOverlay = ({ request, onClose, onSuccess }) => {
  const { simulateTenantPayment, loading, error } = usePayments();
  const [step, setStep] = useState('confirm'); // confirm, processing, success

  const handlePay = async () => {
    setStep('processing');

    // Aesthetic delay for simulation feel
    setTimeout(async () => {
      const result = await simulateTenantPayment(request.id, request.property_rent);
      if (result.success) {
        setStep('success');
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setStep('confirm');
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-bg-base/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg glass-panel p-0 overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-500">

        {/* Header Strip */}
        <div className="bg-primary/10 border-b border-primary/20 p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-glow">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2.5" />
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight leading-none">Secure Pay</h2>
              <p className="text-[10px] uppercase tracking-widest text-primary font-bold mt-2">RentWise Transaction Hub</p>
            </div>
          </div>
          {step === 'confirm' && (
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-text-muted hover:text-white transition-all outline-none"
            >
              ×
            </button>
          )}
        </div>

        <div className="p-8">
          {step === 'confirm' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              {/* Order Summary */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-secondary">First Month Rent</span>
                  <span className="text-white font-bold">৳{request.property_rent?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-secondary">Platform Processing</span>
                  <span className="text-success font-bold">Free</span>
                </div>
                <div className="h-px bg-white/5 my-4"></div>
                <div className="flex justify-between items-end">
                  <span className="text-lg font-black text-white">Total Due</span>
                  <span className="text-3xl font-black text-white tracking-tighter">৳{request.property_rent?.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Method View */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Simulated Sandbox Method</label>
                <div className="p-5 border-2 border-primary/50 bg-primary/5 rounded-2xl flex items-center gap-5 shadow-[0_0_20px_rgba(124,58,237,0.1)]">
                  <div className="text-3xl">💳</div>
                  <div>
                    <h4 className="font-bold text-white text-sm">SafeConnect Virtual Card</h4>
                    <p className="text-xs text-text-secondary italic">Ending in **** 9928</p>
                  </div>
                  <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm text-center">
                  {error}
                </div>
              )}

              <button
                className="w-full btn btn-primary py-5 text-sm shadow-[0_15px_35px_rgba(124,58,237,0.3)] hover:-translate-y-1"
                onClick={handlePay}
              >
                Confirm Payment ৳{request.property_rent?.toLocaleString()}
              </button>

              <p className="text-center text-[10px] text-text-muted font-medium italic">
                You are currently in the RentWise Sandbox. No real funds will be moved.
              </p>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-20 flex flex-col items-center justify-center space-y-8 animate-in zoom-in-95">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white">Initiating Security Protocol...</h3>
                <p className="text-sm text-text-secondary animate-pulse">Contacting your virtual simulation bank</p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-20 flex flex-col items-center justify-center space-y-8 animate-in zoom-in-95">
              <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center text-white shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-black text-white">Payment Success!</h3>
                <p className="text-sm text-text-secondary">Your application is now confirmed.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutOverlay;
