import { useState, useEffect, useCallback } from 'react';
import propertiesService from '../services/propertiesService';

export const useProperties = (initialParams = {}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState(initialParams);
  const [searchQuery, setSearchQuery] = useState(initialParams.search || '');

  const fetchProperties = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await propertiesService.getAll(params);
      setProperties(data);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
      setError(err.message || 'Failed to load properties');
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

  return {
    properties,
    loading,
    error,
    searchParams,
    searchQuery,
    setSearchQuery,
    handleSearch,
    handleFilterChange,
    clearAllSearch,
    refresh: () => fetchProperties(searchParams)
  };
};

export default useProperties;
