import React from 'react';
import { PropertyCard, useProperties } from '../../properties';
import { useAuth } from '../../auth';
import { Link } from 'react-router-dom';

const Home = () => {
  const { isAuthenticated, user, isTenant } = useAuth();
  const {
    properties,
    loading,
    error,
    searchParams,
    searchQuery,
    setSearchQuery,
    handleSearch,
    handleFilterChange,
    clearAllSearch
  } = useProperties();

  return (
    <div className="min-h-screen bg-[#0b1326] text-white selection:bg-primary/30 font-manrope overflow-x-hidden">
      {/* Cinematic Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary/10 blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/10 blur-[150px] rounded-full opacity-60"></div>
      </div>

      {/* Hero Section - The RentWise Entry */}
      <section className="relative min-h-screen flex flex-col items-start justify-center pt-32 pb-20 px-6 lg:px-12 max-w-[1920px] mx-auto overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute top-0 right-0 w-2/3 h-full opacity-20 -z-10 select-none pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-l from-[#0b1326] via-[#0b1326]/40 to-transparent"></div>
          <img
            alt="Luxury property"
            className="w-full h-full object-cover grayscale opacity-50"
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600"
          />
        </div>

        <div className="max-w-6xl space-y-12 relative z-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          {isAuthenticated && isTenant ? (
            <div className="space-y-12">
              <div className="space-y-4">
                <p className="text-primary font-black uppercase tracking-[0.4em] text-xs">Resident Portfolio Active</p>
                <h1 className="text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tightest leading-[0.85] text-white">
                  Welcome Home, <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-accent to-white italic">{user?.full_name?.split(' ')[0] || 'Resident'}.</span>
                </h1>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <Link 
                  to="/dashboard"
                  className="bg-white text-slate-950 px-12 py-6 rounded-full font-black uppercase tracking-widest text-sm flex items-center gap-3 hover:scale-105 transition-all shadow-2xl"
                >
                  Access Resident Hub
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-10 py-6 rounded-full flex items-center gap-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Next Payment</p>
                    <p className="text-xl font-black text-white">৳ {properties[0]?.rent_amount?.toLocaleString() || '---'}</p>
                  </div>
                  <div className="h-10 w-px bg-white/10"></div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">Status</p>
                    <p className="text-xl font-black text-white">Verified</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tightest leading-[0.85] text-white">
                The RentWise <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-accent to-white italic">Asset Portfolio.</span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-400 max-w-2xl font-medium leading-relaxed">
                Elite property management for the modern era. Secure your residency and manage your financial portfolio in one cinematic interface.
              </p>

              {/* Search Bar RentWise Edition */}
              <div className="w-full max-w-4xl bg-[#171f33]/60 backdrop-blur-3xl p-3 rounded-[2.5rem] shadow-2xl mt-12 flex flex-col md:flex-row items-center gap-2 border border-white/5 group hover:border-primary/20 transition-all duration-700">
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
                  <div className="px-8 py-4 flex flex-col justify-center">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-black mb-1">Location</span>
                    <input
                      className="bg-transparent border-none p-0 text-white placeholder:text-slate-600 focus:ring-0 text-lg font-bold"
                      placeholder="Dhaka, BD"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <div className="px-8 py-4 flex flex-col justify-center">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-black mb-1">Architectural Type</span>
                    <select
                      className="bg-transparent border-none p-0 text-white focus:ring-0 text-lg font-bold appearance-none cursor-pointer"
                      value={searchParams.property_type || ''}
                      onChange={(e) => handleFilterChange('property_type', e.target.value)}
                    >
                      <option value="" className="bg-[#0b1326]">Any Type</option>
                      <option value="Apartment" className="bg-[#0b1326]">Apartment</option>
                      <option value="Penthouse" className="bg-[#0b1326]">Penthouse</option>
                      <option value="Villa" className="bg-[#0b1326]">Villa</option>
                      <option value="Townhouse" className="bg-[#0b1326]">Townhouse</option>
                      <option value="Studio" className="bg-[#0b1326]">Studio</option>
                    </select>
                  </div>
                  <div className="px-8 py-4 flex flex-col justify-center">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-black mb-1">Price Range</span>
                    <select
                      className="bg-transparent border-none p-0 text-white focus:ring-0 text-lg font-bold appearance-none cursor-pointer"
                      onChange={(e) => {
                        const [min, max] = e.target.value.split('-').map(v => v === 'null' ? null : parseInt(v));
                        handleFilterChange('min_rent', min);
                        handleFilterChange('max_rent', max);
                      }}
                    >
                      <option value="null-null" className="bg-[#0b1326]">Any Price</option>
                      <option value="0-50000" className="bg-[#0b1326]">Under ৳50k</option>
                      <option value="50000-100000" className="bg-[#0b1326]">৳50k - ৳100k</option>
                      <option value="100000-250000" className="bg-[#0b1326]">৳100k - ৳250k</option>
                      <option value="250000-null" className="bg-[#0b1326]">৳250k+</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => handleSearch()}
                  className="w-full md:w-auto bg-primary text-on-primary px-12 py-5 rounded-4xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-105 hover:shadow-[0_0_30px_rgba(128,131,255,0.4)] transition-all active:scale-95"
                >
                  Search
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Featured Properties Section */}
      <section id="results" className="py-24 lg:py-32 relative z-10">
        <div className="container px-6 lg:px-12 mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row items-end justify-between mb-16 gap-10">
            <div className="animate-in fade-in slide-in-from-left-8 duration-700">
              <h2 className="text-4xl sm:text-6xl font-black text-white mb-4 tracking-tighter">
                {searchParams.search ? `Results for "${searchParams.search}"` : 'Latest Listings'}
              </h2>
              <p className="text-slate-400 text-xl font-medium">Experience the finest properties available today</p>
            </div>

            <div className="flex items-center gap-4">
              <select
                className="bg-white/5 border border-white/10 text-white font-bold py-3 px-6 rounded-xl outline-none focus:border-primary transition-colors cursor-pointer text-sm"
                onChange={(e) => handleFilterChange('city', e.target.value)}
                value={searchParams.city || 'All Cities'}
              >
                <option value="All Cities" className="bg-slate-900 font-bold">All Cities</option>
                {['Dhaka', 'Chittagong', 'Sylhet'].map(city => (
                  <option key={city} value={city} className="bg-slate-900 font-bold">{city}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
              <p className="text-slate-500 text-sm italic font-black uppercase tracking-[0.3em]">Curating your portfolio...</p>
            </div>
          ) : error ? (
            <div className="glass-panel py-32 flex flex-col items-center justify-center text-center border-red-500/20">
              <span className="text-6xl mb-6">⚠️</span>
              <h3 className="text-2xl font-bold text-white mb-3">Unable to load properties</h3>
              <p className="text-text-secondary max-w-sm mb-10 text-sm">{error}. Please ensure the backend is running.</p>
              <button
                className="btn btn-primary px-8 py-3.5 shadow-lg active:scale-95 transition-transform"
                onClick={() => window.location.reload()}
              >
                Retry Connection
              </button>
            </div>
          ) : (
            <>
              {properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                  {properties.map((prop, index) => {
                    // Logic to create a Bento Grid pattern (8-4, 6-6, etc.)
                    const spanClass = index % 4 === 0 ? 'md:col-span-8' : index % 4 === 1 ? 'md:col-span-4' : 'md:col-span-6';
                    return (
                      <div key={prop?.id || index} className={spanClass}>
                        <PropertyCard property={prop} isHero={index % 4 === 0} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="glass-panel py-32 flex flex-col items-center justify-center text-center border-dashed border-white/10">
                  <span className="text-6xl mb-6 grayscale opacity-20">🏠</span>
                  <h3 className="text-2xl font-bold text-white mb-3">No listings found</h3>
                  <p className="text-text-secondary max-w-sm mb-10 text-sm">We couldn't find any properties matching your current filters. Try expanding your search area.</p>
                  <button
                    className="btn btn-primary px-8 py-3.5 shadow-lg active:scale-95 transition-transform"
                    onClick={clearAllSearch}
                  >
                    Clear Search Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>


    </div>
  );
};

export default Home;
