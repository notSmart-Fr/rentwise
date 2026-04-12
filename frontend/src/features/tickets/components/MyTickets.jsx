import React, { useState } from 'react';
import { ChatBox } from '../../messaging';
import { useTickets } from '../hooks/useTickets';

const MyTickets = () => {
  const {
    tickets,
    loading,
    error,
    properties,
    activeTicket,
    setActiveTicket,
    createTicket,
    refresh
  } = useTickets(false);

  // New ticket form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    property_id: '',
    title: '',
    priority: 'LOW',
    initial_message: ''
  });

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTicket(
        formData.property_id,
        formData.title,
        formData.priority,
        formData.initial_message
      );
      setShowForm(false);
      setFormData({ property_id: '', title: '', priority: 'LOW', initial_message: '' });
    } catch (err) {
      alert('Failed to create ticket: ' + err.message);
    }
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-white">Maintenance Hub</h2>
          <p className="text-sm text-text-secondary">Report issues and track repairs for your current residence.</p>
        </div>
        <button 
          className={`btn ${showForm ? 'btn-secondary border-white/10' : 'btn-primary shadow-lg shadow-accent/20'}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel Request' : 'New Maintenance Request'}
        </button>
      </header>

      {showForm && (
        <div className="glass-panel p-8 animate-in zoom-in-95 fade-in duration-300 bg-white/1">
          <h3 className="text-xl font-bold text-white mb-8 border-l-4 border-accent pl-4">Submit New Request</h3>
          <form onSubmit={handleCreateSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Select Property</label>
                <select
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none transition-colors"
                  value={formData.property_id}
                  onChange={e => setFormData({ ...formData, property_id: e.target.value })}
                >
                  <option value="" className="bg-slate-900">-- Choose Property --</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id} className="bg-slate-900">{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Priority Level</label>
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none transition-colors"
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="LOW" className="bg-slate-900">Low - Routine</option>
                  <option value="MEDIUM" className="bg-slate-900">Medium - Normal</option>
                  <option value="HIGH" className="bg-slate-900">High - Urgent</option>
                  <option value="EMERGENCY" className="bg-slate-900">Emergency - Immediate</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Short Summary</label>
              <input
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none transition-colors"
                placeholder="e.g. Broken AC unit in bedroom"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Detailed Description</label>
              <textarea
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none transition-colors resize-none"
                rows="4"
                placeholder="Provide details to help the owner understand the issue..."
                value={formData.initial_message}
                onChange={e => setFormData({ ...formData, initial_message: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary w-full py-4 text-sm shadow-xl shadow-accent/10">
              Submit Request
            </button>
          </form>
        </div>
      )}

      {tickets.length === 0 && !showForm ? (
        <div className="glass-panel py-24 flex flex-col items-center justify-center text-center border-dashed border-white/10">
          <div className="text-5xl mb-6 grayscale opacity-20">🛠️</div>
          <h3 className="text-xl font-bold text-white mb-2">No maintenance requests</h3>
          <p className="text-text-secondary text-sm max-w-sm">Everything seems to be in order! Report an issue if something needs attention.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* List Sidebar */}
          <div className="lg:col-span-4 glass-panel overflow-hidden flex flex-col max-h-[600px] border-white/5">
            <div className="p-5 border-b border-white/5 bg-white/1 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm uppercase tracking-widest">Active Tickets</h3>
              <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-text-muted">{tickets.length}</span>
            </div>
            <div className="overflow-y-auto divide-y divide-white/5 custom-scrollbar">
              {tickets.map(t => (
                <button
                  key={t.id}
                  className={`w-full text-left p-5 transition-all outline-none ${activeTicket?.id === t.id ? 'bg-accent/10 border-l-4 border-accent' : 'hover:bg-white/5 border-l-4 border-transparent'}`}
                  onClick={() => setActiveTicket(t)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold text-white text-sm line-clamp-1">{t.title}</h4>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      t.status === 'RESOLVED' ? 'bg-success/20 text-success' : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-text-muted font-medium">
                    <span className={`flex items-center gap-1 ${
                      t.priority === 'EMERGENCY' ? 'text-danger' : t.priority === 'HIGH' ? 'text-orange-400' : ''
                    }`}>
                      ● {t.priority}
                    </span>
                    <span>{new Date(t.created_at).toLocaleDateString()}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Pane */}
          <div className="lg:col-span-8 glass-panel min-h-[600px] flex flex-col border-white/5 overflow-hidden">
            {activeTicket ? (
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-white/5 bg-white/2">
                  <h3 className="text-xl font-bold text-white mb-1">{activeTicket.title}</h3>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-text-secondary">Property Issue</span>
                    <span className="text-text-muted">•</span>
                    <span className="font-bold text-accent uppercase tracking-widest">{activeTicket.priority} Priority</span>
                  </div>
                </div>
                <div className="flex-1 min-h-[450px]">
                  <ChatBox contextType="TICKET" contextId={activeTicket.id} />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-50">
                <div className="text-5xl mb-6">💬</div>
                <h3 className="text-lg font-bold text-white mb-2">Select a Ticket</h3>
                <p className="text-text-secondary text-sm max-w-xs">Pick a maintenance request from the list to view its status and chat with the owner.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTickets;
