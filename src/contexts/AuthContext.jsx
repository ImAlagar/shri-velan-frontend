// contexts/AuthContext.jsx - FIXED version
import React, { createContext, useState, useEffect } from 'react';
import { apiService } from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user_data');
      
      // If no token, skip API call
      if (!token) {
        setLoading(false);
        setInitialCheckDone(true);
        return;
      }

      // Immediately set user from localStorage while verifying
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch (e) {
          console.error('Error parsing stored user data:', e);
        }
      }

      // Verify token with API
      const response = await apiService.get('/auth/profile');
      
      if (response.data.success) {
        setUser(response.data.data);
        localStorage.setItem('user_data', JSON.stringify(response.data.data));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      
      // Only clear tokens if it's an authentication error
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        setUser(null);
      }
      // For other errors (network, server down), keep the user logged in
    } finally {
      setLoading(false);
      setInitialCheckDone(true);
    }
  };

  const register = async (userData) => {
    try {
      setError('');
      setLoading(true);
      
      const response = await apiService.post('/auth/register', userData);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setError('');
      setLoading(true);
      
      const response = await apiService.post('/auth/forgot-password', { email });
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to send reset instructions');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send reset instructions';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, userId, password) => {
    try {
      setError('');
      setLoading(true);
      
      const response = await apiService.post('/auth/reset-password', {
        token,
        userId,
        password
      });
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to reset password';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials, requiredRole = null) => {
    try {
      setError('');
      setLoading(true);
      
      const response = await apiService.post('/auth/login', credentials);
      
      if (response.data.success && response.data.data) {
        const { user: userData, accessToken, refreshToken } = response.data.data;

        // Check if user has the required role
        if (requiredRole) {
          if (requiredRole === 'ADMIN' && userData.role !== 'ADMIN') {
            throw new Error('Access denied. This area is for administrators only.');
          }
          if (requiredRole === 'USER' && userData.role === 'ADMIN') {
            throw new Error('Access denied. This area is for customers only. Administrators should use the admin login.');
          }
        }
        
        // Store tokens in localStorage
        localStorage.setItem('auth_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('user_data', JSON.stringify(userData));
        
        // Set user state
        setUser(userData);
                
        return response.data;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = (redirectPath = '/') => {
    // Clear all stored data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    
    setUser(null);
    setError('');
    
    // Redirect based on current path or provided path
    if (window.location.pathname.startsWith('/admin')) {
      window.location.href = '/admin/login';
    } else {
      window.location.href = redirectPath;
    }
  };

  const clearError = () => {
    setError('');
  };

  const updateUser = (updatedUserData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedUserData
    }));
    
    // Also update localStorage
    const storedUser = JSON.parse(localStorage.getItem('user_data') || '{}');
    localStorage.setItem('user_data', JSON.stringify({
      ...storedUser,
      ...updatedUserData
    }));
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  const value = {
    user,
    loading,
    error,
    initialCheckDone, // Add this new property
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    checkAuth,
    updateUser,
    hasRole,
    isAdmin,
    setError: clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};