import { useState, useEffect, useCallback } from 'react';
import ticketService from '../services/ticketService';
import { propertiesApi } from '../../../shared/services/api';

export const useTickets = (isOwner = false) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [properties, setProperties] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = isOwner 
        ? await ticketService.getOwnerTickets() 
        : await ticketService.getTenantTickets();
      setTickets(data);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
      setError('Could not load tickets.');
    } finally {
      setLoading(false);
    }
  }, [isOwner]);

  const fetchProperties = useCallback(async () => {
    if (isOwner) return; // Owners don't need a dropdown of all properties for tickets by default in current UX
    try {
      const data = await propertiesApi.getAll();
      setProperties(data);
    } catch (err) {
      console.error('Failed to fetch properties for tickets:', err);
    }
  }, [isOwner]);

  useEffect(() => {
    fetchTickets();
    fetchProperties();
  }, [fetchTickets, fetchProperties]);

  const createTicket = async (propertyId, title, priority, initialMessage) => {
    try {
      const newTicket = await ticketService.createTicket(propertyId, title, priority, initialMessage);
      setTickets(prev => [newTicket, ...prev]);
      setActiveTicket(newTicket);
      return newTicket;
    } catch (err) {
      const msg = err.response?.data?.detail || err.message;
      throw new Error(msg);
    }
  };

  const updateTicketStatus = async (ticketId, status) => {
    try {
      const updated = await ticketService.updateTicketStatus(ticketId, status);
      setTickets(prev => prev.map(t => t.id === ticketId ? updated : t));
      if (activeTicket?.id === ticketId) setActiveTicket(updated);
      return updated;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  return {
    tickets,
    loading,
    error,
    properties,
    activeTicket,
    setActiveTicket,
    createTicket,
    updateTicketStatus,
    refresh: fetchTickets
  };
};

export default useTickets;
