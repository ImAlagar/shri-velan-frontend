import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { 
  FiHome, 
  FiPackage, 
  FiPlusSquare, 
  FiFolderPlus, 
  FiMail,
  FiLogOut,
  FiSettings,
  FiUser,
  FiShoppingBag,
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
  FiCode
} from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import logo from '../../../assets/logo.png';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const location = useLocation();
  const [userData] = useState({
    name: "Admin User",
    role: "Administrator",
    avatar: null
  });

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      if (mobile) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsOpen]);

  const menuItems = [
    { 
      name: "Dashboard", 
      icon: <FiHome size={20} />, 
      path: "/admin" 
    },
    { 
      name: "Products", 
      icon: <FiPackage size={20} />, 
      path: "/admin/products" 
    },
    { 
      name: "Categories", 
      icon: <FiFolderPlus size={20} />, 
      path: "/admin/categories" 
    },
    { 
      name: "Orders", 
      icon: <FiShoppingBag size={20} />, 
      path: "/admin/orders" 
    },
    { 
      name: "Users", 
      icon: <FiUsers size={20} />, 
      path: "/admin/users" 
    },
    { 
      name: "Contact", 
      icon: <FiMail size={20} />, 
      path: "/admin/contact" 
    },
        { 
      name: "Coupons", 
      icon: <FiCode size={20} />, 
      path: "/admin/coupons" 
    },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("adminSidebarOpen");
    window.location.href = "/admin/login";
  };

  const isActiveLink = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setIsOpen(!isOpen);
    }
  };

  if (!isOpen && !isMobile) return null;

  return (
    <>
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.aside
            initial={{ x: isMobile ? -300 : 0, opacity: isMobile ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed lg:relative z-50 w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col h-screen transition-all duration-300 flex-shrink-0"
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6  border-gray-200 bg-white flex-shrink-0">
              <div className="flex items-center space-x-3">
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="w-8 h-8 object-contain"
                />
                <span className="text-xl font-bold text-gray-800">velan store</span>
              </div>
              
              {!isMobile && (
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden lg:block"
                >
                  <FiChevronLeft 
                    size={16} 
                    className="text-gray-600" 
                  />
                </button>
              )}
              {isMobile && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <RxCross2 size={20} className="text-gray-600" />
                </button>
              )}
            </div>



            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = isActiveLink(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => {
                      if (isMobile) {
                        setIsOpen(false);
                      }
                    }}
                    className={`w-full flex items-center justify-start space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                      isActive
                        ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className={`${
                      isActive ? "text-blue-600" : "text-gray-400"
                    } group-hover:text-current`}>
                      {item.icon}
                    </div>
                    <span className="font-medium flex-1">{item.name}</span>
                    {isActive && (
                      <FiChevronRight size={16} className="text-blue-600" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-200 space-y-2 flex-shrink-0">
              <Link 
                to="/admin/settings"
                className="w-full flex items-center justify-start space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group"
              >
                <FiSettings size={20} className="text-gray-400 group-hover:text-current" />
                <span className="font-medium">Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-start space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 group"
              >
                <FiLogOut size={20} className="text-red-400 group-hover:text-current" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;