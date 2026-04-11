import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../shared/services/api';
import './AddPropertyModal.css'; // reuse same styles

const EditPropertyModal = ({ isOpen, onClose, onSuccess, property }) => {
  const [formData, setFormData] = useState({
    title: '',
    city: '',
    area: '',
    rent_amount: '',
    bedrooms: '',
    bathrooms: '',
    address_text: '',
    description: '',
    is_available: true,
    image_urls: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        city: property.city || '',
        area: property.area || '',
        rent_amount: property.rent_amount || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        address_text: property.address_text || '',
        description: property.description || '',
        is_available: property.is_available ?? true,
        image_urls: property.images ? property.images.map(img => img.url).join('\n') : ''
      });
    }
  }, [property]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Prepare payload
    const payload = {
      ...formData,
      rent_amount: parseInt(formData.rent_amount) || 0,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
      image_urls: formData.image_urls
        ? formData.image_urls.split('\n').map(url => url.trim()).filter(url => url !== '')
        : []
    };

    try {
      await apiRequest('PATCH', `/owner/properties/${property.id}`, payload);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to update property:', err);
      setError('Failed to update property. Please check your data.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !property) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel animate-zoom-in">
        <div className="modal-header">
          <h2>Edit Property</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message m-bottom-3">{error}</div>}

          <div className="form-grid">
            <div className="form-group span-full">
              <label>Property Title</label>
              <input
                type="text"
                name="title"
                className="input-field"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                className="input-field"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Area</label>
              <input
                type="text"
                name="area"
                className="input-field"
                value={formData.area}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Monthly Rent (৳)</label>
              <input
                type="number"
                name="rent_amount"
                className="input-field"
                value={formData.rent_amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                className="input-field"
                value={formData.bedrooms}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="is_available"
                  checked={formData.is_available}
                  onChange={handleChange}
                />
                Mark as Available
              </label>
            </div>

            <div className="form-group span-full">
              <label>Address Details</label>
              <input
                type="text"
                name="address_text"
                className="input-field"
                value={formData.address_text}
                onChange={handleChange}
              />
            </div>

            <div className="form-group span-full">
              <label>Description</label>
              <textarea
                name="description"
                className="input-field textarea"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              ></textarea>
            </div>

            <div className="form-group span-full">
              <label>Image URLs (One per line)</label>
              <textarea
                name="image_urls"
                className="input-field textarea"
                value={formData.image_urls}
                onChange={handleChange}
                rows="3"
              ></textarea>
            </div>
          </div>

          <div className="modal-footer m-top-4">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPropertyModal;
