import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiUser, FiSettings, FiLogOut, FiChevronDown, FiShoppingBag, FiHome, FiInfo, FiMail } from "react-icons/fi";
import { useAuth } from "../../../hooks/useAuth";
import Topbar from "../Topbar";

const MainHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { name: "Home", path: "/", icon: FiHome },
    { name: "About Us", path: "/about", icon: FiInfo },
    { name: "Products", path: "/products", icon: FiShoppingBag },
    { name: "Combo Products", path: "/combo-products", icon: FiShoppingBag },
    { name: "Contact Us", path: "/contact", icon: FiMail },
  ];

  const getUserDisplayName = () => {
    if (!user) return "My Account";
    return user.name || user.fullName || user.email?.split('@')[0] || "My Account";
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  const navItemVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`bg-white text-gray-900 shadow-md sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-xl bg-white/95 backdrop-blur-md' : 'shadow-md'
      }`}
    >
      <Topbar />
      <div className="container mx-auto flex justify-between items-center px-5 md:px-12 py-4 relative">
        {/* Logo */}
        <motion.a 
          href="/" 
          className="flex items-center z-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <img src={logo} alt="Company Logo" className="h-10 w-auto" />
        </motion.a>

        {/* Desktop Links */}
        <motion.ul 
          className="hidden font-SpaceGrotesk tracking-wider lg:flex gap-6 items-center font-medium"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {navItems.map((item, index) => (
            <motion.li key={item.path} variants={itemVariants}>
              <motion.a
                href={item.path}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg"
                    : "hover:text-primary hover:bg-gray-50/80"
                }`}
                whileHover="hover"
                whileTap="tap"
                variants={navItemVariants}
              >
                <item.icon size={16} />
                {item.name}
              </motion.a>
            </motion.li>
          ))}
        </motion.ul>

        {/* Desktop Login / My Account - FIXED Z-INDEX */}
        <motion.div 
          className="hidden lg:block relative z-50"
          variants={itemVariants}
        >
          {!isAuthenticated ? (
            <motion.button
              onClick={handleLoginClick}
              className="border-2 border-primary bg-transparent hover:bg-primary font-SpaceGrotesk tracking-widest text-primary hover:text-white cursor-pointer px-6 py-2.5 rounded-xl transition-all duration-300 font-medium"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
          ) : (
            <div className="relative">
              <motion.button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-gradient-to-r from-primary to-primary/90 text-white px-6 py-2.5 rounded-xl flex items-center gap-3 transition-all duration-300 hover:shadow-lg hover:from-primary/90 hover:to-primary font-medium z-50 relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiUser size={18} />
                {getUserDisplayName()}
                <motion.span
                  animate={{ rotate: dropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FiChevronDown size={16} />
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <>
                    {/* Backdrop overlay */}
                    <motion.div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setDropdownOpen(false)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                    
                    {/* Dropdown menu - HIGHER Z-INDEX */}
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md bg-white/95 z-50"
                    >
                      <motion.button
                        onClick={handleProfileClick}
                        className="flex items-center w-full px-4 py-4 text-gray-700 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 group cursor-pointer"
                        whileHover={{ x: 5 }}
                      >
                        <FiUser size={18} className="mr-3 text-primary group-hover:scale-110 transition-transform" />
                        <span className="font-medium">My Profile</span>
                      </motion.button>
                      <motion.button
                        onClick={handleOrdersClick}
                        className="flex items-center w-full px-4 py-4 text-gray-700 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 group cursor-pointer"
                        whileHover={{ x: 5 }}
                      >
                        <FiSettings size={18} className="mr-3 text-primary group-hover:scale-110 transition-transform" />
                        <span className="font-medium">My Orders</span>
                      </motion.button>
                      <motion.button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-4 text-red-600 hover:bg-red-50 transition-all duration-200 group cursor-pointer"
                        whileHover={{ x: 5 }}
                      >
                        <FiLogOut size={18} className="mr-3 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Logout</span>
                      </motion.button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden flex items-center z-50">
          <motion.button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-900 text-2xl focus:outline-none relative w-12 h-12 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <FiX size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <FiMenu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="lg:hidden bg-white/95 backdrop-blur-md absolute top-full left-0 w-full shadow-2xl border-t border-gray-200 overflow-hidden z-50"
          >
            <motion.ul 
              className="flex flex-col items-start gap-2 tracking-widest px-6 py-6 text-gray-900 font-medium"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {navItems.map((item, index) => (
                <motion.li key={item.path} className="w-full" variants={itemVariants}>
                  <motion.a
                    href={item.path}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 w-full px-4 py-4 rounded-xl transition-all duration-300 ${
                      location.pathname === item.path
                        ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg"
                        : "hover:text-primary hover:bg-gray-50"
                    }`}
                    whileHover={{ x: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </motion.a>
                </motion.li>
              ))}

              <motion.div className="w-full border-t border-gray-200 my-4 pt-4" variants={itemVariants}>
                {!isAuthenticated ? (
                  <motion.li className="w-full">
                    <motion.button
                      onClick={handleLoginClick}
                      className="bg-gradient-to-r from-primary to-primary/90 text-white w-full px-4 py-4 rounded-xl flex items-center justify-center gap-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiUser size={18} />
                      Login to Account
                    </motion.button>
                  </motion.li>
                ) : (
                  <>
                    <motion.li className="w-full mb-4" variants={itemVariants}>
                      <div className="px-4 py-3 text-sm text-gray-500 bg-gray-50 rounded-lg">
                        Welcome back, <span className="font-semibold text-primary">{getUserDisplayName()}</span>
                      </div>
                    </motion.li>
                    <motion.li className="w-full" variants={itemVariants}>
                      <motion.button
                        onClick={handleProfileClick}
                        className="flex items-center w-full px-4 py-4 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 group cursor-pointer"
                        whileHover={{ x: 5 }}
                      >
                        <FiUser size={18} className="mr-3 text-primary group-hover:scale-110 transition-transform" />
                        My Profile
                      </motion.button>
                    </motion.li>
                    <motion.li className="w-full" variants={itemVariants}>
                      <motion.button
                        onClick={handleOrdersClick}
                        className="flex items-center w-full px-4 py-4 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 group cursor-pointer"
                        whileHover={{ x: 5 }}
                      >
                        <FiSettings size={18} className="mr-3 text-primary group-hover:scale-110 transition-transform" />
                        My Orders
                      </motion.button>
                    </motion.li>
                    <motion.li className="w-full" variants={itemVariants}>
                      <motion.button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-4 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group cursor-pointer"
                        whileHover={{ x: 5 }}
                      >
                        <FiLogOut size={18} className="mr-3 group-hover:scale-110 transition-transform" />
                        Logout
                      </motion.button>
                    </motion.li>
                  </>
                )}
              </motion.div>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default MainHeader;