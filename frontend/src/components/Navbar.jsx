import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const role = user?.role || 'TENANT';

  // Listen to scroll to add a background blur effect when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login'); // We'll build login later
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container flex-between navbar-inner">
        
        {/* Logo Section */}
        <Link to="/" className="navbar-logo flex-center">
          <div className="logo-icon animate-pulse">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
              <path d="M3 9.5L12 4L21 9.5" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 13V19.4C19 19.7314 18.7314 20 18.4 20H5.6C5.26863 20 5 19.7314 5 19.4V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="paint0_linear" x1="3" y1="4" x2="21" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7C3AED" />
                  <stop offset="1" stopColor="#38BDF8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="logo-text">Rent<span className="logo-accent">Wise</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-menu desktop-only">
          <Link to="/" className="nav-link">Explore</Link>
          
          {isAuthenticated ? (
            <>
              {role === 'OWNER' ? (
                <Link to="/owner-dashboard" className="nav-link">Owner Dashboard</Link>
              ) : (
                <Link to="/my-requests" className="nav-link">My Requests</Link>
              )}
              <div className="nav-divider" />
              <button className="btn btn-secondary nav-btn" onClick={() => { logout(); navigate('/login'); }}>Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Log In</Link>
              <Link to="/register" className="btn btn-primary nav-btn">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-toggle desktop-hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
           <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
             <path d={isMenuOpen ? "M18 6L6 18M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="mobile-menu animate-fade-in desktop-hidden glass-panel">
          <div className="mobile-menu-inner">
            <Link to="/" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Explore</Link>
            {isAuthenticated ? (
              <>
                {role === 'OWNER' ? (
                  <Link to="/owner-dashboard" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Owner Dashboard</Link>
                ) : (
                  <Link to="/my-requests" className="mobile-link" onClick={() => setIsMenuOpen(false)}>My Requests</Link>
                )}
                <button className="btn btn-secondary m-top-4" onClick={() => { logout(); navigate('/login'); setIsMenuOpen(false); }}>Log Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                <Link to="/register" className="btn btn-primary m-top-4" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
