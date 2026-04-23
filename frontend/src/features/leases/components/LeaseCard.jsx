import React from 'react';

const LeaseCard = ({ lease }) => {
  const nextPayment = new Date(lease.next_payment_date);
  const isOverdue = nextPayment < new Date();

  return (
    <div className="relative group overflow-hidden bg-[#131b2e] rounded-[2.5rem] shadow-2xl transition-all duration-700 hover:scale-[1.01] hover:shadow-accent/10">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

      <div className="p-8 sm:p-10 flex flex-col lg:flex-row gap-10 items-center">
        {/* Property Image / Avatar */}
        <div className="relative w-full lg:w-48 h-48 rounded-4xl overflow-hidden shadow-2xl shrink-0 border border-white/5">
          <img 
            src={lease.property_image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=300'} 
            alt={lease.property_title} 
            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0b1326]/80 to-transparent"></div>
          <div className="absolute bottom-4 left-4">
             <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-accent/20">
               Active Lease
             </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 space-y-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h3 className="text-3xl font-black text-white tracking-tight leading-none mb-2">
                {lease.property_title}
              </h3>
              <p className="text-text-secondary font-medium text-lg">Monthly Rent: <span className="text-white font-bold">৳{lease.monthly_rent?.toLocaleString()}</span></p>
            </div>
            
            <div className="flex flex-col sm:items-end">
               <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-2">Next Rent Due</span>
               <div className={`text-2xl font-black tracking-tightest ${isOverdue ? 'text-danger' : 'text-accent'}`}>
                  {nextPayment.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/5">
            <div>
               <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Lease Start</p>
               <p className="text-white font-bold">{new Date(lease.start_date).toLocaleDateString()}</p>
            </div>
            <div>
               <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Lease End</p>
               <p className="text-white font-bold">{new Date(lease.end_date).toLocaleDateString()}</p>
            </div>
            <div>
               <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Status</p>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  <span className="text-success font-black text-xs uppercase tracking-widest">{lease.status}</span>
               </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
             <button className="flex-1 sm:flex-none btn-primary px-10 py-4 text-xs font-black uppercase tracking-widest bg-linear-to-r from-accent to-primary shadow-xl shadow-accent/20 hover:scale-105 transition-all">
                Pay Current Rent
             </button>
             <button className="flex-1 sm:flex-none px-10 py-4 text-xs font-black uppercase tracking-widest border border-white/10 rounded-2xl text-white hover:bg-white/5 transition-all">
                View Agreement
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaseCard;
