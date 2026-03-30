import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthFields.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect user to where they were trying to go, or based on role
  const getRedirectPath = (role) => {
    if (location.state?.from) return location.state.from;
    return role === 'OWNER' ? '/owner-dashboard' : '/';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const userData = await login(email, password);
      // login was successful, redirect
      navigate(getRedirectPath(userData.role));
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="container flex-center min-h-full">
        <div className="auth-card glass-panel">
          <div className="auth-header text-center">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Log in to manage your properties or view requests.</p>
          </div>

          {error && (
            <div className="auth-error-alert animate-pulse-fast">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label className="input-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="Ex. owner@rentwise.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="input-field"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full m-top-4 auth-submit-btn" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="inline-spinner"></div>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <div className="auth-footer text-center">
            <p className="auth-footer-text">
              Don't have an account? <Link to="/register" className="auth-link text-gradient">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
