import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiChevronRight, FiUser, FiBell, FiLogOut, FiSettings } from "react-icons/fi";
import { useAuth } from "../../../hooks/useAuth";

const AdminHeader = ({ onMenuClick, sidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/admin/login');
  };

  const handleProfileClick = () => {
    setDropdownOpen(false);
    navigate('/admin/profile');
  };

  const handleSettingsClick = () => {
    setDropdownOpen(false);
    navigate('/admin/settings');
  };

  // Get current page title from pathname
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/admin") return "Dashboard";
    if (path === "/admin/products") return "Products";
    if (path === "/admin/products/add") return "Add Product";
    if (path === "/admin/categories") return "Categories";
    if (path === "/admin/orders") return "Orders";
    if (path === "/admin/users") return "Users";
    if (path === "/admin/contact") return "Contact";
    if (path === "/admin/settings") return "Settings";
    if (path === "/admin/profile") return "My Profile";
    return "Dashboard";
  };

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === "/admin") return ["Dashboard"];
    if (path === "/admin/products") return ["Products", "All Products"];
    if (path === "/admin/products/add") return ["Products", "Add Product"];
    if (path === "/admin/categories") return ["Categories"];
    if (path === "/admin/orders") return ["Orders"];
    if (path === "/admin/users") return ["Users"];
    if (path === "/admin/contact") return ["Contact"];
    if (path === "/admin/settings") return ["Settings"];
    if (path === "/admin/profile") return ["Profile"];
    return ["Dashboard"];
  };

  const breadcrumb = getBreadcrumb();
  const currentPageTitle = getPageTitle();

  // Get user display data
  const getUserData = () => {
    if (!user) {
      return {
        name: "Admin User",
        email: "",
        role: "Administrator",
        avatar: null
      };
    }

    return {
      name: user.name || user.fullName || "Admin User",
      email: user.email || "",
      role: user.role || "Administrator",
      avatar: user.avatar || null
    };
  };

  const userData = getUserData();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="flex items-center justify-between p-3 sm:p-4">
        {/* Left Section - Menu & Breadcrumb */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden flex-shrink-0"
            aria-label="Toggle menu"
          >
            <RxHamburgerMenu size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
          
          {/* Desktop menu button - Only when sidebar is closed */}
          {!sidebarOpen && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden lg:block flex-shrink-0"
              aria-label="Toggle menu"
            >
              <RxHamburgerMenu size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          )}
          
          {/* Page Title for Mobile */}
          <div className="lg:hidden min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {currentPageTitle}
            </h1>
            {breadcrumb.length > 1 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {breadcrumb[breadcrumb.length - 2]}
              </p>
            )}
          </div>

          {/* Breadcrumb - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 min-w-0 flex-1">
            <span className="font-medium text-gray-900 dark:text-white truncate">Admin</span>
            {breadcrumb.map((item, index) => (
              <React.Fragment key={item}>
                <FiChevronRight size={14} className="flex-shrink-0" />
                <span className={`truncate ${
                  index === breadcrumb.length - 1 
                    ? "text-blue-600 dark:text-blue-400 font-medium" 
                    : "text-gray-500 dark:text-gray-400"
                }`}>
                  {item}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right Section - Notifications & User Menu */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">


          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 sm:space-x-3 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {/* User Info - Hidden on mobile, visible on sm and up */}
              <div className="hidden sm:block text-right min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px] lg:max-w-[140px]">
                  {userData.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px] lg:max-w-[140px]">
                  {userData.role}
                </p>
              </div>
              
              {/* User Avatar */}
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                {userData.avatar ? (
                  <img 
                    src={userData.avatar} 
                    alt={userData.name} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <FiUser size={16} className="text-white" />
                )}
              </div>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {userData.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {userData.email}
                  </p>
                </div>
                <button
                  onClick={handleProfileClick}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiUser size={16} className="mr-3" />
                  My Profile
                </button>
                <button
                  onClick={handleSettingsClick}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiSettings size={16} className="mr-3" />
                  Settings
                </button>
                <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <FiLogOut size={16} className="mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Breadcrumb */}
      {breadcrumb.length > 2 && (
        <div className="lg:hidden px-3 pb-3 -mt-2">
          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 overflow-x-auto hide-scrollbar">
            {breadcrumb.slice(0, -1).map((item, index) => (
              <React.Fragment key={item}>
                <span className="truncate">{item}</span>
                {index < breadcrumb.length - 2 && (
                  <FiChevronRight size={12} className="flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {dropdownOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default AdminHeader;