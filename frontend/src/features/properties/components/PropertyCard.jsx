import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth';
import { usePropertyActions } from '../hooks/usePropertyActions';

const PropertyCard = ({ property, onEdit }) => {
  const { isTenant, isAuthenticated } = useAuth();
  const { requestStatus, handleQuickRequest } = usePropertyActions(property);

  const mainImage = property?.images && property.images.length > 0
    ? property.images[0].url
    : 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/2 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(124,58,237,0.1)] h-full">
      {/* Image Section */}
      <Link to={`/properties/${property?.id}`} className="relative block h-56 overflow-hidden">
        <img
          src={mainImage}
          alt={property?.title || 'Property'}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-lg backdrop-blur-md ${property?.is_available
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
            {property?.is_available ? 'Available' : 'Rented'}
          </span>
        </div>
      </Link>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="line-clamp-1 text-xl font-black text-white transition-colors group-hover:text-primary-hover tracking-tight">
              {property?.title || 'Untitled Property'}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">
              <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{property?.area || 'N/A'}, {property?.city || 'Unknown'}</span>
            </div>
          </div>
          <div className="ml-4 flex shrink-0 items-baseline gap-1 font-display bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">
            <span className="text-sm font-bold text-primary">৳</span>
            <span className="text-2xl font-black text-white">{property?.rent_amount?.toLocaleString() || '0'}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">/mo</span>
          </div>
        </div>

        {/* Specs */}
        <div className="mb-6 flex gap-6 border-y border-white/5 py-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🛏️</span>
            <div>
              <p className="text-sm font-bold text-white">{property?.bedrooms || 0}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Beds</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🚿</span>
            <div>
              <p className="text-sm font-bold text-white">{property?.bathrooms || 0}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Baths</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto flex items-center justify-between gap-4">
          <Link
            to={`/properties/${property?.id}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-3 text-sm font-bold text-primary-hover transition-all hover:bg-primary hover:text-white"
          >
            View Details
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          {isTenant && property?.is_available && (
            <button
              onClick={handleQuickRequest}
              disabled={requestStatus === 'loading' || requestStatus === 'success'}
              className={`flex h-11 w-11 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-lg transition-all hover:scale-110 active:scale-95 ${requestStatus === 'success' ? 'bg-emerald-500 text-white border-emerald-500' : 'hover:bg-emerald-500 hover:text-white'
                }`}
              title="Quick Lease Request"
            >
              {requestStatus === 'loading' ? '...' : requestStatus === 'success' ? '✓' : '⚡'}
            </button>
          )}

          {!isTenant && isAuthenticated && (
            <button
              onClick={() => onEdit?.(property)}
              className="text-sm font-medium text-slate-500 underline transition-colors hover:text-white"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
