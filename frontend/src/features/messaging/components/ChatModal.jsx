import React from 'react';
import ChatBox from './ChatBox';

const ChatModal = ({ isOpen, onClose, contextType, contextId, title, subtitle, receiverId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[90vw] animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="glass-panel border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[600px] h-[600px]">
        {/* Header */}
        <div className="p-5 border-b border-white/5 bg-linear-to-r from-primary/20 via-primary/10 to-transparent flex items-center justify-between backdrop-blur-3xl">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-linear-to-tr from-primary to-accent flex items-center justify-center text-white font-black shadow-lg">
                {title?.[0]?.toUpperCase() || '💬'}
             </div>
             <div>
                <h3 className="text-sm font-black text-white leading-tight">{title || 'RentWise Chat'}</h3>
                {subtitle && <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold mt-0.5">{subtitle}</p>}
             </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-text-secondary hover:bg-danger/20 hover:text-danger hover:scale-105 active:scale-90 transition-all outline-none"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="2.5" fill="none">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <ChatBox 
            contextType={contextType} 
            contextId={contextId} 
            receiverId={receiverId} 
          />
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
