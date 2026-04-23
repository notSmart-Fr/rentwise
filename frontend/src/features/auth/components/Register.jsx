import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.full_name || !formData.email || !formData.password || !formData.confirm_password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { confirm_password, ...payload } = formData;
      await register({ ...payload, role: 'TENANT' }); // Send default role for API compatibility
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1326] text-white flex flex-col items-center justify-center py-20 px-4 relative overflow-hidden font-manrope">
      {/* Cinematic Ambient Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[150px] rounded-full opacity-60"></div>
      </div>

      <div className="container relative z-10 flex items-center justify-center">
        <div className="bg-[#131b2e] w-full max-w-[540px] p-12 rounded-[2.5rem] shadow-[40px_80px_160px_rgba(0,0,0,0.8)] border border-white/5 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black mb-3 text-white tracking-tighter">Join the Collective</h1>
            <p className="text-slate-400 font-medium">Create your high-end rental account today.</p>
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
              <label className="text-sm font-medium text-text-secondary" htmlFor="full_name">
                Full Name <span className="text-danger">*</span>
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                className="input-field"
                placeholder="Ex. John Doe"
                value={formData.full_name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-secondary" htmlFor="email">
                Email <span className="text-danger">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="input-field"
                placeholder="Ex. john@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-secondary" htmlFor="password">
                  Password <span className="text-danger">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="input-field"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-secondary" htmlFor="confirm_password">
                  Confirm <span className="text-danger">*</span>
                </label>
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  className="input-field"
                  placeholder="Repeat password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 py-4 rounded-2xl bg-linear-to-r from-primary to-accent text-white font-black uppercase tracking-widest transition-all hover:shadow-[0_12px_24px_rgba(124,58,237,0.4)] hover:scale-[1.02] active:scale-95 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-text-secondary text-sm">
              Already have an account? <Link to="/login" className="font-semibold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">Log in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

