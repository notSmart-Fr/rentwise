import { Link } from 'react-router-dom';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  // If no property is passed, use placeholder data for UI demonstration
  const data = property || {
    id: 'placeholder',
    title: 'Modern Apartment in Gulshan',
    area: 'Gulshan 1',
    city: 'Dhaka',
    rent_amount: 35000,
    bedrooms: 3,
    bathrooms: 2,
    is_available: true,
  };

  return (
    <div className="property-card glass-panel hover-card-lift">
      <div className="card-image-wrapper">
        <div className="card-image-placeholder animate-pulse-slow">
           <svg viewBox="0 0 24 24" fill="none" width="48" height="48" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
             <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
             <polyline points="9 22 9 12 15 12 15 22"></polyline>
           </svg>
        </div>
        <div className="card-badges">
          {data.is_available ? (
            <span className="badge badge-success">Available</span>
          ) : (
            <span className="badge badge-danger">Rented</span>
          )}
        </div>
        <div className="card-price">
          ৳ {data.rent_amount.toLocaleString()} <span className="text-sm fw-normal">/ mo</span>
        </div>
      </div>

      <div className="card-content">
        <h3 className="card-title">{data.title}</h3>
        <p className="card-location">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {data.area}, {data.city}
        </p>

        <div className="card-features">
          {data.bedrooms && (
            <div className="feature-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M3 22v-8h18v8M3 14V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8M10 4v10M14 4v10"></path>
              </svg>
              {data.bedrooms} Beds
            </div>
          )}
          {data.bathrooms && (
            <div className="feature-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M9 22v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4M4 22V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16"></path>
                <circle cx="12" cy="14" r="2"></circle>
              </svg>
              {data.bathrooms} Baths
            </div>
          )}
        </div>

      </div>
      
      <div className="card-footer bg-glass">
         <Link to={`/properties/${data.id}`} className="btn btn-primary w-full">
            View Details
         </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
