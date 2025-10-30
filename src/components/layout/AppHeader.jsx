import React from 'react'
import { useLocation } from 'react-router-dom'
import AdminHeader from '../admin/auth/AdminHeader';
import MainHeader from './Header/MainHeader';
import { useAuth } from '../../hooks/useAuth';

const AppHeader = ({ onMenuClick, sidebarOpen }) => {
  const location = useLocation();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Don't show header on login pages
  if (location.pathname.includes('/login')) {
    return null;
  }

  // Show loading state or nothing while checking auth
  if (isLoading) {
    return null;
  }

  if (isAdminRoute && isAuthenticated && isAdmin) {
    return <AdminHeader onMenuClick={onMenuClick} sidebarOpen={sidebarOpen} />;
  }
  
  return <MainHeader />;
}

export default AppHeader;