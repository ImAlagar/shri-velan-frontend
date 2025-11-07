import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Helmet } from 'react-helmet';
import Input from '../../../components/ui/Input';
import { Eye, EyeOff, User, Mail, Lock, CheckCircle, ArrowLeft, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loading, error, setError, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) setError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      navigate('/login', { 
        state: { message: 'Registration successful! Please login.' },
        replace: true 
      });
    } catch (err) {
      // Error handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnToHome = () => {
    navigate('/');
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
        staggerChildren: 0.1
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
    <>
      <Helmet>
        <title>Register | Shri Velan Organic Foods</title>
        <meta name="description" content="Create your Shri Velan Organic Foods account to enjoy exclusive offers, faster checkout, and order tracking." />
      </Helmet>

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
                Join Our Community
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
                <Rocket className="w-7 h-7" />
                Start Your Journey
              </motion.h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                Create an account to explore our premium organic food products, enjoy exclusive offers, and experience faster checkout.
              </p>
            </motion.div>
            
            {/* Return to Home Button */}
            <motion.button
              onClick={handleReturnToHome}
              className="text-white/80 hover:text-white transition-all duration-300 text-sm font-medium py-3 px-6 rounded-xl border border-white/30 hover:border-white/50 bg-white/5 hover:bg-white/10 backdrop-blur-sm group flex items-center justify-center gap-2"
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Return to Home
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right side - Registration Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <motion.div 
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl w-full max-w-md p-8 hover:shadow-3xl transition-all duration-500"
          >
          {/* Header */}
          <motion.div 
            variants={itemVariants}
            className="text-center mb-6 sm:mb-8 md:mb-10"
          >
            {/* Icon Container */}
            <motion.div 
              className="
                w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 
                bg-gradient-to-br from-primary to-primary/80 
                rounded-xl sm:rounded-2xl 
                flex items-center justify-center 
                mx-auto mb-3 sm:mb-4 md:mb-6 
                shadow-lg
              "
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.span 
                className="text-2xl sm:text-3xl md:text-4xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  y: [0, -5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }}
              >
                🚀
              </motion.span>
            </motion.div>

            {/* Title */}
            <motion.h2 
              className="
                text-2xl sm:text-3xl md:text-4xl 
                font-bold text-white mb-1 sm:mb-2
              "
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Create Account
            </motion.h2>

            {/* Subtitle */}
            <motion.p 
              className="text-gray-300 text-sm sm:text-base md:text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Join us for a healthier lifestyle
            </motion.p>
          </motion.div>


            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm overflow-hidden"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Registration Form */}
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <Input
                  label="Full Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  error={errors.name}
                  required
                  icon={<User className="w-4 h-4" />}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  error={errors.email}
                  required
                  icon={<Mail className="w-4 h-4" />}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create password (min. 6 characters)"
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
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  error={errors.confirmPassword}
                  required
                  icon={<CheckCircle className="w-4 h-4" />}
                                    rightIcon={
                    <motion.button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-white transition-colors p-1"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </motion.button>
                  }
                />
              </motion.div>

              <motion.div variants={itemVariants} className="w-full">
                <motion.button
                  type="submit"
                  disabled={loading || isSubmitting}
                  variants={buttonVariants}
                  initial="initial"
                  whileHover={!(loading || isSubmitting) ? "hover" : "loading"}
                  whileTap="tap"
                  className="
                    w-full 
                    py-3 sm:py-3.5 md:py-4        
                    text-sm sm:text-base md:text-lg  
                    bg-gradient-to-r from-primary to-primary/90 
                    hover:from-primary/90 hover:to-primary 
                    text-white font-semibold 
                    rounded-lg sm:rounded-xl md:rounded-2xl 
                    transition-all duration-300 
                    disabled:opacity-50 disabled:cursor-not-allowed 
                    relative overflow-hidden group
                    shadow-md hover:shadow-lg
                  "
                >
                  {/* Animated background */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />

                  {/* Button content */}
                  <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
                    {(loading || isSubmitting) ? (
                      <>
                        {/* Professional loading animation */}
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
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
                            className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 bg-white rounded-full"
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
                            className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 bg-white rounded-full"
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
                            className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 bg-white rounded-full"
                          />
                        </div>
                        <span className="font-medium text-xs sm:text-sm md:text-base tracking-wide">
                          Creating Account...
                        </span>
                      </>
                    ) : (
                      <>
                        <Rocket className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        <span className="font-medium text-xs sm:text-sm md:text-base tracking-wide">
                          Create Your Account
                        </span>
                      </>
                    )}
                  </div>
                </motion.button>
              </motion.div>


              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <motion.a
                    href="/login"
                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                    whileHover={{ x: 2 }}
                  >
                    Sign in
                  </motion.a>
                </p>
              </motion.div>
            </motion.form>

            {/* Mobile - Return to Home Button */}
            <motion.div 
              className="mt-8 text-center lg:hidden"
              variants={itemVariants}
            >
              <motion.button
                onClick={handleReturnToHome}
                className="text-white/80 hover:text-white transition-all duration-300 text-sm font-medium py-3 px-6 rounded-xl border border-white/30 hover:border-white/50 bg-white/5 hover:bg-white/10 backdrop-blur-sm group flex items-center justify-center gap-2 w-full"
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Return to Home
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default UserRegister;