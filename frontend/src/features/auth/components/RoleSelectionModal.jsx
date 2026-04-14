import { useState } from 'react';

const RoleSelectionModal = ({ isOpen, onSelect, onCancel }) => {
  const [hovered, setHovered] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-black/40 animate-in fade-in duration-300">
      <div className="glass-panel max-w-2xl w-full p-8 sm:p-12 overflow-hidden relative animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        {/* Abstract Background Accents */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-10 relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">Welcome to RentWise</h2>
          <p className="text-text-secondary text-lg">To personalize your experience, please tell us who you are.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
          {/* Owner Option */}
          <button
            onClick={() => onSelect('OWNER')}
            onMouseEnter={() => setHovered('OWNER')}
            onMouseLeave={() => setHovered(null)}
            className={`flex flex-col items-center p-8 rounded-2xl border-2 transition-all duration-300 text-left group
              ${hovered === 'OWNER'
                ? 'bg-primary/10 border-primary shadow-xl shadow-primary/10 -translate-y-1'
                : 'bg-white/5 border-white/10 hover:border-white/20'}`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300
              ${hovered === 'OWNER' ? 'bg-primary text-white' : 'bg-white/10 text-text-secondary group-hover:text-primary'}`}>
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">I am an Owner</h3>
            <p className="text-text-secondary text-sm text-center leading-relaxed">
              I want to list my properties, manage tenants, and track my earnings.
            </p>
          </button>

          {/* Tenant Option */}
          <button
            onClick={() => onSelect('TENANT')}
            onMouseEnter={() => setHovered('TENANT')}
            onMouseLeave={() => setHovered(null)}
            className={`flex flex-col items-center p-8 rounded-2xl border-2 transition-all duration-300 text-left group
              ${hovered === 'TENANT'
                ? 'bg-accent/10 border-accent shadow-xl shadow-accent/10 -translate-y-1'
                : 'bg-white/5 border-white/10 hover:border-white/20'}`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300
              ${hovered === 'TENANT' ? 'bg-accent text-white' : 'bg-white/10 text-text-secondary group-hover:text-accent'}`}>
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">I am a Tenant</h3>
            <p className="text-text-secondary text-sm text-center leading-relaxed">
              I want to find a place to stay, pay rent online, and request maintenance.
            </p>
          </button>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={onCancel}
            className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
          >
            Cancel and go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionModal;
