import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { propertiesApi, requestsApi, paymentsApi } from '../services/api';
import StatsCard from '../components/StatsCard';
import PropertyCard from '../components/PropertyCard';
import RequestRow from '../components/RequestRow';
import AddPropertyModal from '../components/AddPropertyModal';
import EditPropertyModal from '../components/EditPropertyModal';
import PaymentModal from '../components/PaymentModal';
import OwnerTicketsTab from '../components/OwnerTicketsTab';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [requests, setRequests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [activeTab, setActiveTab] = useState('OVERVIEW');

  const handlePropertyAdded = (newProp) => {
    setProperties(prev => [newProp, ...prev]);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [propsData, reqsData, paymentsData] = await Promise.all([
        propertiesApi.getOwnerProperties(),
        requestsApi.getOwnerRequests(),
        paymentsApi.listOwnerPayments()
      ]);
      setProperties(propsData);
      setRequests(reqsData);
      setPayments(paymentsData);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await requestsApi.approve(id);
      fetchDashboardData(); // Refresh everything
    } catch (err) {
      alert('Failed to approve request: ' + (err.message || 'Unknown error'));
    }
  };

  const handleReject = async (id) => {
    try {
      await requestsApi.reject(id);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to reject request: ' + (err.message || 'Unknown error'));
    }
  };

  const handleManagePayment = (request) => {
    setSelectedRequest(request);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSaved = (payment) => {
    fetchDashboardData();
  };

  const handleEditProperty = (prop) => {
    setSelectedProperty(prop);
    setIsEditModalOpen(true);
  };

  const handlePropertyUpdated = (updatedProp) => {
    setProperties(prev => prev.map(p => p.id === updatedProp.id ? updatedProp : p));
  };

  if (loading) {
    return (
      <div className="container p-top-5 flex-center">
        <div className="spinner"></div>
        <p className="m-left-2">Loading your dashboard...</p>
      </div>
    );
  }

  const activeLeases = requests.filter(r => r.status === 'APPROVED').length;
  const pendingRequests = requests.filter(r => r.status === 'PENDING').length;
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="dashboard-container container animate-fade-in">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Owner Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, {user?.full_name}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" style={{marginRight: '8px'}}>
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Property
        </button>
      </header>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'OVERVIEW' ? 'active' : ''}`}
          onClick={() => setActiveTab('OVERVIEW')}
        >Overview & Requests</button>
        <button 
          className={`tab-btn ${activeTab === 'TICKETS' ? 'active' : ''}`}
          onClick={() => setActiveTab('TICKETS')}
        >Maintenance Tickets</button>
      </div>

      <AddPropertyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPropertyAdded={handlePropertyAdded} 
      />

      <EditPropertyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        property={selectedProperty}
        onPropertyUpdated={handlePropertyUpdated}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        request={selectedRequest}
        onPaymentSaved={handlePaymentSaved}
      />

      {activeTab === 'OVERVIEW' ? (
        <>
          <section className="stats-grid">
            <StatsCard title="Total Properties" value={properties.length} icon="🏠" color="blue" />
            <StatsCard title="Pending Requests" value={pendingRequests} icon="⏳" color="orange" />
            <StatsCard title="Active Leases" value={activeLeases} icon="📜" color="green" />
            <StatsCard title="Total Revenue" value={`৳ ${totalRevenue.toLocaleString()}`} icon="💰" color="purple" />
          </section>

          <div className="dashboard-main">
            <section className="dashboard-section">
              <h2 className="section-title">Rental Requests</h2>
              <div className="requests-container">
                {requests.length > 0 ? (
                  requests.map(req => (
                    <RequestRow 
                      key={req.id} 
                      request={req} 
                      isOwner={true} 
                      onApprove={handleApprove}
                      onReject={handleReject}
                      onManagePayment={handleManagePayment}
                    />
                  ))
                ) : (
                  <div className="empty-state">No requests yet.</div>
                )}
              </div>
            </section>

            <section className="dashboard-section">
              <h2 className="section-title">My Properties</h2>
              <div className="owner-properties-grid">
                {properties.length > 0 ? (
                  properties.map(prop => (
                    <PropertyCard key={prop.id} property={prop} isOwner={true} onEdit={handleEditProperty} />
                  ))
                ) : (
                  <div className="empty-state">You haven't listed any properties yet.</div>
                )}
              </div>
            </section>
          </div>
        </>
      ) : (
        <OwnerTicketsTab />
      )}
    </div>
  );
};

export default OwnerDashboard;
