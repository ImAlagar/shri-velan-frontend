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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

        {/* Desktop Account / Login (visible only lg and above) */}
        <div className="hidden lg:block relative z-50">
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

        {/* Hamburger (visible md and below) */}
        <div className="lg:hidden flex items-center z-50">
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
