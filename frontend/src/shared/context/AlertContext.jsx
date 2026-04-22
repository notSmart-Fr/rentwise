import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AlertContext = createContext();

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = useCallback((type, message, duration = 5000) => {
    const id = uuidv4();
    setAlerts((prev) => [...prev, { id, type, message }]);

    if (duration !== null) {
      setTimeout(() => {
        removeAlert(id);
      }, duration);
    }
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  // GLOBAL ERROR INTERCEPTOR
  React.useEffect(() => {
    const handleApiError = (event) => {
      const error = event.detail;
      // We don't want to show alerts for 401s here as we handle them via redirect
      // and we might not want to show alerts for specific expected errors
      if (error.status !== 401) {
        addAlert('error', error.message);
      }
    };

    window.addEventListener('API_ERROR', handleApiError);
    return () => window.removeEventListener('API_ERROR', handleApiError);
  }, [addAlert]);


  const showAlert = {
    success: (msg, dur) => addAlert('success', msg, dur),
    error: (msg, dur) => addAlert('error', msg, dur),
    warning: (msg, dur) => addAlert('warning', msg, dur),
    info: (msg, dur) => addAlert('info', msg, dur),
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert, showAlert }}>
      {children}
      <AlertContainer alerts={alerts} removeAlert={removeAlert} />
    </AlertContext.Provider>
  );
};

const AlertContainer = ({ alerts, removeAlert }) => {
  return (
    <div className="fixed top-8 right-8 z-200 flex flex-col gap-4 pointer-events-none">
      {alerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert} onRemove={() => removeAlert(alert.id)} />
      ))}
    </div>
  );
};

const AlertItem = ({ alert, onRemove }) => {
  const styles = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10',
    error: 'bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/10',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/10',
    info: 'bg-primary/10 text-primary border-primary/20 shadow-primary/10',
  };

  return (
    <div className={`pointer-events-auto flex items-center justify-between gap-4 px-6 py-4 rounded-2xl border backdrop-blur-3xl shadow-2xl animate-in fade-in slide-in-from-right-8 duration-500 ${styles[alert.type]}`}>
      <div className="flex items-center gap-3">
        <span className="text-lg">
          {alert.type === 'success' && '✓'}
          {alert.type === 'error' && '⚠'}
          {alert.type === 'warning' && '‼'}
          {alert.type === 'info' && 'ℹ'}
        </span>
        <p className="text-sm font-bold tracking-tight">{alert.message}</p>
      </div>
      <button onClick={onRemove} className="opacity-50 hover:opacity-100 transition-opacity p-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
};
