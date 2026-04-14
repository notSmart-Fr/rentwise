import { useState, useEffect, useCallback } from 'react';
import notificationService from '../services/notificationService';
import { useWebSocket } from '../context/WebSocketContext';
import { useAuth } from '../../features/auth';

export const useNotifications = () => {
  const { isAuthenticated } = useAuth();
  const { subscribe } = useWebSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const [notifs, count] = await Promise.all([
        notificationService.getNotifications(10),
        notificationService.getUnreadCount()
      ]);
      setNotifications(notifs || []);
      setUnreadCount(count || 0);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchData();

    // Real-time integration via WebSocket
    const unsubscribe = subscribe('NEW_NOTIFICATION', (newNotif) => {
      setNotifications(prev => [newNotif, ...prev.slice(0, 9)]);
      setUnreadCount(prev => prev + 1);
      
      // Browser notification (optional UX polish)
      if (Notification.permission === 'granted') {
        new Notification(newNotif.title, { body: newNotif.message });
      }
    });

    return () => unsubscribe();
  }, [fetchData, isAuthenticated, subscribe]);

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark notifications read:', err);
    }
  };

  const markOneRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAllRead,
    markOneRead,
    refresh: fetchData
  };
};

export default useNotifications;
