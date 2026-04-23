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
        <div className="flex flex-col items-center gap-8">
          <div className="h-20 w-20 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-glow shadow-primary/20"></div>
          <p className="text-slate-500 font-black uppercase tracking-[0.4em] animate-pulse text-xs">Synchronizing Portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1326] text-white px-6 pb-20 pt-48 lg:px-24 lg:pb-24 lg:pt-56 font-manrope selection:bg-primary/30">
      {/* Ambient Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[180px] rounded-full opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent/5 blur-[180px] rounded-full opacity-40"></div>
      </div>

      {/* Header Section */}
      <header className="relative z-10 mb-24 flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
        <div className="animate-in fade-in slide-in-from-left-12 duration-1000">
          <h1 className="text-6xl sm:text-8xl font-black tracking-tightest text-white leading-[0.85] mb-6 uppercase">
            Command <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-accent to-white italic">Center</span>
          </h1>
          <p className="text-slate-400 text-xl font-medium max-w-2xl">Manage your architectural portfolio. Your assets are performing at <span className="text-emerald-400 font-black">92% efficiency</span> today.</p>
        </div>

        <div className="flex gap-2 p-2 bg-[#131b2e] rounded-[2rem] w-full lg:w-auto overflow-x-auto shadow-2xl border border-white/5">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'properties', label: 'Portfolio' },
            { id: 'requests', label: 'Inquiries' },
            { id: 'revenue', label: 'Ledger' },
            { id: 'maintenance', label: 'Service' },
            { id: 'chats', label: 'Concierge' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 lg:flex-none rounded-[1.5rem] px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-700 ${activeTab === tab.id
                ? 'bg-white text-slate-950 shadow-2xl scale-105'
                : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-3 whitespace-nowrap">
                {tab.label}
                {tab.id === 'chats' && totalUnread > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[8px] text-white shadow-glow shadow-primary">
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
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard 
                title="Portfolio Assets" 
                value={properties.length} 
                icon="🏠" 
                color="blue" 
                trend="+1 this month" 
                onClick={() => setActiveTab('properties')}
              />
              <StatsCard 
                title="Active Contracts" 
                value={activeLeasesCount} 
                icon="📜" 
                color="green" 
                onClick={() => setActiveTab('requests')}
              />
              <StatsCard 
                title="Gross Revenue" 
                value={`৳ ${totalRevenue.toLocaleString()}`} 
                icon="💰" 
                color="purple" 
                trend="Stabilized" 
                onClick={() => setActiveTab('revenue')}
              />
              <StatsCard 
                title="Pending Verification" 
                value={pendingRequestsCount} 
                icon="⏳" 
                color="orange" 
                onClick={() => setActiveTab('requests')}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 bg-[#131b2e] rounded-[2.5rem] p-4 border border-white/5">
                <RevenueChart data={analytics.revenue} />
              </div>
              <div className="lg:col-span-1 bg-[#131b2e] rounded-[2.5rem] p-4 border border-white/5">
                <OccupancyChart data={analytics.occupancy} />
              </div>
            </div>

            <div className="bg-[#131b2e] p-12 flex flex-col sm:flex-row items-center justify-between gap-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group border border-white/5">
              <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="flex items-center gap-8 relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-4xl shadow-inner grayscale group-hover:grayscale-0 transition-all duration-700">✓</div>
                <div>
                  <h4 className="text-3xl font-black text-white uppercase tracking-tightest">Portfolio Optimal</h4>
                  <p className="text-slate-400 text-lg font-medium mt-1">All financial ledgers and occupancy logs are synchronized.</p>
                </div>
              </div>
              <button
                className="relative z-10 px-12 py-6 bg-white text-slate-950 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl"
                onClick={() => setActiveTab('properties')}
              >
                Expand Portfolio
              </button>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-12">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-white uppercase tracking-tightest">Managed Portfolio</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-primary text-white px-10 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 hover:scale-105 transition-all"
              >
                + Acquire Asset
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              {properties.map((prop, index) => {
                const spanClass = index % 4 === 0 ? 'md:col-span-8' : index % 4 === 1 ? 'md:col-span-4' : 'md:col-span-6';
                return (
                  <div key={prop?.id || index} className={spanClass}>
                    <PropertyCard property={prop} isHero={index % 4 === 0} onEdit={handleEditProperty} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-12">
            <h2 className="text-3xl font-black text-white uppercase tracking-tightest">Verification Pipeline</h2>
            <div className="grid grid-cols-1 gap-8">
              {requests.length > 0 ? (
                requests.map(req => (
                  <RequestRow key={req.id} request={req} isOwner={true} onManagePayment={handleManagePayment} />
                ))
              ) : (
                <div className="bg-[#131b2e] py-32 rounded-[2.5rem] text-center border border-dashed border-white/10">
                  <div className="text-7xl mb-10 grayscale opacity-20">📜</div>
                  <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-widest">Pipeline Clear</h3>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto">No pending property inquiries or verification requests at this time.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <OwnerPayments />
          </div>
        )}

        {/* Maintenance Tab */}
        {activeTab === 'maintenance' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <OwnerTicketsTab />
          </div>
        )}

        {/* Chats Tab - Direct interactive list for faster communication */}
        {activeTab === 'chats' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-12">
            <h2 className="text-3xl font-black text-white uppercase tracking-tightest">Intelligence Concierge</h2>
            <div className="grid grid-cols-1 gap-6">
              {conversations.filter(c => c.user_role === 'OWNER').length > 0 ? (
                conversations
                  .filter(c => c.user_role === 'OWNER')
                  .map(conv => (
                    <InboxRow key={conv.id} conversation={conv} onClick={handleOpenConversation} />
                  ))
              ) : (
                <div className="bg-[#131b2e] py-32 rounded-[2.5rem] text-center border border-dashed border-white/10">
                  <div className="text-7xl mb-10 grayscale opacity-20">💬</div>
                  <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-widest">No Active Sessions</h3>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto">Communication logs will manifest here once tenants initiate contact regarding your assets.</p>
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
