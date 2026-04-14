import React from 'react';
import AlertItem from './AlertItem';
import { useNotifications } from '../hooks/useNotifications';
import { useNavigate } from 'react-router-dom';

const AlertsDropdown = ({ onClose }) => {
  const navigate = useNavigate();
  const { notifications, markOneRead, markAllRead, loading } = useNotifications();

  const handleAlertClick = async (alert) => {
    await markOneRead(alert.id);
    
    // Context-sensitive navigation
    if (alert.context_type === 'RENTAL_REQUEST') {
      navigate('/dashboard'); // or specific request page if it existed
    } else if (alert.context_type === 'TICKET') {
      navigate('/my-tickets');
    }
    
    onClose();
  };

  return (
    <div className="absolute right-0 top-full mt-4 w-80 sm:w-96 rounded-2xl border border-white/10 bg-bg-base/95 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl animate-in fade-in slide-in-from-top-4 duration-300 z-110">
      <div className="flex items-center justify-between p-4 pb-2 border-b border-white/5">
        <h3 className="text-sm font-black uppercase tracking-widest text-white">System Alerts</h3>
        <button 
          onClick={markAllRead}
          className="text-[10px] font-black uppercase tracking-tighter text-accent hover:text-white transition-colors"
        >
          Mark all read
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="p-8 text-center text-slate-500 animate-pulse font-bold tracking-widest text-[10px] uppercase">
            Fetching Alerts...
          </div>
        ) : notifications.length > 0 ? (
          notifications.map(alert => (
            <AlertItem 
              key={alert.id} 
              alert={alert} 
              onClick={handleAlertClick} 
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="mb-4 text-3xl opacity-30">✨</div>
            <p className="text-sm font-bold text-white mb-1">Clear Horizon</p>
            <p className="text-xs text-slate-500">No new system alerts at this time.</p>
          </div>
        )}
      </div>

      <div className="p-2 border-t border-white/5">
        <p className="text-center py-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
          Recent Activity
        </p>
      </div>
    </div>
  );
};

export default AlertsDropdown;
