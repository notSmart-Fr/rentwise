import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { propertiesApi, requestsApi } from '../services/api';
import './PropertyDetails.css';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isTenant, user } = useAuth();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestStatus, setRequestStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await propertiesApi.getById(id);
        setProperty(data);
      } catch (err) {
        console.error('Failed to fetch property:', err);
        setError('Property not found or server error.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
    window.scrollTo(0, 0);
  }, [id]);

  const handleRequestLease = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setRequestStatus('loading');
    try {
      await requestsApi.create(id, message || `I am interested in leasing ${property.title}.`);
      setRequestStatus('success');
    } catch (err) {
      console.error('Request failed:', err);
      setRequestStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="container p-top-5 flex-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container p-top-5 text-center">
        <h2 className="text-danger">{error || 'Property not found'}</h2>
        <Link to="/" className="btn btn-primary m-top-4">Back to Search</Link>
      </div>
    );
  }

  const images = property.images && property.images.length > 0 
    ? property.images 
    : [{ url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80' }];

  return (
    <div className="property-details-page container animate-fade-in">
      <nav className="breadcrumb">
        <Link to="/">Explore</Link> <span>/</span> <span>{property.city}</span> <span>/</span> <span className="active">{property.title}</span>
      </nav>

      <div className="details-grid">
        {/* Left Column: Media & Description */}
        <div className="details-main">
          <div className="details-gallery">
            <div className="main-image-container glass-panel">
              <img src={images[activeImage].url} alt={property.title} className="main-image animate-fade-in" key={activeImage} />
            </div>
            
            {images.length > 1 && (
              <div className="thumbnail-grid m-top-2">
                {images.map((img, index) => (
                  <div 
                    key={img.id || index} 
                    className={`thumbnail-item ${activeImage === index ? 'active' : ''}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img src={img.url} alt={`View ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <section className="details-section">
            <h1 className="details-title">{property.title}</h1>
            <p className="details-location">
              {property.area}, {property.city}
            </p>
            
            <div className="details-meta">
              <div className="meta-item">
                <span className="meta-label">Bedrooms</span>
                <span className="meta-value">{property.bedrooms || 'N/A'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Bathrooms</span>
                <span className="meta-value">{property.bathrooms || 'N/A'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Status</span>
                <span className={`badge ${property.is_available ? 'badge-success' : 'badge-danger'}`}>
                  {property.is_available ? 'Available' : 'Rented'}
                </span>
              </div>
            </div>

            <div className="details-description">
              <h3>About this home</h3>
              <p>{property.description || "No description provided by the owner."}</p>
            </div>

            <div className="details-amenities">
              <h3>Amenities</h3>
              <div className="amenities-list">
                 <div className="amenity-item">✨ Modern Finish</div>
                 <div className="amenity-item">🚗 Parking Space</div>
                 <div className="amenity-item">🛡️ 24/7 Security</div>
                 <div className="amenity-item">📶 High-Speed Internet</div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Pricing & Booking Card */}
        <div className="details-sidebar">
          <div className="booking-card glass-panel sticky-top">
            <div className="booking-price">
              <span className="amount">৳ {property.rent_amount.toLocaleString()}</span>
              <span className="period">/ month</span>
            </div>

            {isTenant || !isAuthenticated ? (
              <div className="booking-form-wrapper">
                {requestStatus === 'success' ? (
                  <div className="success-state animate-bounce-in">
                    <div className="success-icon">✅</div>
                    <h3>Request Sent!</h3>
                    <p>The owner has been notified. You can track this in your dashboard.</p>
                    <Link to="/my-requests" className="btn btn-outline-primary w-full">View My Requests</Link>
                  </div>
                ) : (
                  <form onSubmit={handleRequestLease}>
                    <div className="form-group">
                      <label>Message to Owner</label>
                      <textarea 
                        className="input-field" 
                        placeholder="Introduce yourself and ask any questions..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="4"
                      ></textarea>
                    </div>
                    
                    {requestStatus === 'error' && (
                      <p className="text-danger m-bottom-2">Failed to send request. Try again.</p>
                    )}

                    <button 
                      type="submit" 
                      className="btn btn-primary w-full btn-lg"
                      disabled={requestStatus === 'loading' || !property.is_available}
                    >
                      {requestStatus === 'loading' ? 'Processing...' : 'Request to Lease'}
                    </button>
                    
                    {!property.is_available && (
                      <p className="text-sm text-center m-top-2 text-muted">This property is currently occupied.</p>
                    )}
                  </form>
                )}
              </div>
            ) : isTenant === false && isAuthenticated ? (
               <div className="booking-info-box">
                  <p>You are logged in as an <strong>Owner</strong>.</p>
                  <p className="text-sm">Only Tenants can request leases. If this is your property, use the Owner Dashboard to manage it.</p>
                  <Link to="/owner-dashboard" className="btn btn-outline-primary w-full m-top-2">Go to Dashboard</Link>
               </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
