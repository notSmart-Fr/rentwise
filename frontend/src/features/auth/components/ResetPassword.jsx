import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to reset password');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
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
            <h1 className="text-3xl font-bold mb-2 text-text-primary">New Password</h1>
            <p className="text-text-secondary text-sm">Please choose a strong password you haven't used before.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger mb-6 text-sm">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="text-center animate-bounce-in">
              <div className="flex flex-col items-center gap-4 p-6 bg-success/10 border border-success/20 rounded-2xl text-success mb-8">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mb-1">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="3" fill="none">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <p className="font-medium">Password Reset Successful!</p>
                <p className="text-xs text-success/80">Redirecting to login in 3 seconds...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-secondary pl-1" htmlFor="password">New Password</label>
                <input
                  id="password"
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={!!error && !token}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-secondary pl-1" htmlFor="confirm">Confirm Password</label>
                <input
                  id="confirm"
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={!!error && !token}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full mt-4 py-3.5 text-base shadow-lg shadow-primary/20"
                disabled={isLoading || (!!error && !token)}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <Link to="/login" className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
