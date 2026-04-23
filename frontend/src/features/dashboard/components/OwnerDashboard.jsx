import React from 'react';
import { Link } from 'react-router-dom';
import { PropertyCard, AddPropertyModal, EditPropertyModal } from '../../properties';
import { RequestRow } from '../../requests';
import StatsCard from '../../../shared/components/StatsCard';
import { PaymentModal, OwnerPayments } from '../../payments';
import { OwnerTicketsTab } from '../../tickets';
import { InboxRow } from '../../messaging';
import { useDashboard } from '../hooks/useDashboard';
import RevenueChart from './analytics/RevenueChart';
import OccupancyChart from './analytics/OccupancyChart';

const OwnerDashboard = () => {
  const {
    activeTab,
    setActiveTab,
    isLoading,
    properties,
    requests,
    conversations,
    totalUnread,
    totalRevenue,
    activeLeasesCount,
    pendingRequestsCount,
    analytics,
    isModalOpen,
    setIsModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    selectedProperty,
    selectedRequest,
    handleOpenConversation,
    handlePropertyAdded,
    handlePropertyUpdated,
    handleEditProperty,
    handleManagePayment,
    refreshPayments
  } = useDashboard();

  if (isLoading && properties.length === 0) {
    return (
      <div className="container flex min-h-[70vh] items-center justify-center pt-16 mx-auto">
        <div className="flex flex-col items-center gap-6">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-glow"></div>
          <p className="text-text-secondary font-medium animate-pulse">Syncing your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1326] text-white px-4 pb-12 pt-24 lg:px-12 lg:pb-12 lg:pt-32 font-manrope selection:bg-primary/30">
      {/* Ambient Design Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full opacity-60"></div>
      </div>

      {/* Header Section */}
      <header className="relative z-10 mb-16 flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
        <div className="animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-2.5 h-10 bg-linear-to-b from-primary to-accent rounded-full shadow-[0_0_20px_rgba(124,58,237,0.4)]"></div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Command <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">Center</span>
            </h1>
          </div>
          <p className="ml-6 text-slate-400 text-lg font-medium">Welcome back. Your portfolio is performing at <span className="text-success">92% efficiency</span> today.</p>
        </div>

        <div className="flex gap-1.5 p-1.5 bg-[#171f33] rounded-3xl w-full lg:w-auto overflow-x-auto shadow-2xl">
          {['overview', 'properties', 'requests', 'revenue', 'maintenance', 'chats'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex-1 lg:flex-none rounded-2xl px-10 py-4 text-xs font-black uppercase tracking-widest transition-all duration-500 ${activeTab === tab
                ? 'bg-linear-to-br from-primary to-accent text-white shadow-[0_12px_24px_rgba(124,58,237,0.4)] scale-105'
                : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap">
                {tab === 'properties' ? 'Portfolio' : tab}
                {tab === 'chats' && totalUnread > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] text-white shadow-lg">
                    {totalUnread}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* Main View Area */}
      <div className="relative z-10 min-h-[50vh] outline-none" tabIndex="-1">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard 
                title="Total Properties" 
                value={properties.length} 
                icon="🏠" 
                color="blue" 
                trend="+1 this month" 
                onClick={() => setActiveTab('properties')}
              />
              <StatsCard 
                title="Active Leases" 
                value={activeLeasesCount} 
                icon="🔑" 
                color="green" 
                onClick={() => setActiveTab('requests')}
              />
              <StatsCard 
                title="Total Revenue" 
                value={`৳ ${totalRevenue.toLocaleString()}`} 
                icon="💰" 
                color="purple" 
                trend="Stable" 
                onClick={() => setActiveTab('revenue')}
              />
              <StatsCard 
                title="Pending Review" 
                value={pendingRequestsCount} 
                icon="⏳" 
                color="orange" 
                onClick={() => setActiveTab('requests')}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 outline-none">
              <div className="lg:col-span-2 min-w-0 outline-none" tabIndex="-1">
                <RevenueChart data={analytics.revenue} />
              </div>
              <div className="lg:col-span-1 min-w-0 outline-none" tabIndex="-1">
                <OccupancyChart data={analytics.occupancy} />
              </div>
            </div>

            <div className="bg-[#131b2e] p-8 flex flex-col sm:flex-row items-center justify-between gap-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center text-3xl shadow-inner">✓</div>
                <div>
                  <h4 className="text-xl font-black text-white">System Status: Optimal</h4>
                  <p className="text-slate-400 font-medium">All property listings and tenant payments are staying up to date.</p>
                </div>
              </div>
              <button
                className="relative z-10 px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all active:scale-95"
                onClick={() => setActiveTab('properties')}
              >
                Manage My Portfolio
              </button>
            </div>
          </div>

        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white">My Properties</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary px-8 py-3.5 shadow-xl shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-transform"
              >
                + Add New Listing
              </button>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {properties.map(prop => (
                <PropertyCard key={prop.id} property={prop} onEdit={handleEditProperty} />
              ))}
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <h2 className="text-2xl font-black text-white">Rental Applications</h2>
            <div className="grid grid-cols-1 gap-6">
              {requests.length > 0 ? (
                requests.map(req => (
                  <RequestRow key={req.id} request={req} isOwner={true} onManagePayment={handleManagePayment} />
                ))
              ) : (
                <div className="glass-panel py-24 text-center opacity-70 border-dashed">
                  <div className="text-5xl mb-6">📄</div>
                  <h3 className="text-xl font-bold text-white mb-2">No applications yet</h3>
                  <p className="text-text-secondary">When tenants apply for your properties, they'll appear here.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <OwnerPayments />
          </div>
        )}

        {/* Maintenance Tab */}
        {activeTab === 'maintenance' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <OwnerTicketsTab />
          </div>
        )}

        {/* Chats Tab - Direct interactive list for faster communication */}
        {activeTab === 'chats' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <h2 className="text-2xl font-black text-white">Recent Chats</h2>
            <div className="grid grid-cols-1 gap-4">
              {conversations.filter(c => c.user_role === 'OWNER').length > 0 ? (
                conversations
                  .filter(c => c.user_role === 'OWNER')
                  .map(conv => (
                    <InboxRow key={conv.id} conversation={conv} onClick={handleOpenConversation} />
                  ))
              ) : (
                <div className="glass-panel py-24 text-center opacity-70 border-dashed">
                  <div className="text-5xl mb-6">💬</div>
                  <h3 className="text-xl font-bold text-white mb-2">No active conversations</h3>
                  <p className="text-text-secondary">Recent inquiries from tenants will be listed here.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddPropertyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handlePropertyAdded} />
      {selectedProperty && (
        <EditPropertyModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          property={selectedProperty}
          onSuccess={handlePropertyUpdated}
        />
      )}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        request={selectedRequest}
        onSuccess={refreshPayments}
      />
    </div>
  );
};

export default OwnerDashboard;
