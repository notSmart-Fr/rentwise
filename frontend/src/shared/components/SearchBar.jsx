import { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ value, onChange, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <div className="search-bar-container animate-slide-up">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <div className="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="search-input"
            placeholder="Search by city, area, or keywords..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {value && (
            <button 
              type="button" 
              className="search-clear-btn"
              onClick={() => onChange('')}
              title="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button type="submit" className="search-submit-btn">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
