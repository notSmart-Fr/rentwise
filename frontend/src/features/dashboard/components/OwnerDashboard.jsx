import React from 'react';
import { Link } from 'react-router-dom';
import { PropertyCard, AddPropertyModal, EditPropertyModal } from '../../properties';
import { RequestRow } from '../../requests';
import StatsCard from '../../../shared/components/StatsCard';
import { PaymentModal, OwnerPayments } from '../../payments';
import { OwnerTicketsTab } from '../../tickets';
import { InboxRow } from '../../messaging';
import { useDashboard } from '../hooks/useDashboard';

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
    <div className="container pb-24 pt-hero-pt animate-fade-in mx-auto px-6">
      {/* Dynamic Background Elements */}
      <div className="fixed top-20 right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-0 left-[-10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 mb-header-mb flex flex-col justify-between gap-8 lg:flex-row lg:items-end border-l-4 border-primary pl-6">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Owner <span className="text-primary italic">Dashboard</span>
          </h1>
          <p className="mt-2 text-text-secondary text-lg">Central command for your property portfolio and tenancies.</p>
        </div>

          {['overview', 'properties', 'requests', 'revenue', 'maintenance', 'chats'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex-1 lg:flex-none rounded-xl px-8 py-3 text-sm font-bold capitalize transition-all duration-300 ${activeTab === tab
                ? 'bg-primary text-white shadow-[0_8px_20px_rgba(124,58,237,0.3)]'
                : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap">
                {tab === 'properties' ? 'Properties' : tab}
                {tab === 'properties' && <span className="text-[10px] opacity-60">({properties.length})</span>}
                {tab === 'chats' && totalUnread > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] text-white animate-bounce-slow shadow-lg">
                    {totalUnread}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* Main View Area */}
      <div className="relative z-10 min-h-[50vh]">
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

            <div className="glass-panel p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-dashed bg-white/1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center text-success">✓</div>
                <div>
                  <h4 className="font-bold text-white">System Status: Optimal</h4>
                  <p className="text-sm text-text-secondary">All listings and payments are staying up to date.</p>
                </div>
              </div>
              <button
                className="btn btn-secondary text-sm border-white/10"
                onClick={() => setActiveTab('properties')}
              >
                Manage My Properties
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
              {conversations.length > 0 ? (
                conversations.map(conv => (
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
