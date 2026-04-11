import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './AuthFields.css';

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'TENANT', // Default role
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

  const handleRoleSelect = (role) => {
    setFormData(prev => ({
      ...prev,
      role
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
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
      // The API doesn't want confirm_password
      const { confirm_password, ...payload } = formData;

      const userData = await register(payload);
      // Auto-logged in, navigate to correct dashboard
      navigate(userData.role === 'OWNER' ? '/owner-dashboard' : '/');
    } catch (err) {
      setError(err.message || 'Registration failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="container flex-center min-h-full">
        <div className="auth-card glass-panel">
          <div className="auth-header text-center">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Create an account to discover or list properties.</p>
          </div>

          <div className="role-switch m-bottom-4" style={{ marginBottom: "1.5rem" }}>
            <button
              className={`role-btn ${formData.role === 'TENANT' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('TENANT')}
            >
              I'm a Tenant
            </button>
            <button
              className={`role-btn ${formData.role === 'OWNER' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('OWNER')}
            >
              I'm an Owner
            </button>
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
              <label className="input-label" htmlFor="full_name">Full Name <span style={{ color: 'var(--color-danger)' }}>*</span></label>
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

            <div className="input-group">
              <label className="input-label" htmlFor="email">Email <span style={{ color: 'var(--color-danger)' }}>*</span></label>
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

            <div className="grid-cols-2 gap-md" style={{ display: 'grid' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label" htmlFor="password">Password <span style={{ color: 'var(--color-danger)' }}>*</span></label>
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

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label" htmlFor="confirm_password">Confirm <span style={{ color: 'var(--color-danger)' }}>*</span></label>
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
              className="btn btn-primary w-full m-top-4 auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="inline-spinner"></div>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="auth-footer text-center">
            <p className="auth-footer-text">
              Already have an account? <Link to="/login" className="auth-link text-gradient">Log in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
