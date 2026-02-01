import React, { createContext, useContext, useState } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (credentials) => {
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.login(credentials);
      if (response.data.success) {
        console.log('User data from login:', response.data.data.user);
        console.log('User role from login:', response.data.data.user.role);
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        setUser(response.data.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const getMe = async () => {
    try {
      const response = await authAPI.getMe();
      console.log('Fetched user data from getMe:', response.data);
      if (response.data.success) {
        console.log('User role from getMe:', response.data.data.user.role);
        setUser(response.data.data.user);
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, getMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
