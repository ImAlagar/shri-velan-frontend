import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import Input from '../../../components/ui/Input';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Shield, ArrowLeft, LogIn, User, Lock } from 'lucide-react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  
  const { login, isLoading, error: authError, setError } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Clear auth error when user starts typing
    if (authError) {
      setError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Pass 'ADMIN' as required role - only ADMIN users can login here
      await login(formData, 'ADMIN');
      
      // Redirect to admin dashboard
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
      
    } catch (err) {
      // Error is already handled in the auth hook
      console.error('Admin login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnToCustomerPortal = () => {
    navigate('/');
  };

  const handleGoToUserLogin = () => {
    navigate('/login');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const slideInVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    tap: { scale: 0.98 },
    loading: { scale: 0.99 }
  };

  const iconVariants = {
    hover: { 
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen flex gap-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
    >
      {/* Left side - Brand Section with Background Image */}
      <motion.div 
        variants={slideInVariants}
        className="hidden lg:flex lg:w-1/2 items-center justify-center relative bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")'
        }}
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"
        />
        
        <motion.div 
          variants={itemVariants}
          className="text-center max-w-md z-10 relative"
        >
          <motion.div 
            className="mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <h1 className="text-5xl font-Italiana font-bold text-white mb-4 leading-tight">
              Shri Velan<br />Organic Foods
            </h1>
            <motion.p 
              className="text-xl text-gray-300 font-SpaceGrotesk mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              Secure Admin Access
            </motion.p>
          </motion.div>
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-6 shadow-2xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <motion.h2 
              className="text-2xl font-semibold mb-4 text-primary flex items-center justify-center gap-3"
              variants={iconVariants}
            >
              <Shield className="w-7 h-7" />
              Administrator Portal
            </motion.h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              This portal is exclusively for authorized administrators. Customer accounts cannot access this area.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <motion.div 
          variants={itemVariants}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl w-full max-w-md p-8 hover:shadow-3xl transition-all duration-500"
        >
          {/* Header */}
          <motion.div 
            variants={itemVariants}
            className="text-center mb-8"
          >
            <motion.div 
              className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.span 
                className="text-3xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }}
              >
                🔐
              </motion.span>
            </motion.div>
            <motion.h2 
              className="text-3xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Admin Login
            </motion.h2>
            <motion.p 
              className="text-gray-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Restricted administrator access only
            </motion.p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {authError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm overflow-hidden"
              >
                {authError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Input
                label="Admin Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@shrivelan.com"
                error={errors.email}
                required
                icon={<User className="w-4 h-4" />}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Input
                label="Admin Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your admin password"
                error={errors.password}
                required
                icon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </motion.button>
                }
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={isLoading || isSubmitting}
                variants={buttonVariants}
                initial="initial"
                whileHover={!(isLoading || isSubmitting) ? "hover" : "loading"}
                whileTap="tap"
                className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                {/* Animated background */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                
                {/* Button content */}
                <div className="relative z-10 flex items-center justify-center space-x-3">
                  {(isLoading || isSubmitting) ? (
                    <>
                      {/* Professional loading animation */}
                      <div className="flex items-center justify-center space-x-1">
                        <motion.div
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [1, 0.7, 1],
                          }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="w-2 h-2 bg-white rounded-full"
                        />
                        <motion.div
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [1, 0.7, 1],
                          }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.2,
                          }}
                          className="w-2 h-2 bg-white rounded-full"
                        />
                        <motion.div
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [1, 0.7, 1],
                          }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.4,
                          }}
                          className="w-2 h-2 bg-white rounded-full"
                        />
                      </div>
                      <span className="font-medium">Securing Access...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">Access Admin Dashboard</span>
                    </>
                  )}
                </div>
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Action Buttons */}
          <motion.div 
            className="mt-8 space-y-3 text-center"
            variants={containerVariants}
          >
            <motion.button
              onClick={handleReturnToCustomerPortal}
              className="text-white/80 hover:text-white transition-all duration-300 text-sm font-medium py-3 px-4 rounded-xl border border-white/30 hover:border-white/50 bg-primary hover:bg-primary backdrop-blur-sm w-full group flex items-center justify-center gap-2"
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Return to Customer Portal
            </motion.button>
            
            <motion.button
              onClick={handleGoToUserLogin}
              className="text-white/60 hover:text-white transition-all duration-300 text-sm font-medium py-3 px-4 rounded-xl border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 backdrop-blur-sm w-full group flex items-center justify-center gap-2"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <User className="w-4 h-4" />
              Customer Login
              <motion.span
                className="group-hover:translate-x-1 transition-transform"
              >
                →
              </motion.span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminLogin;