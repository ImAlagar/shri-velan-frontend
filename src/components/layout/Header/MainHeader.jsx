import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../../hooks/useAuth";
import Topbar from "../Topbar";

const MainHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate('/profile');
  };

  const handleOrdersClick = () => {
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate('/orders');
  };

  const handleLoginClick = () => {
    setMenuOpen(false);
    navigate('/login');
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Products", path: "/products" },
    { name: "Combo Products", path: "/combo-products" },
    { name: "Contact Us", path: "/contact" },
  ];

  const getUserDisplayName = () => {
    if (!user) return "My Account";
    return user.name || user.fullName || user.email?.split('@')[0] || "My Account";
  };

  return (
    <nav className="bg-white text-gray-900 shadow-md sticky top-0 z-50 transition-all duration-300">
      <Topbar />
      <div className="container mx-auto flex justify-between items-center px-5 md:px-12 py-4 relative">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img src={logo} alt="Company Logo" className="h-10 w-auto" />
        </a>

        {/* Desktop Links */}
        <ul className="hidden font-SpaceGrotesk tracking-wider lg:flex gap-8 items-center font-medium">
          {navItems.map((item) => (
            <li key={item.path}>
              <a
                href={item.path}
                className={`px-3 py-2 rounded-md transition duration-200 ${
                  location.pathname === item.path
                    ? "bg-primary text-white"
                    : "hover:text-primary"
                }`}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Login / My Account */}
        <div className="hidden lg:block relative">
          {!isAuthenticated ? (
            <button
              onClick={handleLoginClick}
              className="border border-primary hover:bg-primary font-SpaceGrotesk tracking-widest text-primary hover:text-white cursor-pointer px-4 py-2 rounded transition"
            >
              Login
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 transition hover:bg-primary-dark"
              >
                <FiUser size={16} />
                {getUserDisplayName()} ▾
              </button>

              <div className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-200 origin-top-right ${
                dropdownOpen
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}>
                <button
                  onClick={handleProfileClick}
                  className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                  <FiUser size={16} className="mr-3" />
                  My Profile
                </button>
                <button
                  onClick={handleOrdersClick}
                  className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                  <FiSettings size={16} className="mr-3" />
                  My Orders
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut size={16} className="mr-3" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-900 text-3xl focus:outline-none relative w-10 h-10 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FiX />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FiMenu />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden bg-white absolute min-h-screen top-full left-0 w-full shadow-lg transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-w-full opacity-100 py-4" : "max-w-0 opacity-0 py-0"
        }`}
      >
        <ul className="flex flex-col justify-between items-start h-full gap-6 tracking-widest px-6 text-gray-900 font-medium">
          {navItems.map((item) => (
            <li key={item.path} className="w-full">
              <a
                href={item.path}
                onClick={handleLinkClick}
                className={`block w-full px-4 py-3 rounded-md transition duration-200 ${
                  location.pathname === item.path
                    ? "bg-primary text-white"
                    : "hover:text-primary hover:bg-gray-50"
                }`}
              >
                {item.name}
              </a>
            </li>
          ))}

          {!isAuthenticated ? (
            <li className="w-full mt-4">
              <button
                onClick={handleLoginClick}
                className="bg-primary font-SpaceGrotesk tracking-widest cursor-pointer w-full text-white px-4 py-3 rounded-lg block text-center hover:bg-primary-dark"
              >
                Login
              </button>
            </li>
          ) : (
            <>
              <li className="w-full border-t border-gray-200 pt-4 mt-2">
                <div className="px-4 py-2 text-sm text-gray-500">
                  Welcome, {getUserDisplayName()}
                </div>
              </li>
              <li className="w-full">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <FiUser size={18} className="mr-3" />
                  My Profile
                </button>
              </li>
              <li className="w-full">
                <button
                  onClick={handleOrdersClick}
                  className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <FiSettings size={18} className="mr-3" />
                  My Orders
                </button>
              </li>
              <li className="w-full">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <FiLogOut size={18} className="mr-3" />
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Close dropdown when clicking outside */}
      {dropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </nav>
  );
};

export default MainHeader;