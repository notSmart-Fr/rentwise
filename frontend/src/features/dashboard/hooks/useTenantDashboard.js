import { useState, useMemo, useEffect } from 'react';
import { useTenantRequests } from '../../requests/hooks/useTenantRequests';
import { useTickets } from '../../tickets/hooks/useTickets';
import { useLeases } from '../../leases/hooks/useLeases';
import { useConversations } from '../../messaging/hooks/useConversations';
import { useChat } from '../../messaging';

export const useTenantDashboard = (initialTab = 'overview') => {
  const [activeTab, setActiveTab] = useState(initialTab); // overview, leases, maintenance, inbox
  const { openChat } = useChat();

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const {
    allRequests: requests,
    loading: reqsLoading,
    refresh: refreshReqs
  } = useTenantRequests();

  const {
    tickets,
    loading: ticketsLoading,
    refresh: refreshTickets
  } = useTickets(false);

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
  } = useLeases();

  const isLoading = reqsLoading || ticketsLoading || convsLoading || leasesLoading;

  // Derivations
  const activeLeases = useMemo(() => {
    return requests.filter(r => r.status === 'APPROVED');
  }, [requests]);

  const openTicketsCount = useMemo(() => {
    return tickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length;
  }, [tickets]);

  const pendingApplicationsCount = useMemo(() => {
    return requests.filter(r => r.status === 'PENDING').length;
  }, [requests]);

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

  const refreshAll = () => {
    refreshReqs();
    refreshTickets();
    refreshConvs();
    refreshLeases();
  };

  return {
    activeTab,
    setActiveTab,
    isLoading,
    requests,
    activeLeases,
    tickets,
    openTicketsCount,
    pendingApplicationsCount,
    conversations,
    totalUnread,
    handleOpenConversation,
    refreshAll,
    refreshReqs,
    refreshTickets,
    refreshConvs,
    refreshLeases,
    leases
  };
};

export default useTenantDashboard;
