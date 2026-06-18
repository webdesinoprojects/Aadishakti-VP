/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.verify();
      setUser(response.data.admin);
    } catch {
      localStorage.removeItem('admin_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    const { token, username } = response.data;
    localStorage.setItem('admin_token', token);
    setUser({ username });
    return response.data;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      console.error('Logout error');
    } finally {
      localStorage.removeItem('admin_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
