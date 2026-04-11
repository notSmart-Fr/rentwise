import React, { useState, useEffect } from 'react';
import ticketService from './ticketService';
import ChatBox from '../messaging/ChatBox';
import { propertiesApi } from '../../shared/services/api';
import './MyTickets.css';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);

  // New ticket form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    property_id: '',
    title: '',
    priority: 'LOW',
    initial_message: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const ticketsData = await ticketService.getTenantTickets();
      setTickets(ticketsData);

      // Fetch available properties for the dropdown
      const propsRes = await propertiesApi.getAll();
      setProperties(propsRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTicket = await ticketService.createTicket(
        formData.property_id,
        formData.title,
        formData.priority,
        formData.initial_message
      );
      setTickets([newTicket, ...tickets]);
      setShowForm(false);
      setFormData({ property_id: '', title: '', priority: 'LOW', initial_message: '' });
      setActiveTicket(newTicket);
    } catch (err) {
      alert('Failed to create ticket: ' + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) {
    return (
      <div className="container flex-center m-top-10">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container maintenance-page animate-fade-in">
      <header className="tickets-header">
        <h2>Maintenance Hub</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel Request' : 'New Request'}
        </button>
      </header>

      {showForm && (
        <div className="glass-panel new-ticket-form animate-zoom-in">
          <h3>Submit a Maintenance Request</h3>
          <form onSubmit={handleCreateSubmit}>
            <div className="grid-cols-2 gap-lg m-bottom-4">
              <div className="form-group">
                <label>Select Property</label>
                <select
                  required
                  className="input-field"
                  value={formData.property_id}
                  onChange={e => setFormData({ ...formData, property_id: e.target.value })}
                >
                  <option value="">-- Choose Property --</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Priority Level</label>
                <select
                  className="input-field"
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="LOW">Low - Routine</option>
                  <option value="MEDIUM">Medium - Normal</option>
                  <option value="HIGH">High - Urgent</option>
                  <option value="EMERGENCY">Emergency - Immediate</option>
                </select>
              </div>
            </div>

            <div className="form-group m-bottom-4">
              <label>Issue Title</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g. Leaking faucet in main bathroom"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="form-group m-bottom-5">
              <label>Detailed Description</label>
              <textarea
                required
                className="input-field"
                rows="4"
                placeholder="Describe the issue in detail so we can help you faster..."
                value={formData.initial_message}
                onChange={e => setFormData({ ...formData, initial_message: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary btn-lg block-btn">Submit Maintenance Request</button>
          </form>
        </div>
      )}

      {tickets.length === 0 && !showForm ? (
        <div className="empty-state-card glass-panel">
          <div className="text-5xl m-bottom-3">🛠️</div>
          <h3>No Active Tickets</h3>
          <p className="text-muted">You haven't reported any maintenance issues yet.</p>
        </div>
      ) : (
        <div className="tickets-layout">
          <div className="glass-panel list-pane">
            <h3 className="pane-title">Ongoing Requests</h3>
            <div className="tickets-list-scroll">
              {tickets.map(t => (
                <div
                  key={t.id}
                  className={`ticket-item ${activeTicket?.id === t.id ? 'active' : ''}`}
                  onClick={() => setActiveTicket(t)}
                >
                  <div className="ticket-item-header">
                    <h4>{t.title}</h4>
                    <span className={`badge badge-${t.status.toLowerCase()}`}>{t.status.replace('_', ' ')}</span>
                  </div>
                  <div className="ticket-item-meta">
                    <span className={`priority-text priority-${t.priority.toLowerCase()}`}>
                      ● {t.priority}
                    </span>
                    <span className="date-text">{new Date(t.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel ticket-chat-pane">
            {activeTicket ? (
              <>
                <div className="chat-pane-header">
                  <h3>{activeTicket.title}</h3>
                  <p>Issue at Property • {activeTicket.priority} Priority</p>
                </div>
                <ChatBox contextType="TICKET" contextId={activeTicket.id} />
              </>
            ) : (
              <div className="empty-chat-state">
                <div className="m-bottom-3 text-4xl">💬</div>
                <p>Select a maintenance ticket from the list to view updates and chat with the owner.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTickets;
