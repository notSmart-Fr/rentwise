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
    <div className="flex flex-col grow min-h-[calc(100vh-80px)] py-16 px-4 animate-fade-in">
      <div className="container flex items-center justify-center min-h-full">
        <div className="glass-panel w-full max-w-[480px] p-10 mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2 text-text-primary">Create Your Account</h1>
            <p className="text-text-secondary text-sm">Join RentWise to discover properties and manage your assets.</p>
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
              className="btn btn-primary w-full mt-4 py-3.5 text-base"
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

