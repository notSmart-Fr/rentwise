import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth';
import { usePropertyActions } from '../hooks/usePropertyActions';

const PropertyCard = ({ property, onEdit, isHero = false }) => {
  const { isTenant, isAuthenticated, user } = useAuth();
  const { requestStatus, handleQuickRequest } = usePropertyActions(property);

  const mainImage = property?.images && property.images.length > 0
    ? property.images[0].url
    : 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80';

  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-[#131b2e] shadow-2xl transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)] h-full border border-white/5`}>
      {/* Ambient hover glow */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

      {/* Image Section */}
      <Link to={`/properties/${property?.id}`} className={`relative block overflow-hidden m-4 rounded-3xl ${isHero ? 'h-[500px]' : 'h-72'}`}>
        <img
          src={mainImage}
          alt={property?.title || 'Property'}
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#131b2e]/60 to-transparent"></div>
        
        <div className="absolute top-4 left-4">
          <span className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl backdrop-blur-md border ${property?.is_available
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400/30'
            : 'bg-red-500/20 text-red-400 border-red-400/30'
            }`}>
            {isHero ? 'Featured Estate' : property?.is_available ? 'Available' : 'Rented'}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div className="flex shrink-0 items-baseline gap-1 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                <span className="text-sm font-bold text-white">৳</span>
                <span className={`${isHero ? 'text-4xl' : 'text-xl'} font-black text-white transition-all`}>{property?.rent_amount?.toLocaleString() || '0'}</span>
                <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">/mo</span>
            </div>
        </div>
      </Link>

      {/* Content Section */}
      <div className={`flex flex-1 flex-col px-8 pb-8 pt-4 relative z-10 ${isHero ? 'justify-center' : ''}`}>
        <div className="mb-6 flex flex-col gap-2">
            <h3 className={`${isHero ? 'text-4xl' : 'text-2xl'} font-black text-white transition-colors group-hover:text-primary tracking-tight`}>
              {property?.title || 'Untitled Property'}
            </h3>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm text-primary" data-icon="location_on">location_on</span>
              <span>{property?.area || 'N/A'}, {property?.city || 'Unknown'}</span>
            </div>
        </div>

        {/* Specs - Grid Layout */}
        <div className={`grid ${isHero ? 'grid-cols-4' : 'grid-cols-2'} gap-4 mb-8 transition-all`}>
          <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-primary/10 transition-colors">
            <span className="text-xl">🛏️</span>
            <div>
              <p className="text-sm font-black text-white leading-none">{property?.bedrooms || 0}</p>
              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mt-1">Beds</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-accent/10 transition-colors">
            <span className="text-xl">🚿</span>
            <div>
              <p className="text-sm font-black text-white leading-none">{property?.bathrooms || 0}</p>
              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mt-1">Baths</p>
            </div>
          </div>
          {isHero && (
            <>
              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-primary/10 transition-colors">
                <span className="text-xl">📐</span>
                <div>
                  <p className="text-sm font-black text-white leading-none">2,400</p>
                  <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mt-1">Sqft</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-accent/10 transition-colors">
                <span className="text-xl">🛡️</span>
                <div>
                  <p className="text-sm font-black text-white leading-none">Secured</p>
                  <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mt-1">Verified</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-auto flex items-center gap-3">
          <Link
            to={`/properties/${property?.id}`}
            className="flex-1 flex items-center justify-center gap-3 rounded-2xl bg-white text-[#0b1326] px-6 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all hover:bg-primary hover:text-white hover:scale-105"
          >
            {isHero ? 'Explore Residency' : 'Explore'}
          </Link>

          {isTenant && property?.is_available && (
            <button
              onClick={handleQuickRequest}
              disabled={requestStatus === 'loading' || requestStatus === 'success'}
              className={`flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-white/5 bg-white/5 text-xl transition-all hover:scale-110 active:scale-95 ${requestStatus === 'success' ? 'bg-emerald-500 text-white border-emerald-500' : 'hover:bg-primary hover:text-white'
                }`}
              title="Quick Lease Request"
            >
              {requestStatus === 'loading' ? '...' : requestStatus === 'success' ? '✓' : '⚡'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
