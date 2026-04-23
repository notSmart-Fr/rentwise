import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, loginWithGoogle, activeRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getRedirectPath = (role) => {
    if (location.state?.from) return location.state.from;
    return role === 'OWNER' ? '/owner-dashboard' : '/tenant-dashboard';
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
      // We use activeRole for redirect because even if legacy role exists, activeRole is our truth
      navigate(getRedirectPath(activeRole));
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    setIsLoading(true);
    setError('');

    try {
      // In the new Dual Role system, Google login doesn't need a role selection modal
      // because every user gets both roles automatically.
      const userData = await loginWithGoogle(response.credential);
      navigate(getRedirectPath(activeRole));
    } catch (err) {
      setError(err.message || 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1326] text-white flex flex-col items-center justify-center py-20 px-4 relative overflow-hidden font-manrope">
      {/* Cinematic Ambient Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[150px] rounded-full opacity-60"></div>
      </div>

      <div className="container relative z-10 flex items-center justify-center">
        <div className="bg-[#131b2e] w-full max-w-[480px] p-12 rounded-[2.5rem] shadow-[40px_80px_160px_rgba(0,0,0,0.8)] border border-white/5 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black mb-3 text-white tracking-tighter">Welcome Back</h1>
            <p className="text-slate-400 font-medium">Log in to your architectural rental hub.</p>
          </div>

          {error && (
            <div className="flex flex-col gap-3 p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger mb-6 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span className="font-medium whitespace-pre-wrap">
                  {error === 'ACCOUNT_NOT_FOUND'
                    ? "We couldn't find an account with that email."
                    : error === 'INCORRECT_PASSWORD'
                      ? "Incorrect password. Please try again."
                      : error}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-danger/10">
                {error === 'ACCOUNT_NOT_FOUND' ? (
                  <Link to="/register" className="flex items-center gap-1.5 font-semibold text-danger hover:underline">
                    <span>Create an account</span>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : error === 'INCORRECT_PASSWORD' ? (
                  <Link to="/forgot-password" state={{ email }} className="flex items-center gap-1.5 font-semibold text-danger hover:underline">
                    <span>Reset password?</span>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : null}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Authentication Failed')}
                useOneTap
                theme="filled_blue"
                shape="pill"
                size="large"
                text="continue_with"
              />
              <div className="relative flex items-center w-full my-6">
                <div className="grow border-t border-white/5"></div>
                <span className="shrink mx-4 text-xs font-semibold text-text-secondary uppercase tracking-widest">Or login with email</span>
                <div className="grow border-t border-white/5"></div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-secondary pl-1" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="input-field"
                  placeholder="Ex. me@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between pl-1">
                  <label className="text-sm font-medium text-text-secondary" htmlFor="password">Password</label>
                  <Link
                    to="/forgot-password"
                    tabIndex="-1"
                    className="text-xs font-semibold text-primary hover:text-accent transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full mt-6 py-4 rounded-2xl bg-linear-to-r from-primary to-accent text-white font-black uppercase tracking-widest transition-all hover:shadow-[0_12px_24px_rgba(124,58,237,0.4)] hover:scale-[1.02] active:scale-95 flex items-center justify-center"
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
                Don't have an account? <Link to="/register" className="font-semibold text-primary hover:text-accent transition-colors">Create one</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
