import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth';
import { useChat } from '../../messaging';
import { usePropertyDetails } from '../hooks/usePropertyDetails';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isTenant, user } = useAuth();
  const { openChat } = useChat();

  const {
    property,
    loading,
    error,
    activeImage,
    setActiveImage,
    requestStatus,
    requestLease
  } = usePropertyDetails(id);

  const handleOpenChat = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/properties/${id}` } });
      return;
    }
    openChat(
      'PROPERTY',
      property.id,
      `Inquiry: ${property.title}`,
      property.owner_name || 'Owner',
      property.owner_id
    );
  };

  const handleRequestLease = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/properties/${id}` } });
      return;
    }
    await requestLease();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1326] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-on-surface-variant text-[10px] font-black uppercase tracking-[0.3em]">Auditing Asset Specs...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-[#0b1326] flex flex-col items-center justify-center px-6">
        <span className="text-6xl mb-8">⚠️</span>
        <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">{error || 'Asset Not Found'}</h2>
        <Link to="/" className="bg-surface-container-high px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest text-primary hover:bg-surface-bright transition-all">
          Return to Discovery
        </Link>
      </div>
    );
  }

  const images = property.images?.length > 0
    ? property.images
    : [{ url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80' }];

  return (
    <div className="min-h-screen bg-[#0b1326] text-white font-manrope selection:bg-primary/30 overflow-x-hidden">
      {/* Cinematic Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full opacity-40"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[150px] rounded-full opacity-30"></div>
      </div>

      <main className="relative z-10 max-w-[1920px] mx-auto pt-32 px-6 lg:px-20 pb-32">
        {/* Editorial Header */}
        <header className="mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <nav className="mb-8 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant overflow-x-auto whitespace-nowrap scrollbar-hide">
            <Link to="/" className="hover:text-primary transition-colors shrink-0">Discovery</Link>
            <span className="opacity-20 shrink-0">/</span>
            <span className="hover:text-primary transition-colors shrink-0">{property.city}</span>
            <span className="opacity-20 shrink-0">/</span>
            <span className="text-white shrink-0">Active Listing</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="max-w-4xl">
              <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tightest leading-[0.9] text-white mb-6">
                {property.title}
              </h1>
              <div className="flex items-center gap-3 text-on-surface-variant text-base md:text-lg font-medium italic">
                <span className="material-symbols-outlined text-primary-sovereign">location_on</span>
                {property.area}, {property.city}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-8 md:gap-12 lg:border-l lg:border-outline-variant/10 lg:pl-10 h-fit">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Quarters</p>
                <p className="text-2xl md:text-3xl font-black tracking-tight">{property.bedrooms || 0} <span className="text-sm text-on-surface-variant font-medium uppercase">Beds</span></p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Bathrooms</p>
                <p className="text-2xl md:text-3xl font-black tracking-tight">{property.bathrooms || 0} <span className="text-sm text-on-surface-variant font-medium uppercase">Baths</span></p>
              </div>
            </div>
          </div>
        </header>

        {/* Asymmetrical Gallery */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-20">
          <div className="md:col-span-8 aspect-video md:aspect-16/10 rounded-3xl md:rounded-[3rem] overflow-hidden bg-surface-container-low group relative shadow-2xl">
            <img
              src={images[activeImage].url}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-surface-container-low/60 to-transparent"></div>
          </div>
          <div className="md:col-span-4 grid grid-cols-2 md:flex md:flex-col gap-4 md:gap-6">
            {images.slice(1, 3).map((img, i) => (
              <div
                key={i}
                className="aspect-square md:flex-1 rounded-3xl md:rounded-[3rem] overflow-hidden bg-surface-container-low group relative shadow-xl cursor-pointer"
                onClick={() => setActiveImage(i + 1)}
              >
                <img src={img.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-surface-container-low/20 group-hover:bg-transparent transition-colors"></div>
              </div>
            ))}
            {images.length > 3 && (
              <button className="col-span-2 md:col-span-1 h-16 md:h-20 rounded-full bg-surface-container-high border border-outline-variant/10 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-surface-bright transition-all">
                <span className="material-symbols-outlined text-sm">grid_view</span>
                View All {images.length}
              </button>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-20">
            {/* About Section */}
            <section className="space-y-8">
              <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-primary">Curated Sovereignty</h3>
              <div className="space-y-6 text-xl leading-relaxed text-on-surface-variant max-w-4xl font-medium">
                <p>{property.description || "A monolithic achievement in residential architecture, this property is more than a residence—it is a private financial ecosystem. Every structural element has been audited for longevity and efficiency."}</p>
              </div>
            </section>

            {/* Amenities Grid */}
            <section className="space-y-12">
              <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-secondary">Elite Provisions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { title: 'Infinity Lounge', desc: 'Climate-controlled rooftop sanctuary with zero-edge horizon.', icon: 'pool' },
                  { title: 'Smart HVAC', desc: 'Triple-filtered air purification with zone-specific climate AI.', icon: 'ac_unit' },
                  { title: 'Obsidian Security', desc: 'Biometric access points and 24/7 dedicated surveillance.', icon: 'shield' },
                  { title: 'Asset Verification', desc: 'Fully audited and certified in the RentWise Sovereign Ledger.', icon: 'verified' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 p-8 rounded-[2.5rem] bg-surface-container-low hover:bg-surface-container-high transition-colors group">
                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-black text-lg text-white">{item.title}</h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Action Card */}
          <aside className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-8">
            <div className="bg-surface-container-high rounded-[3rem] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <span className="material-symbols-outlined text-9xl">account_balance</span>
              </div>

              <div className="relative z-10">
                <div className="mb-12">
                  <span className="text-on-surface-variant text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Monthly Ledger</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-primary-sovereign">৳</span>
                    <span className="text-5xl font-black text-white tracking-tighter">
                      {property.rent_amount.toLocaleString()}
                    </span>
                    <span className="text-on-surface-variant text-lg">/mo</span>
                  </div>

                  <div className={`mt-6 flex items-center gap-2 py-2 px-5 rounded-full w-fit ${property.is_available ? 'bg-secondary-container/20 text-secondary-sovereign' : 'bg-tertiary-container/20 text-tertiary-sovereign'}`}>
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span className="text-[9px] font-black tracking-[0.15em] uppercase">
                      {property.is_available ? 'Verified Asset Available' : 'Asset Currently Leveraged'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {requestStatus === 'success' ? (
                    <div className="bg-secondary-container/10 p-8 rounded-4xl text-center space-y-4 border border-secondary-container/20">
                      <div className="w-16 h-16 bg-secondary-sovereign rounded-full flex items-center justify-center mx-auto text-surface-container-high">
                        <span className="material-symbols-outlined text-3xl">check</span>
                      </div>
                      <p className="font-black text-secondary-sovereign uppercase tracking-widest text-xs">Request In Ledger</p>
                      <Link to="/my-requests" className="block text-sm font-bold text-white hover:text-primary transition-colors italic underline">View My Portfolio</Link>
                    </div>
                  ) : (
                    <>
                      {isTenant || !isAuthenticated ? (
                        <>
                          <button
                            onClick={handleRequestLease}
                            disabled={requestStatus === 'loading' || !property.is_available}
                            className="w-full bg-linear-to-br from-primary-sovereign to-primary-container text-[#0b1326] h-20 rounded-full font-black text-lg tracking-tight hover:shadow-[0_0_40px_rgba(192,193,255,0.3)] transition-all duration-500 active:scale-95 disabled:opacity-50"
                          >
                            {requestStatus === 'loading' ? 'Auditing...' : 'Request Lease'}
                          </button>
                          <button
                            onClick={handleOpenChat}
                            className="w-full bg-surface-container-highest text-white h-20 rounded-full font-bold text-lg hover:bg-surface-bright transition-colors flex items-center justify-center gap-3 active:scale-95"
                          >
                            <span className="material-symbols-outlined">chat_bubble</span>
                            Inquire with Advisor
                          </button>
                        </>
                      ) : (
                        <div className="p-8 rounded-[2.5rem] bg-surface-container-highest/40 text-center space-y-2 border border-white/5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Host Mode Active</p>
                          <p className="text-sm font-bold text-white italic">Switch to Renting to Lease</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-12 pt-10 border-t border-white/5 space-y-5">
                  <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                    <span>Security Deposit</span>
                    <span className="text-white">৳ {(property.rent_amount * 2).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                    <span>Platform Service</span>
                    <span className="text-white">৳ 1,200</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Manager Card */}
            <div className="bg-surface-container-low rounded-4xl p-6 flex items-center gap-5 group">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-surface-container-highest">
                <img
                  alt="Portfolio Manager"
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Portfolio Manager</p>
                <p className="font-black text-white">{property.owner_name || 'Julian Sterling'}</p>
              </div>
              <button className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-primary-sovereign hover:bg-primary-sovereign hover:text-white transition-all">
                <span className="material-symbols-outlined text-[20px]">call</span>
              </button>
            </div>
          </aside>
        </div>

        {/* Regional Intelligence (Bento-style) */}
        <section className="mt-40">
          <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-on-surface-variant mb-12">Property Intelligence</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="bg-surface-container-low h-[280px] md:h-[320px] rounded-3xl md:rounded-[3rem] relative p-8 md:p-10 group overflow-hidden">
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="relative h-full flex flex-col justify-between">
                <p className="text-[10px] font-black tracking-widest uppercase text-primary">District Performance</p>
                <div>
                  <p className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tightest">Premium</p>
                  <p className="text-xs text-on-surface-variant font-medium">Verified asset in {property.area}</p>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-low h-[280px] md:h-[320px] rounded-3xl md:rounded-[3rem] p-8 md:p-10 flex flex-col justify-between">
              <p className="text-[10px] font-black tracking-widest uppercase text-secondary">Proximity</p>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Central Transit</span>
                  <span className="text-xs font-black text-on-surface-variant uppercase tracking-widest">4 Min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Marketplace</span>
                  <span className="text-xs font-black text-on-surface-variant uppercase tracking-widest">8 Min</span>
                </div>
              </div>
            </div>
            <div className="sm:col-span-2 bg-surface-container-high rounded-3xl md:rounded-[3rem] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 md:p-12 opacity-5 scale-150 group-hover:scale-110 transition-transform duration-1000">
                <span className="material-symbols-outlined text-9xl">trending_up</span>
              </div>
              <p className="text-[10px] font-black tracking-widest uppercase text-tertiary">Portfolio Analysis</p>
              <div>
                <p className="text-2xl md:text-3xl font-light text-white mb-4 md:mb-6 leading-tight max-w-lg italic">
                  "This asset maintains consistent performance within the local luxury index."
                </p>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">RentWise Verified Audit</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PropertyDetails;

