// layouts/AdminLayout.jsx
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/auth/AdminSidebar';
import AdminHeader from '../components/admin/auth/AdminHeader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
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

        {/* ✅ Global Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{
            marginTop: '70px',
            zIndex: 10000,
          }}
          toastStyle={{
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            minHeight: '50px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
          progressStyle={{
            background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
          }}
        />
    </div>
  )
}

export default AdminLayout