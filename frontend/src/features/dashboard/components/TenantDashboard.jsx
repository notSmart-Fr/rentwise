import { Link } from 'react-router-dom';
import { MyRequests } from '../../requests';
import { MyTickets } from '../../tickets';
import { TenantPayments } from '../../payments';
import { useTenantDashboard } from '../hooks/useTenantDashboard';
import { InboxRow } from '../../messaging';
import StatsCard from '../../../shared/components/StatsCard';

const TenantDashboard = ({ initialTab = 'overview' }) => {
  const {
    activeTab,
    setActiveTab,
    isLoading,
    activeLeases,
    openTicketsCount,
    pendingApplicationsCount,
    conversations,
    totalUnread,
    handleOpenConversation
  } = useTenantDashboard(initialTab);

  if (isLoading && activeLeases.length === 0) {
    return (
      <div className="container flex min-h-[70vh] items-center justify-center pt-16 mx-auto">
        <div className="flex flex-col items-center gap-6">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-accent border-t-transparent shadow-[0_0_20px_rgba(56,189,248,0.3)]"></div>
          <p className="text-text-secondary font-medium animate-pulse">Preparing your personal hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1326] text-white px-4 pb-12 pt-24 lg:px-12 lg:pb-12 lg:pt-32 font-manrope selection:bg-accent/30">
      {/* Ambient Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full opacity-60"></div>
      </div>

      {/* Header Section */}
      <header className="relative z-10 mb-16 flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
        <div className="animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-2.5 h-10 bg-linear-to-b from-accent to-primary rounded-full shadow-[0_0_20px_rgba(56,189,248,0.4)]"></div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Resident <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-primary">Hub</span>
            </h1>
          </div>
          <p className="ml-6 text-slate-400 text-lg font-medium">Welcome home. Manage your sanctuary and lease in one place.</p>
        </div>

        <div className="flex gap-1.5 p-1.5 bg-[#171f33] rounded-3xl w-full lg:w-auto overflow-x-auto shadow-2xl">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'leases', label: 'My Leases' },
            { id: 'maintenance', label: 'Maintenance' },
            { id: 'payments', label: 'History' },
            { id: 'chats', label: 'Chats' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 lg:flex-none rounded-2xl px-10 py-4 text-xs font-black uppercase tracking-widest transition-all duration-500 ${activeTab === tab.id
                ? 'bg-linear-to-br from-accent to-primary text-white shadow-[0_12px_24px_rgba(56,189,248,0.4)] scale-105'
                : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap">
                {tab.label}
                {tab.id === 'chats' && totalUnread > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] text-white shadow-lg">
                    {totalUnread}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* Tab Panels */}
      <div className="relative z-10">
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <StatsCard
                title="Active Leases"
                value={activeLeases.length}
                icon="🏠"
                color="blue"
              />
              <StatsCard
                title="Open Applications"
                value={pendingApplicationsCount}
                icon="📄"
                color="purple"
              />
              <StatsCard
                title="Unresolved Issues"
                value={openTicketsCount}
                icon="🛠️"
                color={openTicketsCount > 0 ? "orange" : "green"}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#131b2e] p-10 space-y-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                  <span className="p-3 bg-white/5 rounded-2xl">📅</span> Recent Activity
                </h3>
                <div className="space-y-4">
                  {activeLeases.length > 0 ? (
                    <div className="flex items-center justify-between p-6 bg-white/5 rounded-4xl border-none">
                      <div>
                        <p className="text-lg font-black text-white">{activeLeases[0].property_title}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Next rent due soon</p>
                      </div>
                      <div className="text-right">
                        <span className="text-accent text-2xl font-black">৳{activeLeases[0].property_rent?.toLocaleString()}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm italic font-medium">No recent lease activity to show.</p>
                  )}
                  <button
                    onClick={() => setActiveTab('leases')}
                    className="w-full text-center text-xs font-black text-accent uppercase tracking-[0.2em] py-4 hover:text-white transition-all"
                  >
                    Manage all leases
                  </button>
                </div>
              </div>

              <div className="bg-[#131b2e] p-10 space-y-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                  <span className="p-3 bg-white/5 rounded-2xl">💡</span> Resident Tip
                </h3>
                <div className="bg-linear-to-br from-accent/10 to-primary/5 p-8 rounded-4xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 text-6xl opacity-5 group-hover:scale-110 transition-transform duration-1000">✨</div>
                  <p className="text-slate-300 text-lg leading-relaxed relative z-10 italic font-medium">
                    "Keep your maintenance tickets updated! Owners can coordinate faster with clear photos and descriptions."
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leases' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <MyRequests />
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <MyTickets />
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TenantPayments />
          </div>
        )}

        {/* Chats Tab - Direct interactive list */}
        {activeTab === 'chats' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <h2 className="text-2xl font-black text-white">Recent Chats</h2>
            <div className="grid grid-cols-1 gap-4">
              {conversations.filter(c => c.user_role === 'TENANT').length > 0 ? (
                conversations
                  .filter(c => c.user_role === 'TENANT')
                  .map(conv => (
                    <InboxRow key={conv.id} conversation={conv} onClick={handleOpenConversation} />
                  ))
              ) : (
                <div className="glass-panel py-24 text-center opacity-70 border-dashed">
                  <div className="text-5xl mb-6">💬</div>
                  <h3 className="text-xl font-bold text-white mb-2">No active chats</h3>
                  <p className="text-text-secondary">Messages about your lease requests or tickets will appear here.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantDashboard;
