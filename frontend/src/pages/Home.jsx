import { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import './Home.css';
import { propertiesApi } from '../services/api';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch properties from the backend
    const fetchProperties = async () => {
      try {
        const data = await propertiesApi.getAll();
        // Fallback to dummy data if backend is empty for UI demonstration
        if (data.length === 0) {
           setProperties([
             null, null, null, null, null, null // Render 6 dummy cards
           ]);
        } else {
           setProperties(data);
        }
      } catch (error) {
        console.error('Failed to fetch properties', error);
        // Fallback to dummy
        setProperties([null, null, null, null, null, null]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-glow"></div>
        <div className="container hero-content">
          <h1 className="hero-title">
            Find Your Next <br />
            <span className="text-gradient">Perfect Home</span>
          </h1>
          <p className="hero-subtitle">
            RentWise makes it effortless for tenants to find beautiful rentals and for owners to manage them with zero stress.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary hero-btn">Explore Properties</button>
            <button className="btn btn-secondary hero-btn">List Your Property</button>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="properties-section container">
        <div className="section-header flex-between">
          <h2 className="section-title">Latest Listings</h2>
          <div className="filter-group">
            <select className="input-field select-filter">
              <option>All Cities</option>
              <option>Dhaka</option>
              <option>Chittagong</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner animate-pulse"></div>
            <p>Finding the best properties...</p>
          </div>
        ) : (
          <div className="properties-grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
            {properties.map((prop, index) => (
              <PropertyCard key={prop?.id || index} property={prop} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
