import { useState, useEffect } from 'react';
import ticketService from '../services/ticketService';
import ChatBox from '../components/ChatBox';
import './MyTickets.css';

// We need a fallback if propertyService isn't built yet, but we have /properties api.
// Assuming we fetch properties so tenant can choose which one to open a ticket for.
import { propertiesApi } from '../services/api';

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
      
      // Let's fetch available properties to render the dropdown (in reality, should be properties tenant requested/leases)
      // For V1 MVP, just fetching all public ones
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

  if (loading) return <div className="container flex-center p-top-5"><div className="spinner"></div></div>;

  return (
    <div className="container p-top-4">
      <div className="tickets-header">
        <h2>Maintenance Tickets</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New Ticket'}
        </button>
      </div>

      {showForm && (
        <div className="card new-ticket-form">
          <h3>Submit a Maintenance Request</h3>
          <form onSubmit={handleCreateSubmit}>
            <div className="form-group">
              <label>Select Property</label>
              <select 
                required 
                value={formData.property_id} 
                onChange={e => setFormData({...formData, property_id: e.target.value})}
              >
                <option value="">-- Choose Property --</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Issue Title</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Leaking Faucet"
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Priority</label>
              <select 
                value={formData.priority} 
                onChange={e => setFormData({...formData, priority: e.target.value})}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Initial Message</label>
              <textarea 
                required 
                rows="3"
                placeholder="Describe the issue in detail..."
                value={formData.initial_message}
                onChange={e => setFormData({...formData, initial_message: e.target.value})}
              ></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary block-btn">Submit Request</button>
          </form>
        </div>
      )}

      {tickets.length === 0 && !showForm ? (
        <div className="empty-state card">
          <p>You have no active maintenance tickets.</p>
        </div>
      ) : (
        <div className="tickets-layout flex-col md-flex-row">
          <div className="tickets-list card list-pane">
            <h3 className="pane-title">Your Tickets</h3>
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
                    {t.priority} Priority
                  </span>
                  <span className="date-text">{new Date(t.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="ticket-chat-pane card">
            {activeTicket ? (
              <>
                <div className="chat-pane-header">
                  <h3>{activeTicket.title}</h3>
                  <p>Issue at Property</p>
                </div>
                <ChatBox contextType="TICKET" contextId={activeTicket.id} />
              </>
            ) : (
              <div className="empty-chat-state">
                <p>Select a ticket to view messages</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTickets;
