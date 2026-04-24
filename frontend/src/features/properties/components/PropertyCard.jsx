import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth';
import { usePropertyActions } from '../hooks/usePropertyActions';

const PropertyCard = ({ property, onEdit, isHero = false }) => {
  const { isTenant } = useAuth();
  const { requestStatus, handleQuickRequest } = usePropertyActions(property);

  const mainImage = property?.images && property.images.length > 0
    ? property.images[0].url
    : 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80';

  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-[3rem] bg-surface-container-high transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)] h-full`}>
      {/* Ambient Depth Layer (No explicit borders per RentWise Design Language strategy) */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-linear-to-br from-primary/10 via-transparent to-accent/5"></div>

      {/* Image Section - Intentional Asymmetry */}
      <Link to={`/properties/${property?.id}`} className={`relative block overflow-hidden m-2 rounded-[2.5rem] ${isHero ? 'h-[520px]' : 'h-80'}`}>
        <img
          src={mainImage}
          alt={property?.title || 'Property'}
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-surface-container-low/80 via-transparent to-transparent"></div>
        
        {/* RentWise Status Chip */}
        <div className="absolute top-6 left-6">
          <span className={`rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-xl border border-white/10 ${property?.is_available
            ? 'bg-secondary-container/30 text-secondary-rentwise'
            : 'bg-tertiary-container/30 text-tertiary-rentwise'
            }`}>
            {isHero ? 'Featured Estate' : property?.is_available ? 'Available' : 'Rented'}
          </span>
        </div>

        {/* Floating Price Tag */}
        <div className="absolute bottom-6 right-6">
            <div className="flex items-baseline gap-1 bg-surface-container-highest/60 backdrop-blur-2xl px-6 py-3 rounded-2xl border border-white/5">
                <span className="text-sm font-bold text-on-surface-variant">৳</span>
                <span className={`${isHero ? 'text-4xl' : 'text-2xl'} font-black text-white`}>{property?.rent_amount?.toLocaleString() || '0'}</span>
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest ml-1">/mo</span>
            </div>
        </div>
      </Link>

      {/* Content Section - Editorial Layout */}
      <div className={`flex flex-1 flex-col p-8 pt-6 relative z-10 ${isHero ? 'justify-center' : ''}`}>
        <div className="mb-8 space-y-2">
            <h3 className={`${isHero ? 'text-5xl' : 'text-2xl'} font-black text-white leading-tight tracking-tightest group-hover:text-primary-rentwise transition-colors`}>
              {property?.title || 'Untitled Property'}
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">
              <span className="material-symbols-outlined text-sm text-primary-rentwise" data-icon="location_on">location_on</span>
              <span>{property?.area || 'N/A'}, {property?.city || 'Unknown'}</span>
            </div>
        </div>

        {/* Specs - Defined by whitespace and tonal depth, not lines */}
        <div className={`grid ${isHero ? 'grid-cols-4' : 'grid-cols-2'} gap-3 mb-10`}>
          <div className="bg-surface-container-highest/40 p-5 rounded-3xl group-hover:bg-surface-container-highest/60 transition-colors">
            <p className="text-xl font-black text-white mb-1">{property?.bedrooms || 0}</p>
            <p className="text-[9px] uppercase tracking-[0.2em] text-on-surface-variant font-black">Bedrooms</p>
          </div>
          <div className="bg-surface-container-highest/40 p-5 rounded-3xl group-hover:bg-surface-container-highest/60 transition-colors">
            <p className="text-xl font-black text-white mb-1">{property?.bathrooms || 0}</p>
            <p className="text-[9px] uppercase tracking-[0.2em] text-on-surface-variant font-black">Bathrooms</p>
          </div>
          {isHero && (
            <>
              <div className="bg-surface-container-highest/40 p-5 rounded-3xl group-hover:bg-surface-container-highest/60 transition-colors">
                <p className="text-xl font-black text-white mb-1">2,450</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-on-surface-variant font-black">Sq. Ft</p>
              </div>
              <div className="bg-surface-container-highest/40 p-5 rounded-3xl group-hover:bg-surface-container-highest/60 transition-colors">
                <p className="text-xl font-black text-white mb-1">Verified</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-on-surface-variant font-black">Auth. Status</p>
              </div>
            </>
          )}
        </div>

        {/* Action Layer */}
        <div className="mt-auto flex items-center gap-4">
          <Link
            to={`/properties/${property?.id}`}
            className="flex-1 flex items-center justify-center gap-3 rounded-full bg-linear-to-r from-primary-rentwise to-primary-container text-[#0b1326] px-8 py-5 text-[11px] font-black uppercase tracking-[0.25em] transition-all hover:scale-[1.02] hover:shadow-glow-primary active:scale-95"
          >
            {isHero ? 'Explore Estate' : 'View Details'}
          </Link>

          {isTenant && property?.is_available && (
            <button
              onClick={handleQuickRequest}
              disabled={requestStatus === 'loading' || requestStatus === 'success'}
              className={`flex h-[60px] w-[60px] items-center justify-center rounded-full bg-surface-container-highest text-white transition-all hover:bg-white hover:text-surface-container-low active:scale-90 ${requestStatus === 'success' ? 'bg-secondary-rentwise text-surface-container-low' : ''
                }`}
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

