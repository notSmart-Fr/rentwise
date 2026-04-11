import React, { useState, useEffect } from 'react';
import ticketService from './ticketService';
import ChatBox from '../messaging/ChatBox';

const OwnerTicketsTab = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);

  const fetchTickets = async () => {
    try {
      const data = await ticketService.getOwnerTickets();
      setTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await ticketService.updateTicketStatus(ticketId, newStatus);
      fetchTickets();
      if (activeTicket && activeTicket.id === ticketId) {
        setActiveTicket({ ...activeTicket, status: newStatus });
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div>Loading tickets...</div>;

  if (tickets.length === 0) {
    return <div className="empty-state card">No active maintenance tickets from your tenants.</div>;
  }

  return (
    <div className="tickets-layout flex-col md-flex-row m-top-4">
      <div className="tickets-list card list-pane">
        <h3 className="pane-title">Maintenance Requests</h3>
        {tickets.map(t => (
          <div
            key={t.id}
            className={`ticket-item ${activeTicket?.id === t.id ? 'active' : ''}`}
            onClick={() => setActiveTicket(t)}
          >
            <div className="ticket-item-header">
              <h4>{t.title}</h4>
              <span className={`badge badge-${t.status.toLowerCase()}`}>{t.status}</span>
            </div>
            <div className="ticket-item-meta">
              <span className={`priority-text priority-${t.priority.toLowerCase()}`}>
                {t.priority}
              </span>
              <span className="date-text">{new Date(t.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="ticket-chat-pane card">
        {activeTicket ? (
          <>
            <div className="chat-pane-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>{activeTicket.title}</h3>
                <p>Status: {activeTicket.status}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {activeTicket.status !== 'IN_PROGRESS' && (
                  <button className="btn btn-secondary btn-small" onClick={() => handleStatusChange(activeTicket.id, 'IN_PROGRESS')}>Mark In Progress</button>
                )}
                {activeTicket.status !== 'RESOLVED' && (
                  <button className="btn btn-primary btn-small" onClick={() => handleStatusChange(activeTicket.id, 'RESOLVED')}>Resolve</button>
                )}
              </div>
            </div>
            <ChatBox contextType="TICKET" contextId={activeTicket.id} />
          </>
        ) : (
          <div className="empty-chat-state">
            <p>Select a ticket to view conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerTicketsTab;
