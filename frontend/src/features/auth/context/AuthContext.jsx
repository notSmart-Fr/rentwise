import { createContext, useContext, useState, useEffect } from 'react';
import { getAuthToken, setAuthToken as storeToken, removeAuthToken } from '../../../shared/services/api';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [activeRole, setActiveRole] = useState(localStorage.getItem('activeRole') || 'TENANT');
  const [loading, setLoading] = useState(true);

  // Initialize Auth State on App Load
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
          
          // Re-validate activeRole: if user is logged in, ensure their activeRole is valid
          // For Airbnb style, everyone is usually both, but we check flags to be safe
          const storedRole = localStorage.getItem('activeRole');
          if (!storedRole) {
            const initialRole = userData.is_owner ? 'OWNER' : 'TENANT';
            setActiveRole(initialRole);
            localStorage.setItem('activeRole', initialRole);
          }
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          handleLogout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleLoginSuccess = async (access_token) => {
    storeToken(access_token);
    const userData = await authService.getMe();
    setUser(userData);
    
    // Set default active role on login if not set
    const initialRole = userData.is_tenant ? 'TENANT' : 'OWNER';
    setActiveRole(initialRole);
    localStorage.setItem('activeRole', initialRole);
    return userData;
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      return await handleLoginSuccess(response.access_token);
    } catch (error) {
      removeAuthToken();
      throw error;
    }
  };

  const register = async (data) => {
    try {
      await authService.register(data);
      return await login(data.email, data.password);
    } catch (error) {
      throw error;
    }
  };
  
  const loginWithGoogle = async (idToken, role) => {
    try {
      const response = await authService.loginWithGoogle(idToken, role);
      return await handleLoginSuccess(response.access_token);
    } catch (error) {
      removeAuthToken();
      throw error;
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    localStorage.removeItem('activeRole');
    setUser(null);
  };

  const switchRole = () => {
    const newRole = activeRole === 'TENANT' ? 'OWNER' : 'TENANT';
    // Check if user has permission for the new role (usually both in Airbnb style)
    if (newRole === 'OWNER' && !user?.is_owner) return;
    if (newRole === 'TENANT' && !user?.is_tenant) return;

    setActiveRole(newRole);
    localStorage.setItem('activeRole', newRole);
  };

  const value = {
    user,
    activeRole,
    loading,
    login,
    register,
    logout: handleLogout,
    loginWithGoogle,
    switchRole,
    isAuthenticated: !!user,
    isOwner: activeRole === 'OWNER',
    isTenant: activeRole === 'TENANT',
    hasOwnerPermission: !!user?.is_owner,
    hasTenantPermission: !!user?.is_tenant
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
