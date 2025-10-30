import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader';
import Footer from '../components/layout/Footer/Footer';
import ScrollToTop from '../components/Common/ScrollToTop';

const MainLayout = () => {
  const location = useLocation();
  
  const hideFooterRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/admin'];
  const shouldHideFooter = hideFooterRoutes.some(route => location.pathname.includes(route));

  return (
    <div className='min-h-screen flex flex-col bg-white dark:bg-gray-900 smokey:bg-gray-800 transition-colors duration-300'>
       <AppHeader />
       <ScrollToTop />
       <main className='flex-1'>
        <Outlet />
       </main>

       {!shouldHideFooter && <Footer />}
    </div>
  )
}

export default MainLayout