import { useConversations } from '../../features/messaging';

export const useNotifications = () => {
  const { conversations, totalUnread, markAsRead } = useConversations();

  // Transform conversations into a unified notification format
  // This is the "Adapter" part that makes the system scalable.
  const notifications = conversations
    .filter(c => c.unread_count > 0)
    .map(c => ({
      id: `msg-${c.id}`,
      type: 'MESSAGE',
      title: c.other_participant_name || 'New Message',
      subtitle: c.last_message || 'Inquiry about property',
      timestamp: c.updated_at,
      unread: true,
      data: {
        conversationId: c.id,
        contextType: c.context_type,
        contextId: c.context_id
      }
    }))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return {
    notifications,
    totalUnread,
    markAsRead
  };
};

export default useNotifications;
