import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
      navigate(getRedirectPath(userData.role));
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col grow min-h-[calc(100vh-80px)] py-16 px-4 animate-fade-in">
      <div className="container flex items-center justify-center min-h-full">
        <div className="glass-panel w-full max-w-[440px] p-10 mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-text-primary">Welcome Back</h1>
            <p className="text-text-secondary text-sm">Log in to manage your properties or view requests.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-danger/10 border border-danger/20 rounded-lg text-danger mb-6 text-sm animate-pulse">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-secondary" htmlFor="email">Email</label>
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

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-secondary" htmlFor="password">Password</label>
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
              className="btn btn-primary w-full mt-4 py-3.5 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Log in'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-text-secondary text-sm">
              Don't have an account? <Link to="/register" className="font-semibold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

