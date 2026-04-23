import React from 'react';
import { PropertyCard, useProperties } from '../../properties';
import SearchBar from '../../../shared/components/SearchBar';

const Home = () => {
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
    <div className="min-h-screen bg-[#0b1326] text-white selection:bg-primary/30 font-manrope">
      {/* Cinematic Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary/10 blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/10 blur-[150px] rounded-full opacity-60"></div>
      </div>
      {/* Hero Section - The Sovereign Entry */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden">
        <div className="container relative z-10 px-6 lg:px-12 mx-auto max-w-7xl">
          <div className="animate-in fade-in slide-in-from-left-12 duration-1000">
            <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter text-white mb-12">
              Find Your Next <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-accent to-white italic pr-8">Perfect Home.</span>
            </h1>
            <p className="max-w-2xl text-xl lg:text-2xl text-slate-400 leading-relaxed mb-16 font-medium">
              The smartest way to rent in the city. RentWise connects premium properties with verified tenants through a seamless, <span className="text-white">high-end experience</span>.
            </p>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            <div className="relative group max-w-4xl">
              {/* Floating Glass Search Bar */}
              <div className="absolute -inset-1 bg-linear-to-r from-primary to-accent rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-[#171f33]/80 backdrop-blur-3xl p-4 lg:p-6 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center gap-4 border border-white/5">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={handleSearch}
                  className="w-full bg-transparent border-none focus:ring-0 text-lg lg:text-xl font-bold placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-6">
              <span className="text-slate-500 uppercase tracking-widest text-xs font-black">Trending Areas</span>
              <div className="flex gap-3">
                {['Banani', 'Gulshan', 'Dhanmondi'].map(area => (
                  <button
                    key={area}
                    className="rounded-2xl bg-white/5 px-6 py-3 text-sm font-bold text-slate-400 transition-all hover:bg-white/10 hover:text-white active:scale-95 border border-white/5"
                    onClick={() => handleSearch(area)}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          </div>
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
              <p className="text-text-muted text-sm italic font-medium">Fine-tuning your search results...</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                  {properties.map((prop, index) => (
                    <PropertyCard key={prop?.id || index} property={prop} />
                  ))}
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
