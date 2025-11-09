// layouts/AdminLayout.jsx - UPDATED
import React, { useState } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Add this import
import AdminSidebar from '../components/admin/auth/AdminSidebar';
import AdminHeader from '../components/admin/auth/AdminHeader';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isAuthenticated, loading, initialCheckDone, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading while checking auth
  if (loading || !initialCheckDone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <div className='flex h-screen bg-gray-50 dark:bg-gray-900 smokey:bg-gray-800 transition-colors duration-300'>
        <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen}/>
        
        {/* Main Content */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'ml-82' : 'ml-0'
        }`}>
          <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          
          {/* Admin Outlet */}
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
    </div>
  )
}

export default AdminLayout;