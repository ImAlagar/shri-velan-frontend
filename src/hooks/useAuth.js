// hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, loading, error } = context;

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    error,
    register: context.register,
    login: context.login,
    logout: context.logout,
    forgotPassword: context.forgotPassword, // ADD THIS
    resetPassword: context.resetPassword,   // ADD THIS
    setError: context.setError
  };
};