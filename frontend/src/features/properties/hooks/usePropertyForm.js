import { useState } from 'react';
import propertiesService from '../services/propertiesService';

export const usePropertyForm = (initialData = null, onSuccess) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    city: initialData?.city || 'Dhaka',
    area: initialData?.area || '',
    rent_amount: initialData?.rent_amount || '',
    bedrooms: initialData?.bedrooms || '',
    bathrooms: initialData?.bathrooms || '',
    address_text: initialData?.address_text || '',
    description: initialData?.description || '',
    image_urls: initialData?.images?.map(img => img.url).join('\n') || ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);

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
      if (initialData?.id) {
        await propertiesService.update(initialData.id, payload);
      } else {
        await propertiesService.create(payload);
      }
      
      if (onSuccess) onSuccess();
      return { success: true };
    } catch (err) {
      console.error('Property form submission failed:', err);
      setError(err.message || 'Failed to save property. Please check your data.');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    error,
    handleChange,
    handleSubmit
  };
};

export default usePropertyForm;
