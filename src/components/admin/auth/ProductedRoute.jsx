// components/ProtectedRoute.jsx - UPDATED
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, initialCheckDone, user, isAdmin } = useAuth();
  const location = useLocation();

  // Wait for initial auth check to complete
  if (loading || !initialCheckDone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
      if (requiredRole === 'admin') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

    return <Navigate to="/" replace />;
  }

  // Check role-based access
  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;