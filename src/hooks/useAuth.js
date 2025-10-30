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
    isLoading: loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    error,
    login: context.login,
    logout: context.logout,
    setError: context.setError
  };
};