import React, { useState, useEffect, useCallback } from 'react';
import PropertyCard from '../properties/PropertyCard';
import { propertiesApi } from '../../shared/services/api';
import SearchBar from '../../shared/components/SearchBar';
import './Home.css';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProperties = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await propertiesApi.getAll(params);
      const isSearchOrFilter = Object.keys(params).length > 0;

      // Set properties directly from API
      setProperties(data);
    } catch (error) {
      console.error('Failed to fetch properties', error);
      // Reset properties on error
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties(searchParams);
  }, [fetchProperties, searchParams]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const newParams = { ...searchParams, search: query };
    if (!query) delete newParams.search;
    setSearchParams(newParams);
  };

  const handleFilterChange = (type, value) => {
    const newParams = { ...searchParams };
    if (value && value !== 'All Cities') {
      newParams[type] = value;
    } else {
      delete newParams[type];
    }
    setSearchParams(newParams);
  };

  const clearAllSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-glow"></div>
        <div className="container hero-content">
          <h1 className="hero-title animate-fade-in-down">
            Find Your Next <br />
            <span className="text-gradient">Perfect Home</span>
          </h1>
          <p className="hero-subtitle animate-fade-in-up">
            RentWise makes it effortless for tenants to find beautiful rentals and for owners to manage them with zero stress.
          </p>

          <div className="hero-search-wrapper">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
            />
          </div>

          <div className="hero-quick-actions flex-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <span className="text-muted">Popular: </span>
            <button className="btn btn-text px-2" onClick={() => handleSearch('Dhaka')}>Dhaka</button>
            <button className="btn btn-text px-2" onClick={() => handleSearch('flat')}>flat</button>
            <button className="btn btn-text px-2" onClick={() => handleSearch('Dhanmondi')}>Dhanmondi</button>

            {(searchQuery || Object.keys(searchParams).length > 0) && (
              <button className="btn-clear-all" onClick={clearAllSearch}>
                Clear All <span>&times;</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="properties-section container">
        <div className="section-header flex-between">
          <h2 className="section-title">
            {searchParams.search ? `Search Results for "${searchParams.search}"` : 'Latest Listings'}
          </h2>
          <div className="filter-group">
            <select
              className="input-field select-filter"
              onChange={(e) => handleFilterChange('city', e.target.value)}
              value={searchParams.city || 'All Cities'}
            >
              <option>All Cities</option>
              <option>Dhaka</option>
              <option>Chittagong</option>
              <option>Sylhet</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner animate-pulse"></div>
            <p>Finding the best properties...</p>
          </div>
        ) : (
          <>
            {properties.length > 0 ? (
              <div className="properties-grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
                {properties.map((prop, index) => (
                  <PropertyCard key={prop?.id || index} property={prop} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No properties found</h3>
                <p>Try adjusting your search or filters.</p>
                <button className="btn btn-secondary" onClick={clearAllSearch}>Clear All</button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
