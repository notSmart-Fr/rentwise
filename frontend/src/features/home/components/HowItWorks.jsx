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
    <div className="animate-fade-in bg-bg-base min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-hero-pt pb-20 border-b border-white/5 overflow-hidden flex flex-col items-center justify-center text-center">
        <div className="absolute top-[-5%] left-[-2%] w-[450px] h-[450px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container relative z-10 px-6 mx-auto flex flex-col items-center max-w-4xl">
          <h1 className="text-5xl sm:text-7xl font-black leading-[0.98] tracking-tight text-white mb-8">
            How <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent italic pr-4">RentWise</span> Works
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary leading-relaxed opacity-70 font-medium">
            We've simplified the rental journey. Whether you're looking for a home or hosting one, 
            our platform ensures a secure and seamless experience from start to finish.
          </p>
        </div>
      </section>

      {/* The Process Details */}
      <section className="py-section-py relative">
        <div className="container px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: '🔍',
                step: '01',
                title: 'Search & Explore',
                desc: 'Browse through our curated collection of premium listings. Each property is verified and features high-resolution photography and detailed specifications.'
              },
              {
                icon: '🤝',
                step: '02',
                title: 'Apply & Connect',
                desc: 'Found a place you love? Submit your digital application instantly. Our built-in messaging system lets you chat directly with owners to discuss details.'
              },
              {
                icon: '🔑',
                step: '03',
                title: 'Move In Securely',
                desc: 'Review digital lease terms, finalize payments through our secure ledger, and get your keys. We stay with you throughout your tenancy for any maintenance needs.'
              }
            ].map((step, i) => (
              <div key={i} className="glass-panel p-10 flex flex-col items-start text-left group transition-all duration-500 hover:bg-white/3 border-white/5">
                <div className="flex justify-between items-center w-full mb-8">
                  <div className="text-5xl group-hover:scale-110 transition-transform duration-300">{step.icon}</div>
                  <span className="text-4xl font-black text-white/5 group-hover:text-primary/20 transition-colors duration-500">{step.step}</span>
                </div>
                <h4 className="text-2xl font-bold text-white mb-4 tracking-tight">{step.title}</h4>
                <p className="text-text-secondary text-base leading-relaxed opacity-70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary/5 border-y border-white/5 text-center">
        <div className="container px-6 mx-auto max-w-2xl">
          <h3 className="text-3xl font-black text-white mb-6">Ready to find your next home?</h3>
          <p className="text-text-secondary mb-10 opacity-70">Join thousands of verified renters and owners on the most advanced rental platform in the city.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="btn btn-primary px-10 py-4 text-lg font-bold shadow-xl shadow-primary/20" onClick={() => navigate('/')}>
              Start Exploring
            </button>
            <button 
              className="bg-white/5 hover:bg-white/10 text-white px-10 py-4 rounded-xl border border-white/10 font-bold transition-all active:scale-95"
              onClick={handleListProperty}
            >
              List Your Property
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
