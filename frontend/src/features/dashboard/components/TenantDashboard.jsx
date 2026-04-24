import { Link } from 'react-router-dom';
import { MyRequests } from '../../requests';
import { MyTickets } from '../../tickets';
import { TenantPayments } from '../../payments';
import LeaseCard from '../../leases/components/LeaseCard';
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
    handleOpenConversation,
    leases
  } = useTenantDashboard(initialTab);

  if (isLoading && activeLeases.length === 0) {
    return (
      <div className="container flex min-h-[70vh] items-center justify-center pt-16 mx-auto">
        <div className="flex flex-col items-center gap-8">
          <div className="h-20 w-20 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-glow shadow-primary/20"></div>
          <p className="text-slate-500 font-black uppercase tracking-[0.4em] animate-pulse text-xs">Architecting your sanctuary...</p>
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
            Resident <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-accent to-white italic">Hub</span>
          </h1>
          <p className="text-slate-400 text-xl font-medium max-w-xl">Welcome home. Manage your portfolio and residency in one architectural interface.</p>
        </div>

        <div className="flex gap-2 p-2 bg-surface-rentwise rounded-4xl w-full lg:w-auto overflow-x-auto shadow-2xl border border-white/5">
          {[
            { id: 'overview', label: 'Portfolio' },
            { id: 'leases', label: 'Agreements' },
            { id: 'maintenance', label: 'Requests' },
            { id: 'payments', label: 'Ledger' },
            { id: 'chats', label: 'Concierge' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 lg:flex-none rounded-3xl px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-700 ${activeTab === tab.id
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

      {/* Tab Panels */}
      <div className="relative z-10">
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <StatsCard
                title="Portfolio Assets"
                value={activeLeases.length}
                icon="🏰"
                color="blue"
                trend="Active Agreement"
              />
              <StatsCard
                title="Verification Pipeline"
                value={pendingApplicationsCount}
                icon="📜"
                color="purple"
                trend="In Review"
              />
              <StatsCard
                title="Service Tickets"
                value={openTicketsCount}
                icon="🔧"
                color={openTicketsCount > 0 ? "orange" : "green"}
                trend={openTicketsCount > 0 ? "Priority Attention" : "Clear Portfolio"}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 bg-surface-rentwise p-12 space-y-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group border border-white/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tightest">
                    Recent Ledger Activity
                  </h3>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl">📅</div>
                </div>

                <div className="space-y-6">
                  {activeLeases.length > 0 ? (
                    <div className="flex items-center justify-between p-10 bg-white/5 rounded-4xl border border-white/5 hover:border-primary/20 transition-all group/item cursor-pointer">
                      <div>
                        <p className="text-2xl font-black text-white tracking-tight">{activeLeases[0].property_title}</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2">Upcoming financial commitment</p>
                      </div>
                      <div className="text-right">
                        <span className="text-white text-4xl font-black tracking-tightest">৳{activeLeases[0].property_rent?.toLocaleString()}</span>
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-2">Due in 4 days</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-20 text-center">
                      <p className="text-slate-500 text-sm italic font-black uppercase tracking-[0.3em]">No recent ledger activity detected.</p>
                    </div>
                  )}
                  <button
                    onClick={() => setActiveTab('leases')}
                    className="w-full text-center text-[10px] font-black text-primary uppercase tracking-[0.4em] py-6 rounded-3xl border border-dashed border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    Manage Full Portfolio
                  </button>
                </div>
              </div>

              <div className="lg:col-span-4 bg-linear-to-br from-primary/10 to-accent/5 p-12 space-y-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-center border border-white/5">
                <div className="absolute top-0 right-0 p-8 text-9xl opacity-5 group-hover:scale-110 transition-transform duration-1000">✨</div>
                <h3 className="text-2xl font-black text-white uppercase tracking-widest">
                  Resident Tip
                </h3>
                <p className="text-slate-300 text-xl leading-relaxed relative z-10 italic font-medium">
                  "Ensure your RentWise Ledger is synchronized. Verified payments accelerate your portfolio reputation."
                </p>
                <div className="pt-8">
                  <div className="h-1 w-20 bg-primary rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leases' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-20">
            {/* Active Agreements Section */}
            {leases && leases.length > 0 && (
              <div className="space-y-12">
                <div className="flex items-center gap-6">
                  <h2 className="text-3xl font-black text-white uppercase tracking-tightest">Active Portfolio</h2>
                  <div className="flex-1 h-px bg-white/5"></div>
                </div>
                <div className="grid grid-cols-1 gap-10">
                  {leases.map(lease => (
                    <LeaseCard key={lease.id} lease={lease} />
                  ))}
                </div>
              </div>
            )}

            {/* Applications Section */}
            <div className="space-y-12">
              <div className="flex items-center gap-6">
                <h2 className="text-3xl font-black text-white uppercase tracking-tightest">Verification History</h2>
                <div className="flex-1 h-px bg-white/5"></div>
              </div>
              <MyRequests hideHeader={true} />
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <MyTickets />
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <TenantPayments leases={leases} />
          </div>
        )}

        {/* Chats Tab - Direct interactive list */}
        {activeTab === 'chats' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-12">
            <h2 className="text-3xl font-black text-white uppercase tracking-tightest">RentWise Concierge</h2>
            <div className="grid grid-cols-1 gap-6">
              {conversations.filter(c => c.user_role === 'TENANT').length > 0 ? (
                conversations
                  .filter(c => c.user_role === 'TENANT')
                  .map(conv => (
                    <InboxRow key={conv.id} conversation={conv} onClick={handleOpenConversation} />
                  ))
              ) : (
                <div className="bg-surface-rentwise py-32 rounded-[2.5rem] text-center border border-dashed border-white/10">
                  <div className="text-7xl mb-10 grayscale opacity-20">💬</div>
                  <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-widest">No Active Sessions</h3>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto">Concierge logs will manifest here once you initiate communication regarding your assets.</p>
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
