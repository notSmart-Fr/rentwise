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
    <div className="animate-fade-in bg-bg-base overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-hero-pt pb-section-py border-b border-white/5 overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Subtle Background Elements */}
        <div className="absolute top-[-5%] left-[-2%] w-[450px] h-[450px] bg-primary/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>
        <div className="absolute top-[15%] right-[-5%] w-[350px] h-[350px] bg-accent/5 rounded-full blur-[80px] pointer-events-none animate-pulse-slow delay-1000"></div>

        <div className="container relative z-10 px-6 mx-auto flex flex-col items-center max-w-6xl">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black leading-[0.98] tracking-tight text-white mb-10">
            Find Your Next <br />
            <span className="bg-linear-to-r from-primary via-accent to-white bg-clip-text text-transparent italic">Perfect Home.</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-text-secondary leading-relaxed mb-16 opacity-70 font-medium">
            The smartest way to rent in the city. RentWise connects premium properties with verified tenants through a seamless, stress-free experience.
          </p>

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            className="mb-12 w-full max-w-3xl mx-auto"
          />

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
            <span className="text-text-muted uppercase tracking-[0.2em] text-[10px] w-full mb-2">Popular Areas</span>
            {['Banani', 'Gulshan', 'Dhanmondi'].map(area => (
              <button
                key={area}
                className="rounded-full border border-white/5 bg-white/5 px-4 py-2 text-text-secondary transition-all hover:bg-primary/20 hover:text-white hover:border-primary/20 active:scale-95"
                onClick={() => handleSearch(area)}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section id="results" className="py-section-py border-t border-white/5">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-header-mb gap-8">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tight">
                {searchParams.search ? `Results for "${searchParams.search}"` : 'Latest Listings'}
              </h2>
              <p className="text-text-secondary text-lg font-medium opacity-60">Experience the finest properties available today</p>
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

      {/* How It Works Section */}
      <section className="py-section-py bg-white/1 relative border-t border-white/5">
        <div className="absolute inset-0 bg-primary/2 opacity-5 pointer-events-none"></div>
        <div className="container px-6 mx-auto relative z-10">
          <div className="text-center mb-header-mb">
            <h2 className="text-[11px] font-black tracking-[0.6em] text-primary uppercase mb-6">The Process</h2>
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Simple. Secure. Fast.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🔍',
                title: 'Search & Explore',
                desc: 'Browse curated listings with verified data and high-quality photography.'
              },
              {
                icon: '🤝',
                title: 'Apply Instantly',
                desc: 'Lodge requests directly and chat with owners in a secure environment.'
              },
              {
                icon: '🔑',
                title: 'Move In',
                desc: 'Finalize terms and move into your dream home with zero stress.'
              }
            ].map((step, i) => (
              <div key={i} className="glass-panel p-8 flex flex-col items-center text-center group transition-all duration-500 hover:bg-white/3">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{step.icon}</div>
                <h4 className="text-lg font-bold text-white mb-3">{step.title}</h4>
                <p className="text-text-secondary text-sm leading-relaxed max-w-[240px] opacity-80">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
