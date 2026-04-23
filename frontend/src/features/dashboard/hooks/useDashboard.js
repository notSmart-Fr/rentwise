import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useOwnerProperties } from '../../properties';
import { useOwnerRequests } from '../../requests';
import { useOwnerPayments } from '../../payments';
import { useConversations } from '../../messaging';
import { useChat } from '../../messaging';
import { useLeases } from '../../leases';
import { paymentsService } from '../../payments';

export const useDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, properties, requests, inbox
  const { openChat } = useChat();

  // Feature hooks
  const {
    properties,
    loading: propsLoading,
    refresh: refreshProps
  } = useOwnerProperties();

  const {
    requests,
    loading: reqsLoading,
    refresh: refreshReqs
  } = useOwnerRequests();

  const {
    payments,
    loading: paymentsLoading,
    refresh: refreshPayments
  } = useOwnerPayments();

  const {
    conversations,
    loading: convsLoading,
    totalUnread,
    markAsRead,
    refresh: refreshConvs
  } = useConversations();
  
  const {
    leases,
    loading: leasesLoading,
    refresh: refreshLeases
  } = useLeases(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [analytics, setAnalytics] = useState({ revenue: [], occupancy: [], summary: {} });
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const data = await paymentsService.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('addProperty') === 'true') {
      setActiveTab('properties');
      setIsModalOpen(true);
      
      // Clean up the URL so it doesn't reopen on refresh
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location]);

  // Derivations
  const totalRevenue = useMemo(() => {
    return (payments || [])
      .filter(p => p?.status === 'PAID')
      .reduce((sum, p) => sum + (Number(p?.amount) || 0), 0);
  }, [payments]);

  const activeLeasesCount = useMemo(() => {
    return leases.filter(l => l.status === 'ACTIVE').length;
  }, [leases]);

  const pendingRequestsCount = useMemo(() => {
    return requests.filter(r => r.status === 'PENDING').length;
  }, [requests]);

  const isLoading = propsLoading || reqsLoading || paymentsLoading || convsLoading || analyticsLoading || leasesLoading;

  // Handlers
  const handleOpenConversation = async (conv) => {
    openChat(
      conv.context_type,
      conv.context_id,
      conv.context_title,
      null,
      conv.other_participant_id
    );

    if (conv.unread_count > 0) {
      await markAsRead(conv.id);
    }
  };

  const handlePropertyAdded = () => {
    setIsModalOpen(false);
    refreshProps();
  };

  const handlePropertyUpdated = () => {
    setIsEditModalOpen(false);
    refreshProps();
  };

  const handleEditProperty = (property) => {
    setSelectedProperty(property);
    setIsEditModalOpen(true);
  };

  const handleManagePayment = (request) => {
    setSelectedRequest(request);
    setIsPaymentModalOpen(true);
  };

  return {
    // State
    activeTab,
    setActiveTab,
    isLoading,
    
    // Data
    properties,
    requests,
    payments,
    leases,
    conversations,
    totalUnread,
    totalRevenue,
    activeLeasesCount,
    pendingRequestsCount,
    analytics,
    
    // Modals
    isModalOpen,
    setIsModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    selectedProperty,
    selectedRequest,
    
    // Handlers
    handleOpenConversation,
    handlePropertyAdded,
    handlePropertyUpdated,
    handleEditProperty,
    handleManagePayment,
    refreshPayments,
    refreshProps,
    refreshReqs,
    refreshConvs,
    refreshLeases
  };
};
