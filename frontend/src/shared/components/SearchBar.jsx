import { useState } from 'react';

const SearchBar = ({ value, onChange, onSearch, className = "" }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <div className={`w-full relative z-10 animate-in fade-in slide-in-from-bottom-5 duration-700 ${className}`}>
      <form
        className="flex bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl transition-all duration-300 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 focus-within:-translate-y-1"
        onSubmit={handleSubmit}
      >
        <div className="flex-1 flex items-center px-4">
          <div className="text-text-muted mr-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="bg-transparent border-none text-text-primary text-lg w-full py-3 outline-none placeholder:text-text-muted/50"
            placeholder="Search by city, area, or keywords..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {value && (
            <button
              type="button"
              className="text-text-muted hover:text-text-primary p-2 rounded-full hover:bg-white/10 transition-all active:scale-90"
              onClick={() => onChange('')}
              title="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button
          type="submit"
          className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-95"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
