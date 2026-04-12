import { useState, useMemo } from 'react';
import { useOwnerProperties } from '../../properties';
import { useOwnerRequests } from '../../requests';
import { useOwnerPayments } from '../../payments';
import { useConversations } from '../../messaging';
import { useChat } from '../../messaging';

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

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Derivations
  const totalRevenue = useMemo(() => {
    return (payments || [])
      .filter(p => p?.status === 'PAID')
      .reduce((sum, p) => sum + (Number(p?.amount) || 0), 0);
  }, [payments]);

  const activeLeasesCount = useMemo(() => {
    return requests.filter(r => r.status === 'APPROVED').length;
  }, [requests]);

  const pendingRequestsCount = useMemo(() => {
    return requests.filter(r => r.status === 'PENDING').length;
  }, [requests]);

  const isLoading = propsLoading || reqsLoading || paymentsLoading || convsLoading;

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
    conversations,
    totalUnread,
    totalRevenue,
    activeLeasesCount,
    pendingRequestsCount,
    
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
    refreshConvs
  };
};
