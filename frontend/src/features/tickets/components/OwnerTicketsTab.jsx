import React from 'react';
import { useTickets } from '../hooks/useTickets';
import { ChatBox } from '../../messaging';

const OwnerTicketsTab = () => {
  const { 
    tickets, 
    loading, 
    error, 
    activeTicket, 
    setActiveTicket, 
    updateTicketStatus 
  } = useTickets(true);

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await updateTicketStatus(ticketId, newStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-text-secondary text-sm font-medium animate-pulse">Scanning maintenance reports...</p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="glass-panel py-24 flex flex-col items-center justify-center text-center opacity-60 border-dashed">
        <div className="text-5xl mb-6 grayscale">🛠️</div>
        <h3 className="text-xl font-bold text-white mb-2">No maintenance requests</h3>
        <p className="text-text-secondary text-sm max-w-sm">When tenants report issues in your properties, they'll appear here for management.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col lg:flex-row gap-8 h-[750px] items-stretch">
      {/* Sidebar List */}
      <div className="lg:w-96 glass-panel flex flex-col overflow-hidden border-white/5 bg-white/1">
        <div className="p-6 border-b border-white/5 bg-white/2">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Resident Tickets</h3>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
          {tickets.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTicket(t)}
              className={`w-full text-left p-6 transition-all duration-300 relative group ${
                activeTicket?.id === t.id 
                ? 'bg-primary/10 border-r-4 border-primary' 
                : 'hover:bg-white/5 border-r-4 border-transparent'
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <h4 className={`text-sm font-bold truncate ${activeTicket?.id === t.id ? 'text-white' : 'text-text-primary'}`}>
                    {t.title}
                  </h4>
                  <span className={`shrink-0 text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full ${
                    t.status === 'RESOLVED' ? 'bg-success/20 text-success' : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {t.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-text-muted font-bold">
                  <span className={`uppercase tracking-widest ${
                    t.priority === 'EMERGENCY' ? 'text-danger' : t.priority === 'HIGH' ? 'text-orange-400' : ''
                  }`}>
                    {t.priority}
                  </span>
                  <span>{new Date(t.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Management Pane */}
      <div className="flex-1 glass-panel flex flex-col overflow-hidden border-white/5 bg-white/1">
        {activeTicket ? (
          <div className="flex flex-col h-full">
            {/* Extended Header */}
            <div className="p-8 border-b border-white/5 bg-white/3 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-black text-white leading-tight">{activeTicket.title}</h2>
                <div className="flex items-center gap-4 mt-2">
                   <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${activeTicket.status === 'RESOLVED' ? 'bg-success' : 'bg-orange-500 animate-pulse'}`}></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{activeTicket.status.replace('_', ' ')}</span>
                   </div>
                   <span className="text-text-muted text-xs">•</span>
                   <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Priority: {activeTicket.priority}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {activeTicket.status !== 'IN_PROGRESS' && activeTicket.status !== 'RESOLVED' && (
                  <button 
                    onClick={() => handleStatusChange(activeTicket.id, 'IN_PROGRESS')}
                    className="btn btn-secondary py-2.5 px-5 text-xs font-bold whitespace-nowrap border-white/10"
                  >
                    Set In Progress
                  </button>
                )}
                {activeTicket.status !== 'RESOLVED' && (
                  <button 
                    onClick={() => handleStatusChange(activeTicket.id, 'RESOLVED')}
                    className="btn btn-primary py-2.5 px-5 text-xs font-bold whitespace-nowrap"
                  >
                    Resolve Issue
                  </button>
                )}
                {activeTicket.status === 'RESOLVED' && (
                  <button 
                    onClick={() => handleStatusChange(activeTicket.id, 'PENDING')}
                    className="btn btn-secondary py-2.5 px-5 text-xs font-bold whitespace-nowrap border-white/10"
                  >
                    Re-open Ticket
                  </button>
                )}
              </div>
            </div>

            {/* Chat View */}
            <div className="flex-1 min-h-0 bg-bg-base/20">
              <ChatBox contextType="TICKET" contextId={activeTicket.id} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-30">
            <div className="text-6xl mb-6">🛠️</div>
            <h3 className="text-xl font-bold text-white mb-2">Select a Ticket</h3>
            <p className="text-text-secondary text-sm max-w-xs">Choose a maintenance request from the list to manage status and chat with your resident.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerTicketsTab;
