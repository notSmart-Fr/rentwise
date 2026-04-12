import { useState } from 'react';
import { requestsService } from '../../requests/services/requestsService';

export const usePropertyActions = (property) => {
  const [requestStatus, setRequestStatus] = useState('idle');

  const handleQuickRequest = async (e) => {
    if (e) e.preventDefault();
    if (!property?.id) return;

    setRequestStatus('loading');
    try {
      await requestsService.create(property.id, `I am interested in leasing ${property.title || 'this property'}.`);
      setRequestStatus('success');
      return { success: true };
    } catch (error) {
      console.error('Request failed:', error);
      setRequestStatus('error');
      return { success: false, error: error.message };
    }
  };

  const resetStatus = () => setRequestStatus('idle');

  return {
    requestStatus,
    handleQuickRequest,
    resetStatus
  };
};

export default usePropertyActions;
