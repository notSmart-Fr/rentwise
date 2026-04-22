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
    <div className="container pb-24 pt-hero-pt animate-fade-in mx-auto px-6">
      {/* Background Ambience */}
      <div className="fixed top-20 left-[-5%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 mb-header-mb flex flex-col justify-between gap-8 lg:flex-row lg:items-end border-l-4 border-accent pl-6">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Resident <span className="text-accent italic">Hub</span>
          </h1>
          <p className="mt-2 text-text-secondary text-lg">Manage your home, lease, and maintenance requests in one place.</p>
        </div>

        <div className="flex gap-1 p-1 bg-white/5 border border-white/5 backdrop-blur-xl rounded-2xl w-full lg:w-auto overflow-x-auto">
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
              className={`relative flex-1 lg:flex-none rounded-xl px-8 py-3 text-sm font-bold transition-all duration-300 ${activeTab === tab.id
                ? 'bg-accent text-white shadow-[0_8px_20px_rgba(56,189,248,0.3)]'
                : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
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
              <div className="glass-panel p-8 space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>📅</span> Recent Activity
                </h3>
                <div className="space-y-4">
                  {activeLeases.length > 0 ? (
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                      <div>
                        <p className="font-bold text-white">{activeLeases[0].property_title}</p>
                        <p className="text-xs text-text-secondary">Next rent due soon</p>
                      </div>
                      <span className="text-accent text-sm font-bold">৳{activeLeases[0].property_rent?.toLocaleString()}</span>
                    </div>
                  ) : (
                    <p className="text-text-secondary text-sm italic">No recent lease activity to show.</p>
                  )}
                  <button
                    onClick={() => setActiveTab('leases')}
                    className="w-full text-center text-xs font-bold text-accent uppercase tracking-widest py-2 hover:text-white transition-colors"
                  >
                    Manage all leases
                  </button>
                </div>
              </div>

              <div className="glass-panel p-8 space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>💡</span> Resident Tip
                </h3>
                <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 text-4xl opacity-10">✨</div>
                  <p className="text-text-secondary text-base leading-relaxed relative z-10 italic">
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
