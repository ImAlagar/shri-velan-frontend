import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiShoppingBag,
  FiHome,
  FiInfo,
  FiMail,
  FiSearch,
  FiXCircle,
} from "react-icons/fi";
import { useAuth } from "../../../hooks/useAuth";
import Topbar from "../Topbar";

const MainHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchOpen && !event.target.closest('.search-container')) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate("/");
  };

  const handleOrdersClick = () => {
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate("/orders");
  };

  const handleLoginClick = () => {
    setMenuOpen(false);
    navigate("/login");
  };

  const handleLinkClick = () => setMenuOpen(false);

  const getUserDisplayName = () => {
    if (!user) return "My Account";
    return (
      user.name ||
      user.fullName ||
      user.email?.split("@")[0] ||
      "My Account"
    );
  };

  const navItems = [
    { name: "Home", path: "/", icon: FiHome },
    { name: "About Us", path: "/about", icon: FiInfo },
    { name: "Products", path: "/products", icon: FiShoppingBag },
    { name: "Combo Products", path: "/combo-products", icon: FiShoppingBag },
    { name: "Contact Us", path: "/contact", icon: FiMail },
  ];

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25 } },
  };

  const mobileMenuVariants = {
    closed: { opacity: 0, height: 0 },
    open: { opacity: 1, height: "auto", transition: { duration: 0.4 } },
  };

  const searchVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`sticky top-0 z-50 bg-white text-gray-900 transition-all duration-300 ${
        scrolled ? "shadow-xl bg-white/95 backdrop-blur-md" : "shadow-md"
      }`}
    >
      <Topbar />

      {/* Main Container */}
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-12 py-4 relative">
        {/* Logo */}
        <motion.a
          href="/"
          className="flex items-center z-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={logo}
            alt="Company Logo"
            className="h-8 sm:h-9 md:h-10 lg:h-11 w-auto"
          />
        </motion.a>

        {/* Desktop Nav (visible only lg and above) */}
        <motion.ul
          className="hidden lg:flex items-center gap-5 xl:gap-6 font-SpaceGrotesk tracking-wide font-medium"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {navItems.map((item) => (
            <motion.li key={item.path} variants={itemVariants}>
              <motion.a
                href={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm xl:text-base transition-all duration-300 ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg"
                    : "hover:text-primary hover:bg-gray-50/80"
                }`}
              >
                <item.icon className="size-4" />
                {item.name}
              </motion.a>
            </motion.li>
          ))}
        </motion.ul>

        {/* Desktop Right Section - Search + Account (visible only lg and above) */}
        <div className="hidden lg:flex items-center gap-4 relative z-50">
          {/* Search Button - Large Screens */}
          <motion.button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 hover:border-primary hover:bg-gray-50 transition-all duration-300 text-gray-600 hover:text-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiSearch className="size-4" />
            <span className="text-sm">Search...</span>
            <kbd className="hidden xl:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-mono bg-gray-100 border border-gray-300 rounded">
              ⌘K
            </kbd>
          </motion.button>

          {!isAuthenticated ? (
            <motion.button
              onClick={handleLoginClick}
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-5 py-2 rounded-xl font-medium transition-all duration-300 text-sm xl:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
          ) : (
            <div className="relative">
              <motion.button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-gradient-to-r from-primary to-primary/90 text-white px-5 py-2 rounded-xl flex items-center gap-2 font-medium hover:shadow-lg transition-all duration-300"
              >
                <FiUser className="size-4" />
                <span>{getUserDisplayName()}</span>
                <motion.span
                  animate={{ rotate: dropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FiChevronDown className="size-3" />
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute right-0 mt-3 w-52 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                    <motion.button
                      onClick={handleOrdersClick}
                      className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 text-sm"
                    >
                      <FiSettings className="size-4 mr-2 text-primary" />
                      My Orders
                    </motion.button>
                    <motion.button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 text-sm"
                    >
                      <FiLogOut className="size-4 mr-2" />
                      Logout
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile Right Section - Search + Hamburger (visible md and below) */}
        <div className="lg:hidden flex items-center gap-3 z-50">
          {/* Search Button - Mobile */}
          <motion.button
            onClick={() => setSearchOpen(true)}
            className="text-gray-600 hover:text-primary transition-colors p-2 rounded-lg hover:bg-gray-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiSearch className="size-5" />
          </motion.button>

          {/* Hamburger */}
          <motion.button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-900 text-2xl w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </motion.button>
        </div>
      </div>

      {/* Global Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
          >
            <motion.div
              variants={searchVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="search-container bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center px-6 py-4 border-b border-gray-100">
                  <FiSearch className="text-gray-400 size-5 mr-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products, categories..."
                    className="flex-1 text-lg bg-transparent border-none outline-none placeholder-gray-400"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      <FiXCircle className="size-5" />
                    </button>
                  )}
                </div>
                
                <div className="p-4 bg-gray-50 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Press Enter to search
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!searchQuery.trim()}
                      className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </form>

              {/* Quick Suggestions (optional) */}
              <div className="p-4 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {["Organic Rice", "Spices", "Oil", "Flour", "Snacks"].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        // Optionally auto-search or just fill the input
                      }}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu (visible md and below) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="lg:hidden bg-white/95 backdrop-blur-md absolute top-full left-0 w-full shadow-2xl border-t border-gray-200 z-40 overflow-hidden"
          >
            <motion.ul
              className="flex flex-col gap-2 px-4 py-5 font-medium text-gray-900"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {navItems.map((item) => (
                <motion.li key={item.path} variants={itemVariants}>
                  <motion.a
                    href={item.path}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm transition-all duration-300 ${
                      location.pathname === item.path
                        ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg"
                        : "hover:bg-gray-50 hover:text-primary"
                    }`}
                  >
                    <item.icon className="size-4" />
                    {item.name}
                  </motion.a>
                </motion.li>
              ))}

              {/* Mobile Search Button */}
              <motion.button
                onClick={() => {
                  setMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm hover:bg-gray-50 hover:text-primary transition-all duration-300 border border-gray-200 mt-2"
              >
                <FiSearch className="size-4" />
                Search Products
              </motion.button>

              {/* Auth buttons */}
              <div className="border-t border-gray-200 mt-3 pt-3">
                {!isAuthenticated ? (
                  <motion.button
                    onClick={handleLoginClick}
                    className="w-full bg-gradient-to-r from-primary to-primary/90 text-white px-4 py-3 rounded-lg shadow-md text-sm"
                  >
                    <FiUser className="inline mr-2" />
                    Login to Account
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      onClick={handleOrdersClick}
                      className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
                    >
                      <FiSettings className="size-4 mr-2 text-primary" />
                      My Orders
                    </motion.button>
                    <motion.button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-sm"
                    >
                      <FiLogOut className="size-4 mr-2" />
                      Logout
                    </motion.button>
                  </>
                )}
              </div>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default MainHeader;