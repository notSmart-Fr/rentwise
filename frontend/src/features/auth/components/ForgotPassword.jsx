import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const ForgotPassword = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Something went wrong');
      }

      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col grow min-h-[calc(100vh-80px)] py-16 px-4 animate-fade-in">
      <div className="container flex items-center justify-center min-h-full">
        <div className="glass-panel w-full max-w-[440px] p-10 mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
              <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-text-primary">Forgot Password?</h1>
            <p className="text-text-secondary text-sm">No worries! Enter your email and we'll send you a recovery link.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger mb-6 text-sm animate-shake">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {message ? (
            <div className="text-center animate-in fade-in zoom-in duration-500">
              <div className="flex flex-col items-center gap-4 p-6 bg-success/10 border border-success/20 rounded-2xl text-success mb-8">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mb-1">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="3" fill="none">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <p className="font-medium text-sm leading-relaxed">{message}</p>
              </div>
              <Link to="/login" className="btn btn-primary w-full py-3.5">
                Go back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-secondary pl-1" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="input-field"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full py-3.5 text-base shadow-lg shadow-primary/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Send Recovery Link'
                )}
              </button>

              <div className="text-center">
                <Link to="/login" className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors">
                  Wait, I remember it!
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
