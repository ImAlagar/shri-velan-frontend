import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';
import AddProducts from '../../../components/Dashboard/AddProducts';
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";
import AllProducts from '../../../components/Dashboard/AllProducts';
import CreateCategory from '../../../components/Dashboard/CreateCategory';
import DashboardContent from '../../../components/Dashboard/DashboardContent';
import DashboardContact from '../../../components/Dashboard/DashboardContact';
import { 
  FiHome, 
  FiPackage, 
  FiPlusSquare, 
  FiFolderPlus, 
  FiMail,
  FiLogOut,
  FiSettings,
  FiUser,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";

export default function Dashboard() {
  // State for active tab
  const [activeTab, setActiveTabState] = useState(
    sessionStorage.getItem("activeTab") || "Dashboard"
  );
  const [tabData, setTabData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    localStorage.getItem("sidebarOpen") === "true" || window.innerWidth >= 1024
  );
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isCollapsed, setIsCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true" && window.innerWidth >= 1024
  );
  const [userData, setUserData] = useState({
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
        setIsSidebarOpen(false);
        setIsCollapsed(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save sidebar states to localStorage
  useEffect(() => {
    localStorage.setItem("sidebarOpen", isSidebarOpen);
  }, [isSidebarOpen]);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isCollapsed);
  }, [isCollapsed]);

  // Whenever activeTab changes → update sessionStorage
  useEffect(() => {
    sessionStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // Custom function to switch tabs and pass optional data
  const handleSetActiveTab = (tabName, data = null) => {
    setActiveTabState(tabName);
    setTabData(data);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: <FiHome size={20} /> },
    { name: "All Products", icon: <FiPackage size={20} /> },
    { name: "Add Products", icon: <FiPlusSquare size={20} /> },
    { name: "Create Category", icon: <FiFolderPlus size={20} /> },
    { name: "Contact Details", icon: <FiMail size={20} /> },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("activeTab");
    window.location.href = "/dashboard-login";
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardContent />;
      case "All Products":
        return <AllProducts />;
      case "Add Products":
        return <AddProducts setActiveTab={handleSetActiveTab} productData={tabData} />;
      case "Create Category":
        return <CreateCategory />;
      case "Contact Details":
        return <DashboardContact />;
      default:
        return <DashboardContent />;
    }
  };

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || !isMobile) && (
          <motion.aside
            initial={{ x: isMobile ? -300 : 0, opacity: isMobile ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`fixed lg:relative z-50 ${sidebarWidth} bg-white shadow-xl border-r border-gray-200 flex flex-col h-screen transition-all duration-300 flex-shrink-0`}
          >
            {/* Sidebar Header */}
            <div className={`flex items-center ${isCollapsed ? 'justify-center p-4' : 'justify-between p-6'} border-b border-gray-200 bg-white flex-shrink-0`}>
              {!isCollapsed && (
                <div className="flex items-center space-x-3">
                  <img 
                    src={logo} 
                    alt="Logo" 
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-xl font-bold text-gray-800">velan store</span>
                </div>
              )}
              {isCollapsed && (
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="w-8 h-8 object-contain"
                />
              )}
              {!isMobile && (
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden lg:block"
                >
                  <FiChevronLeft 
                    size={16} 
                    className={`text-gray-600 transition-transform duration-300 ${
                      isCollapsed ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
              )}
              {isMobile && (
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <RxCross2 size={20} className="text-gray-600" />
                </button>
              )}
            </div>

            {/* User Profile - Only show when not collapsed */}
            {!isCollapsed && (
              <div className="p-6 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    {userData.avatar ? (
                      <img 
                        src={userData.avatar} 
                        alt="User" 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <FiUser size={24} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {userData.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {userData.role}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Collapsed User Avatar */}
            {isCollapsed && (
              <div className="p-4 border-b border-gray-200 flex justify-center flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  {userData.avatar ? (
                    <img 
                      src={userData.avatar} 
                      alt="User" 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <FiUser size={20} className="text-white" />
                  )}
                </div>
              </div>
            )}

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleSetActiveTab(item.name)}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center px-3' : 'justify-start space-x-3 px-4'
                  } py-3 rounded-xl text-left transition-all duration-200 group ${
                    activeTab === item.name
                      ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className={`${
                    activeTab === item.name ? "text-blue-600" : "text-gray-400"
                  } group-hover:text-current`}>
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <>
                      <span className="font-medium flex-1">{item.name}</span>
                      {activeTab === item.name && (
                        <FiChevronRight size={16} className="text-blue-600" />
                      )}
                    </>
                  )}
                </button>
              ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-200 space-y-2 flex-shrink-0">
              <button className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-3' : 'justify-start space-x-3 px-4'
              } py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group`}>
                <FiSettings size={20} className="text-gray-400 group-hover:text-current" />
                {!isCollapsed && <span className="font-medium">Settings</span>}
              </button>
              <button
                onClick={handleLogout}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center px-3' : 'justify-start space-x-3 px-4'
                } py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 group`}
              >
                <FiLogOut size={20} className="text-red-400 group-hover:text-current" />
                {!isCollapsed && <span className="font-medium">Logout</span>}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                <RxHamburgerMenu size={20} className="text-gray-600" />
              </button>
              
              {/* Show toggle button on desktop when sidebar is collapsed */}
              {!isMobile && isCollapsed && (
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden lg:block"
                >
                  <RxHamburgerMenu size={20} className="text-gray-600" />
                </button>
              )}
              
              {/* Breadcrumb */}
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className="font-medium text-gray-900">Dashboard</span>
                <FiChevronRight size={16} />
                <span className="text-blue-600 font-medium">{activeTab}</span>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-2 h-2 bg-red-500 rounded-full absolute top-2 right-2"></div>
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-3.79 1.44 5.97 5.97 0 01-3.79-1.44M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                  <p className="text-xs text-gray-500">{userData.role}</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  {userData.avatar ? (
                    <img 
                      src={userData.avatar} 
                      alt="User" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <FiUser size={16} className="text-white" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6 h-full">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{activeTab}</h1>
              <p className="text-gray-600">
                {activeTab === "Dashboard" && "Overview of your store and analytics"}
                {activeTab === "All Products" && "Manage and view all your products"}
                {activeTab === "Add Products" && "Add new products to your store"}
                {activeTab === "Create Category" && "Create and manage product categories"}
                {activeTab === "Contact Details" && "Manage your contact information"}
              </p>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}