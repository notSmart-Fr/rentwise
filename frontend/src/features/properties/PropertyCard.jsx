import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { requestsApi } from '../../shared/services/api';
import './PropertyCard.css';

const PropertyCard = ({ property, onEdit }) => {
  const { isTenant, isAuthenticated } = useAuth();
  const [requestStatus, setRequestStatus] = useState('idle');

  const handleQuickRequest = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setRequestStatus('loading');
    try {
      await requestsApi.create(property?.id, `I am interested in leasing ${property?.title}.`);
      setRequestStatus('success');
    } catch (error) {
      console.error('Request failed:', error);
      setRequestStatus('error');
    }
  };

  const mainImage = property?.images && property.images.length > 0 
    ? property.images[0].url 
    : 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="property-card glass-panel animate-fade-in hover-card-lift">
      <Link to={`/properties/${property?.id}`} className="card-image-wrapper">
        <img src={mainImage} alt={property?.title || 'Property'} className="card-image" loading="lazy" />
      </Link>

      <div className="card-content">
        <div className="card-header-main">
          <div className="card-header-top flex-between m-bottom-1">
            <span className={`badge ${property?.is_available ? 'badge-success' : 'badge-danger'}`}>
              {property?.is_available ? 'Available' : 'Rented'}
            </span>
            <div className="card-price-inline">
              <span className="currency">৳</span>
              <span className="amount">{property?.rent_amount?.toLocaleString() || '0'}</span>
              <span className="period">/mo</span>
            </div>
          </div>
          <h3 className="card-title text-truncate">{property?.title || 'Untitled Property'}</h3>
          <p className="card-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {property?.area || 'N/A'}, {property?.city || 'Unknown'}
          </p>
        </div>

        <div className="card-features">
          <div className="feature-item">
            <span className="icon">🛏️</span>
            <span className="label font-bold">{property?.bedrooms || 0}</span>
            <span className="text-xs text-muted">Beds</span>
          </div>
          <div className="feature-item">
            <span className="icon">🚿</span>
            <span className="label font-bold">{property?.bathrooms || 0}</span>
            <span className="text-xs text-muted">Baths</span>
          </div>
        </div>

        <div className="card-footer">
          <Link to={`/properties/${property?.id}`} className="btn-details">
            View Details
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          
          {isTenant && property?.is_available && (
            <button 
              className={`btn-quick-action ${requestStatus === 'success' ? 'success' : ''}`}
              onClick={handleQuickRequest}
              disabled={requestStatus === 'loading' || requestStatus === 'success'}
              title="Quick Lease Request"
            >
              {requestStatus === 'loading' ? '...' : requestStatus === 'success' ? '✓' : '⚡'}
            </button>
          )}

          {!isTenant && isAuthenticated && (
            <button className="btn-edit-action" onClick={() => onEdit?.(property)}>
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
