import React, { useState, useEffect } from 'react';
import { propertiesApi, requestsApi, paymentsApi } from '../../shared/services/api';
import PropertyCard from '../properties/PropertyCard';
import RequestRow from '../requests/RequestRow';
import StatsCard from '../../shared/components/StatsCard';
import AddPropertyModal from '../properties/AddPropertyModal';
import EditPropertyModal from '../properties/EditPropertyModal';
import PaymentModal from '../payments/PaymentModal';
import { useChat } from '../messaging/ChatContext';
import messageService from '../messaging/messageService';
import InboxRow from '../messaging/InboxRow';
import './OwnerDashboard.css';
import '../messaging/Inbox.css';

const OwnerDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [requests, setRequests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, properties, requests, inbox
  const [conversations, setConversations] = useState([]);
  const { openChat } = useChat();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [propsData, reqsData, paymentsData, convsData] = await Promise.all([
        propertiesApi.getOwnerProperties(),
        requestsApi.getOwnerRequests(),
        paymentsApi.listOwnerPayments(),
        messageService.getConversations()
      ]);
      setProperties(propsData);
      setRequests(reqsData);
      setPayments(paymentsData);
      setConversations(convsData);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenConversation = async (conv) => {
    openChat(
      conv.context_type, 
      conv.context_id, 
      conv.context_title, 
      null, 
      conv.other_participant_id
    );
    
    if (conv.unread_count > 0) {
      try {
        await messageService.markAsRead(conv.id);
        setConversations(prev => prev.map(c => 
          c.id === conv.id ? { ...c, unread_count: 0 } : c
        ));
      } catch (err) {
        console.error('Failed to mark as read', err);
      }
    }
  };

  const totalUnread = (conversations || []).reduce((sum, c) => sum + (c.unread_count || 0), 0);

  const handlePropertyAdded = () => {
    setIsModalOpen(false);
    fetchDashboardData();
  };

  const handlePropertyUpdated = () => {
    setIsEditModalOpen(false);
    fetchDashboardData();
  };

  const handleEditProperty = (property) => {
    setSelectedProperty(property);
    setIsEditModalOpen(true);
  };

  const handleManagePayment = (request) => {
    setSelectedRequest(request);
    setIsPaymentModalOpen(true);
  };

  const totalRevenue = (payments || [])
    .filter(p => p?.status === 'PAID')
    .reduce((sum, p) => sum + (Number(p?.amount) || 0), 0);

  if (loading) {
    return (
      <div className="container p-top-5 flex-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="owner-dashboard container animate-fade-in">
      <header className="dashboard-header m-bottom-5">
        <div className="header-main">
          <h1 className="dashboard-title">Owner Dashboard</h1>
          <p className="dashboard-subtitle">Manage your portfolio and resident requests</p>
        </div>
        
        <div className="dashboard-tabs glass-panel p-05 m-top-3">
          <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={`tab-btn ${activeTab === 'properties' ? 'active' : ''}`} onClick={() => setActiveTab('properties')}>My Properties ({properties.length})</button>
          <button className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>Rental Requests ({requests.length})</button>
          <button className={`tab-btn ${activeTab === 'inbox' ? 'active' : ''}`} onClick={() => setActiveTab('inbox')}>
            Inbox 
            {totalUnread > 0 && <span className="tab-badge">{totalUnread}</span>}
          </button>
        </div>
      </header>

      {error && <div className="alert alert-danger m-bottom-4">{error}</div>}

      {activeTab === 'inbox' && (
        <section className="inbox-section animate-fade-in">
          <h2 className="section-title m-bottom-4">My Inbox</h2>
          {conversations.length > 0 ? (
            <div className="inbox-list">
              {conversations.map(conv => (
                <InboxRow 
                  key={conv.id} 
                  conversation={conv} 
                  onClick={handleOpenConversation} 
                />
              ))}
            </div>
          ) : (
            <div className="inbox-empty glass-panel p-5">
              <h3>No messages yet</h3>
              <p>Inquiries about your properties will appear here.</p>
            </div>
          )}
        </section>
      )}

      {activeTab === 'overview' && (
        <section className="overview-section animate-fade-in">
          <div className="stats-grid m-bottom-5">
            <StatsCard title="Properties" value={properties.length} icon="🏠" trend="+2 this month" color="blue" />
            <StatsCard title="Active Leases" value={requests.filter(r => r.status === 'APPROVED').length} icon="🔑" color="green" />
            <StatsCard title="Total Revenue" value={`৳${totalRevenue.toLocaleString()}`} icon="💰" color="purple" />
            <StatsCard title="Pending" value={requests.filter(r => r.status === 'PENDING').length} icon="⏳" color="orange" />
          </div>

          <div className="overview-footer glass-panel p-4 text-center">
            <p className="text-secondary">All systems operational. You have {properties.length} active listings.</p>
          </div>
        </section>
      )}

      {activeTab === 'properties' && (
        <section className="properties-section animate-fade-in">
          <div className="section-header flex-between m-bottom-4">
            <h2 className="section-title">My Properties</h2>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Add Property</button>
          </div>
          <div className="properties-grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
            {properties.map(prop => (
              <PropertyCard key={prop.id} property={prop} onEdit={handleEditProperty} />
            ))}
          </div>
        </section>
      )}

      {activeTab === 'requests' && (
        <section className="requests-section animate-fade-in">
          <h2 className="section-title m-bottom-4">All Rental Requests</h2>
          <div className="requests-stack">
            {requests.map(req => (
              <RequestRow key={req.id} request={req} isOwner={true} onManagePayment={handleManagePayment} />
            ))}
          </div>
        </section>
      )}

      <AddPropertyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handlePropertyAdded} />
      <EditPropertyModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} property={selectedProperty} onSuccess={handlePropertyUpdated} />
      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} request={selectedRequest} onSuccess={fetchDashboardData} />
    </div>
  );
};

export default OwnerDashboard;
