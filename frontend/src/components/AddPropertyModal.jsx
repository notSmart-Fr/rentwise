import React, { useState } from 'react';
import { propertiesApi } from '../services/api';
import './AddPropertyModal.css';

const AddPropertyModal = ({ isOpen, onClose, onPropertyAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    area: '',
    address_text: '',
    rent_amount: '',
    bedrooms: '',
    bathrooms: '',
    image_urls: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prepare data for API (convert necessary strings to numbers and split URLs)
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
      const newProperty = await propertiesApi.create(payload);
      onPropertyAdded(newProperty);
      onClose();
      setFormData({
        title: '',
        description: '',
        city: '',
        area: '',
        address_text: '',
        rent_amount: '',
        bedrooms: '',
        bathrooms: '',
        image_urls: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-slide-up">
        <div className="modal-header">
          <h2>List a New Property</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
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
                placeholder="e.g. Modern Apartment in Gulshan"
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

            <div className="form-group span-full">
              <label>Address Details</label>
              <input 
                type="text" 
                name="address_text" 
                className="input-field" 
                value={formData.address_text} 
                onChange={handleChange} 
                placeholder="Specific location/street name"
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
                placeholder="Tell tenants about your beautiful home..."
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
                placeholder="Paste image links here..."
              ></textarea>
              <p className="text-xs text-muted m-top-1">Airbnb-tip: Use high-quality landscape photos!</p>
            </div>
          </div>

          <div className="modal-footer m-top-4">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'List Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyModal;
