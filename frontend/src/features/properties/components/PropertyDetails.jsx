import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth';
import { useChat } from '../../messaging';
import { usePropertyDetails } from '../hooks/usePropertyDetails';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isTenant } = useAuth();
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
      <div className="container flex min-h-[50vh] items-center justify-center pt-32">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container pt-32 text-center">
        <h2 className="text-2xl font-bold text-red-500">{error || 'Property not found'}</h2>
        <Link to="/" className="mt-8 inline-block rounded-lg bg-primary px-6 py-3 font-bold text-white transition-transform hover:scale-105">
          Back to Search
        </Link>
      </div>
    );
  }

  const images = property.images?.length > 0
    ? property.images
    : [{ url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80' }];

  return (
    <div className="container pb-20 pt-32 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="mb-10 flex items-center gap-3 text-sm font-medium text-slate-400 cursor-default select-none">
        <Link to="/" className="transition-colors hover:text-white cursor-pointer">Explore</Link>
        <span className="text-slate-600">/</span>
        <span className="text-slate-400">{property.city}</span>
        <span className="text-slate-600">/</span>
        <span className="font-bold text-white">{property.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 items-start lg:grid-cols-[1.8fr_1.2fr]">
        {/* Main Content */}
        <div className="flex flex-col gap-10">
          {/* Gallery */}
          <div className="flex flex-col gap-5">
            <div className="aspect-video overflow-hidden rounded-2xl border border-white/5 bg-slate-900 shadow-2xl shadow-black/50">
              <img
                src={images[activeImage].url}
                alt={property.title}
                className="h-full w-full object-cover transition-opacity duration-500"
                key={activeImage}
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, index) => (
                  <button
                    key={img.id || index}
                    className={`relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${activeImage === index
                        ? 'border-primary shadow-[0_0_15px_rgba(124,58,237,0.4)] opacity-100 scale-105'
                        : 'border-transparent opacity-40 hover:opacity-100 hover:scale-105'
                      }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img src={img.url} alt={`View ${index + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Sections */}
           <div className="flex flex-col gap-8">
            <div className="space-y-2 cursor-default select-none">
              <h1 className="text-4xl font-black tracking-tight text-white lg:text-5xl">{property.title}</h1>
              <div className="flex items-center gap-2 text-lg text-slate-400">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {property.area}, {property.city}
              </div>
            </div>

            {/* Specs Bar */}
            <div className="flex flex-wrap gap-10 border-y border-white/5 py-8 cursor-default select-none">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Bedrooms</span>
                <span className="text-2xl font-black text-white">{property.bedrooms || 'N/A'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Bathrooms</span>
                <span className="text-2xl font-black text-white">{property.bathrooms || 'N/A'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Status</span>
                <span className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${property.is_available
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}>
                  {property.is_available ? 'Available' : 'Rented'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white cursor-default select-none">About this home</h3>
              <p className="text-lg leading-relaxed text-slate-400">
                {property.description || "No description provided by the owner."}
              </p>
            </div>

            {/* Amenities */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white cursor-default select-none">Amenities</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {['✨ Modern Finish', '🚗 Parking Space', '🛡️ 24/7 Security', '📶 High-Speed Internet'].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-4 font-bold text-slate-300 transition-all hover:border-primary hover:bg-white/8 hover:text-white cursor-default select-none">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:sticky lg:top-32">
          <div className="flex flex-col gap-6 rounded-2xl border border-white/5 bg-white/5 p-10 backdrop-blur-xl shadow-2xl">
            <div className="flex items-baseline gap-2 border-b border-white/5 pb-6 cursor-default select-none">
              <span className="text-4xl font-black text-white font-display">৳ {property.rent_amount.toLocaleString()}</span>
              <span className="text-slate-400 text-lg">/ month</span>
            </div>

            {property.owner_id !== user?.id || !isAuthenticated ? (
              <div className="space-y-6">
                {requestStatus === 'success' ? (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center animate-fade-in">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-2xl text-white">✓</div>
                    <h3 className="text-xl font-bold text-emerald-400">Request Sent!</h3>
                    <p className="mt-2 text-sm text-slate-400 italic">The owner will be notified shortly.</p>
                    <Link to="/my-requests" className="mt-6 block rounded-xl bg-primary py-3 font-bold text-white transition-transform hover:scale-[1.02]">
                      View My Requests
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <p className="text-sm text-slate-500">Includes maintenance fees. Utilities not included.</p>
                    {isTenant || !isAuthenticated ? (
                       <>
                        <button
                          onClick={handleRequestLease}
                          disabled={requestStatus === 'loading' || !property.is_available}
                          className="w-full rounded-xl bg-primary py-4 text-lg font-black text-white shadow-xl transition-all hover:scale-[1.02] hover:shadow-primary/20 disabled:opacity-50 disabled:grayscale"
                        >
                          {requestStatus === 'loading' ? 'Processing...' : 'Request Lease'}
                        </button>
                        <button
                          onClick={handleOpenChat}
                          disabled={!property.is_available}
                          className="w-full rounded-xl border border-white/10 bg-white/5 py-4 text-lg font-black text-white transition-all hover:bg-white/10"
                        >
                          💬 Message Owner
                        </button>
                       </>
                    ) : (
                       <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                          <p className="text-sm text-text-secondary font-bold uppercase tracking-widest">Switch to Renting mode to interact</p>
                       </div>
                    )}
                    <p className="text-center text-xs text-slate-500">Zero upfront fees for requesting.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 space-y-3">
                <div className="flex items-center gap-2 text-primary">
                   <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                   <p className="font-bold text-white italic">You own this property.</p>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">Manage occupancy, tickets, and rent collection for this asset from your dashboard.</p>
                <Link to="/owner-dashboard" className="block w-full rounded-lg border border-primary/50 py-3 text-center text-sm font-bold text-primary hover:bg-primary/10 transition-all">
                  Go to Asset Management
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
