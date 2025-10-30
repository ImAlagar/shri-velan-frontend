// contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { apiService } from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = sessionStorage.getItem('auth_token');
      if (token) {
        const response = await apiService.get('/auth/profile');
        if (response.data.success) {
          setUser(response.data.data);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('refresh_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials, requiredRole = null) => {
    try {
      setError('');
      const response = await apiService.post('/auth/login', credentials);
      
      console.log('Login API Response:', response.data); // Debug log
      
      if (response.data.success && response.data.data) {
        const { user: userData, accessToken, refreshToken } = response.data.data;
        
        console.log('User data from API:', userData); // Debug log
        console.log('Required role:', requiredRole); // Debug log
        
        // Check if user has the required role
        if (requiredRole) {
          if (requiredRole === 'ADMIN' && userData.role !== 'ADMIN') {
            throw new Error('Access denied. This area is for administrators only.');
          }
          if (requiredRole === 'USER' && userData.role === 'ADMIN') {
            throw new Error('Access denied. This area is for customers only. Administrators should use the admin login.');
          }
        }
        
        // Store tokens
        sessionStorage.setItem('auth_token', accessToken);
        sessionStorage.setItem('refresh_token', refreshToken);
        
        // Set user state
        setUser(userData);
        
        console.log('Login successful, user set:', userData); // Debug log
        
        return response.data;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('refresh_token');
    setUser(null);
    setError('');
  };

  const clearError = () => {
    setError('');
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth,
    setError: clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};