import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { AddPropertyModal } from '../../properties';

const HowItWorks = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleListProperty = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/how-it-works');
      return;
    }
    setIsModalOpen(true);
  };

  const handlePropertyAdded = () => {
    setIsModalOpen(false);
    // After success, take them to the dashboard to see their listing
    navigate('/owner-dashboard');
  };
  return (
    <div className="animate-fade-in bg-[#0b1326] min-h-screen font-manrope">
      {/* Hero Section */}
      <section className="relative pt-48 pb-24 overflow-hidden flex flex-col items-center justify-center text-center">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary/10 blur-[150px] rounded-full opacity-60"></div>

        <div className="container relative z-10 px-6 mx-auto flex flex-col items-center max-w-4xl">
          <h1 className="text-6xl sm:text-[8rem] font-black leading-[0.85] tracking-tightest text-white mb-10">
            The <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-accent to-white italic">RentWise</span> Journey
          </h1>
          <p className="text-xl sm:text-2xl text-slate-400 leading-relaxed font-medium max-w-3xl">
            We've redefined the rental lifecycle. Whether you're acquiring a residence or managing a portfolio,
            our platform ensures architectural excellence at every step.
          </p>
        </div>
      </section>

      {/* The Process Details */}
      <section className="py-32 relative">
        <div className="container px-6 mx-auto max-w-[1920px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: '🔍',
                step: '01',
                title: 'Curated Discovery',
                desc: 'Explore our Bento Grid of verified, high-performance properties. Each listing is an architectural masterpiece with zero-compromise specifications.'
              },
              {
                icon: '🏦',
                step: '02',
                title: 'Ledger Integration',
                desc: 'Apply through a high-fidelity digital process. Our RentWise Ledger ensures transparent communication and secure financial transitions.'
              },
              {
                icon: '🔑',
                step: '03',
                title: 'Architectural Living',
                desc: 'Finalize your agreement, access your digital keys, and enjoy premium support. We provide 24/7 maintenance for every unit in our portfolio.'
              }
            ].map((step, i) => (
              <div key={i} className="bg-surface-rentwise rounded-[2.5rem] p-12 flex flex-col items-start text-left group transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-white/5">
                <div className="flex justify-between items-center w-full mb-12">
                  <div className="text-6xl group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0">{step.icon}</div>
                  <span className="text-5xl font-black text-white/5 group-hover:text-primary/10 transition-colors duration-700 tracking-tighter">{step.step}</span>
                </div>
                <h4 className="text-3xl font-black text-white mb-6 tracking-tight">{step.title}</h4>
                <p className="text-slate-400 text-lg leading-relaxed font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-linear-to-b from-transparent to-primary/5 text-center">
        <div className="container px-6 mx-auto max-w-4xl">
          <h3 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tightest">Start Your Next Chapter.</h3>
          <p className="text-xl text-slate-400 mb-16 font-medium">Join the elite network of residents and owners leveraging the RentWise Design Language.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="bg-primary text-on-primary px-16 py-6 text-xs font-black uppercase tracking-[0.3em] rounded-4xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all" onClick={() => navigate('/')}>
              Explore Portfolio
            </button>
            <button
              className="bg-white/5 hover:bg-white/10 text-white px-16 py-6 rounded-4xl border border-white/10 text-xs font-black uppercase tracking-[0.3em] transition-all active:scale-95"
              onClick={handleListProperty}
            >
              List Property
            </button>
          </div>
        </div>
      </section>

      <AddPropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handlePropertyAdded}
      />
    </div>
  );
};

export default HowItWorks;
