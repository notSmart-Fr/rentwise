import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../features/auth';
import { useChat, useConversations } from '../../features/messaging';
import { useNotifications } from '../hooks/useNotifications';
import ChatDropdown from './ChatDropdown';
import AlertsDropdown from './AlertsDropdown';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, activeRole, switchRole } = useAuth();
  const { closeChat } = useChat();
  const { totalUnread: unreadMessages } = useConversations();
  const { unreadCount: unreadAlerts } = useNotifications();
  
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  
  const chatRef = useRef(null);
  const alertsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) setIsChatOpen(false);
      if (alertsRef.current && !alertsRef.current.contains(event.target)) setIsAlertsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    closeChat();
    logout();
    navigate('/login');
  };

  const handleSwitchRole = () => {
    switchRole();
    // Navigate home or to the new dashboard for a fresh start
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-100 transition-all duration-300 ease-in-out ${scrolled
      ? 'bg-bg-base/80 backdrop-blur-3xl border-b border-white/5 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.6)]'
      : 'bg-transparent py-6'
      }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">

        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-10 h-10 bg-white/5 rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(124,58,237,0.2)] group-hover:scale-110 transition-transform duration-500">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 animate-pulse-slow">
              <path d="M3 9.5L12 4L21 9.5" stroke="url(#logo_grad_nav)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19 13V19.4C19 19.7314 18.7314 20 18.4 20H5.6C5.26863 20 5 19.7314 5 19.4V13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="logo_grad_nav" x1="3" y1="4" x2="21" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7C3AED" />
                  <stop offset="1" stopColor="#38BDF8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="flex flex-col -gap-1">
            <span className="font-display text-2xl font-black text-white tracking-tighter uppercase leading-none">
              Rent<span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent italic">Wise</span>
            </span>
            {isAuthenticated && (
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/80 animate-in fade-in slide-in-from-left-1 duration-500">
                {activeRole === 'OWNER' ? 'HOSTING' : 'RENTING'}
              </span>
            )}
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-[13px] font-black uppercase tracking-[0.2em] text-text-secondary hover:text-white transition-colors duration-300">Explore</Link>

          {isAuthenticated ? (
            <>
              {activeRole === 'OWNER' ? (
                <Link to="/owner-dashboard" className="text-[13px] font-black uppercase tracking-[0.2em] text-text-secondary hover:text-white transition-colors duration-300">Dashboard</Link>
              ) : (
                <>
                  <Link to="/tenant-dashboard" className="text-[13px] font-black uppercase tracking-[0.2em] text-text-secondary hover:text-white transition-colors duration-300">Dashboard</Link>
                  <Link to="/my-tickets" className="text-[13px] font-black uppercase tracking-[0.2em] text-text-secondary hover:text-white transition-colors duration-300">Issues</Link>
                </>
              )}
              
              <div className="flex items-center gap-6 ml-4">
                {/* Messages Dropdown */}
                <div className="relative" ref={chatRef}>
                  <button 
                    onClick={() => { setIsChatOpen(!isChatOpen); setIsAlertsOpen(false); }}
                    className="text-[13px] font-black uppercase tracking-[0.2em] text-text-secondary hover:text-white transition-colors duration-300 flex items-center gap-2 outline-none group"
                  >
                    Messages
                    <div className="relative">
                      <span className={`flex h-2 w-2 rounded-full ${unreadMessages > 0 ? 'bg-primary animate-pulse shadow-[0_0_8px_rgba(124,58,237,0.5)]' : 'bg-white/10'}`} />
                    </div>
                  </button>
                  {isChatOpen && (
                    <ChatDropdown onClose={() => setIsChatOpen(false)} />
                  )}
                </div>

                {/* Alerts Dropdown */}
                <div className="relative" ref={alertsRef}>
                  <button 
                    onClick={() => { setIsAlertsOpen(!isAlertsOpen); setIsChatOpen(false); }}
                    className="text-[13px] font-black uppercase tracking-[0.2em] text-text-secondary hover:text-white transition-colors duration-300 flex items-center gap-2 outline-none group"
                  >
                    Alerts
                    <div className="relative">
                      <span className={`flex h-2 w-2 rounded-full ${unreadAlerts > 0 ? 'bg-accent animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.5)]' : 'bg-white/10'}`} />
                    </div>
                  </button>
                  {isAlertsOpen && (
                    <AlertsDropdown onClose={() => setIsAlertsOpen(false)} />
                  )}
                </div>
              </div>

              <div className="w-px h-6 bg-white/5 mx-2" />
              
              {/* Role Switcher Button */}
              <button
                onClick={handleSwitchRole}
                className="group relative px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300 active:scale-95"
              >
                <div className="relative flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(124,58,237,0.4)] group-hover:scale-125 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                    {activeRole === 'OWNER' ? 'Switch to Renting' : 'Switch to Hosting'}
                  </span>
                </div>
              </button>

              <button
                className="text-[11px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-danger active:scale-95 transition-all outline-none ml-2"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-[13px] font-black uppercase tracking-[0.2em] text-text-secondary hover:text-white transition-colors duration-300">Log In</Link>
              <Link to="/register" className="btn btn-primary px-8 py-2.5 shadow-lg shadow-primary/20">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu Toggle */}
        <button
          className="md:hidden flex items-center justify-center w-11 h-11 bg-white/5 border border-white/10 rounded-xl text-white outline-none active:scale-90 transition-transform"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" stroke="currentColor" strokeWidth="2.5" fill="none">
            <path d={isMenuOpen ? "M18 6L6 18M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-0 left-0 w-full h-screen z-110 md:hidden bg-bg-base/98 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-300 px-6 pt-24 pb-12 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <Link to="/" className="text-4xl font-black text-white py-6 border-b border-white/5 flex items-center justify-between group" onClick={() => setIsMenuOpen(false)}>
              Explore <span className="text-primary group-hover:translate-x-2 transition-transform">→</span>
            </Link>
            {isAuthenticated ? (
              <>
                <button 
                  onClick={handleSwitchRole}
                  className="w-full text-left text-2xl font-black text-primary py-6 border-b border-white/5 uppercase tracking-widest"
                >
                   ↻ {activeRole === 'OWNER' ? 'Switch to Renting' : 'Switch to Hosting'}
                </button>
                
                {activeRole === 'OWNER' ? (
                  <Link to="/owner-dashboard" className="text-4xl font-black text-white py-6 border-b border-white/5" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                ) : (
                  <>
                    <Link to="/tenant-dashboard" className="text-4xl font-black text-white py-6 border-b border-white/5" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                    <Link to="/my-tickets" className="text-4xl font-black text-white py-6 border-b border-white/5" onClick={() => setIsMenuOpen(false)}>Maintenance</Link>
                  </>
                )}
                
                <Link to="/messages" className="text-4xl font-black text-white py-6 border-b border-white/5 relative" onClick={() => setIsMenuOpen(false)}>
                  Inbox
                  {unreadMessages > 0 && (
                    <span className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] text-white font-bold">
                      {unreadMessages}
                    </span>
                  )}
                </Link>
                <div className="pt-12">
                  <button className="w-full btn btn-secondary py-5 text-lg font-black uppercase tracking-[0.2em]" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>Exit Platform</button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-4xl font-black text-white py-6 border-b border-white/5" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                <div className="pt-12">
                  <Link to="/register" className="w-full block text-center btn btn-primary py-5 text-lg font-black uppercase tracking-[0.2em]" onClick={() => setIsMenuOpen(false)}>Register Account</Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
