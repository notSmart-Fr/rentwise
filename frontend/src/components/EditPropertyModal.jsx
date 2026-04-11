import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import './AddPropertyModal.css'; // reuse same styles

const EditPropertyModal = ({ isOpen, onClose, property, onPropertyUpdated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    area: '',
    address_text: '',
    rent_amount: '',
    bedrooms: '',
    bathrooms: '',
    image_urls: '',
    is_available: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Populate form when property prop changes
  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
        city: property.city || '',
        area: property.area || '',
        address_text: property.address_text || '',
        rent_amount: property.rent_amount || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        image_urls: property.images ? property.images.map(i => i.url).join('\n') : '',
        is_available: property.is_available ?? true
      });
    }
  }, [property]);

  if (!isOpen || !property) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      title: formData.title,
      description: formData.description || null,
      city: formData.city,
      area: formData.area,
      address_text: formData.address_text || null,
      rent_amount: parseInt(formData.rent_amount) || 0,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
      image_urls: formData.image_urls
        ? formData.image_urls.split('\n').map(url => url.trim()).filter(url => url !== '')
        : [],
      is_available: formData.is_available
    };

    try {
      const updated = await apiRequest(`/owner/properties/${property.id}`, {
        method: 'PATCH',
        body: payload
      });
      onPropertyUpdated(updated);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-slide-up">
        <div className="modal-header">
          <h2>Edit Property</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message m-bottom-3">{error}</div>}

          <div className="form-grid">
            <div className="form-group span-full">
              <label>Property Title</label>
              <input type="text" name="title" className="input-field" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" className="input-field" value={formData.city} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Area</label>
              <input type="text" name="area" className="input-field" value={formData.area} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Monthly Rent (৳)</label>
              <input type="number" name="rent_amount" className="input-field" value={formData.rent_amount} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Bedrooms</label>
              <input type="number" name="bedrooms" className="input-field" value={formData.bedrooms} onChange={handleChange} />
            </div>

            <div className="form-group span-full">
              <label>Address Details</label>
              <input type="text" name="address_text" className="input-field" value={formData.address_text} onChange={handleChange} placeholder="Specific location/street name" />
            </div>

            <div className="form-group span-full">
              <label>Description</label>
              <textarea name="description" className="input-field textarea" value={formData.description} onChange={handleChange} rows="3" />
            </div>

            <div className="form-group span-full">
              <label>Image URLs (One per line)</label>
              <textarea name="image_urls" className="input-field textarea" value={formData.image_urls} onChange={handleChange} rows="3" placeholder="Paste image links here..." />
            </div>

            <div className="form-group span-full" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input type="checkbox" name="is_available" id="is_available" checked={formData.is_available} onChange={handleChange} style={{ width: 'auto' }} />
              <label htmlFor="is_available" style={{ marginBottom: 0, cursor: 'pointer' }}>Property is available for rent</label>
            </div>
          </div>

          <div className="modal-footer m-top-4">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPropertyModal;
