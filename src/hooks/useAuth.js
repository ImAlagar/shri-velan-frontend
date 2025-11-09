// hooks/useAuth.js - UPDATED
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, loading, error, initialCheckDone } = context;

  return {
    user,
    loading,
    initialCheckDone, // Add this
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isUser: user?.role === 'USER',
    error,
    register: context.register,
    login: context.login,
    logout: context.logout,
    forgotPassword: context.forgotPassword,
    resetPassword: context.resetPassword,
    checkAuth: context.checkAuth,
    updateUser: context.updateUser,
    setError: context.setError
  };
};