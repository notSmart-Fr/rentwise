import { createContext, useContext, useState, useEffect } from 'react';
import { getAuthToken, setAuthToken as storeToken, removeAuthToken } from '../../../shared/services/api';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth State on App Load
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
          localStorage.setItem('role', userData.role);
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          removeAuthToken();
          localStorage.removeItem('role');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // 1. Get Token
      const response = await authService.login(email, password);
      storeToken(response.access_token);

      // 2. Fetch User Profile
      const userData = await authService.getMe();
      setUser(userData);
      localStorage.setItem('role', userData.role);

      return userData;
    } catch (error) {
      removeAuthToken();
      throw error;
    }
  };

  const register = async (data) => {
    try {
      // 1. Register User
      await authService.register(data);
      // 2. Auto-login after registration
      return await login(data.email, data.password);
    } catch (error) {
      throw error;
    }
  };
  
  const loginWithGoogle = async (idToken, role) => {
    try {
      // 1. Get Token from backend
      const response = await authService.loginWithGoogle(idToken, role);
      storeToken(response.access_token);

      // 2. Fetch User Profile
      const userData = await authService.getMe();
      setUser(userData);
      localStorage.setItem('role', userData.role);

      return userData;
    } catch (error) {
      removeAuthToken();
      throw error;
    }
  };

  const logout = () => {
    removeAuthToken();
    localStorage.removeItem('role');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loginWithGoogle,
    isAuthenticated: !!user,
    isOwner: user?.role === 'OWNER',
    isTenant: user?.role === 'TENANT'
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
