import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Helmet } from 'react-helmet';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error: authError, setError } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (authError) setError('');
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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Pass 'USER' as required role - ADMIN users will be blocked
      await login(formData, 'USER');
      
      // Redirect to intended page or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
      
    } catch (err) {
      // Error is handled in the auth hook
      console.error('User login error:', err);
    }
  };

  const handleReturnToHome = () => {
    navigate('/');
  };

  const handleGoToAdminLogin = () => {
    navigate('/admin/login');
  };

  return (
    <>
      <Helmet>
        <title>Login | Shri Velan Organic Foods</title>
        <meta name="description" content="Login to your Shri Velan Organic Foods account to access exclusive offers and manage your orders." />
      </Helmet>

      <div className="min-h-screen flex gap-10 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        {/* Left side - Brand Section with Background Image */}
        <div 
          className="hidden lg:flex lg:w-1/2 items-center justify-center relative bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")'
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          
          <div className="text-center max-w-md z-10 relative">
            <div className="mb-8">
              <h1 className="text-4xl font-Italiana font-bold text-white mb-4">
                Shri Velan Organic Foods
              </h1>
              <p className="text-xl text-gray-300 font-SpaceGrotesk">
                Welcome Back!
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                Customer Portal
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Sign in to access exclusive organic food products, track your orders, and manage your personal preferences.
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl w-full max-w-md p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👋</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-300">
                Sign in to your customer account
              </p>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
                {authError}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                error={errors.email}
                required
                icon="✉️"
              />

              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                error={errors.password}
                required
                icon="🔒"
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                }
              />

              <div className="flex items-center justify-end text-sm">
                <a
                  href="/forgot-password"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot your password?
                </a>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign in to your account'
                )}
              </Button>

              <div className="text-center">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <a
                    href="/register"
                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Sign up
                  </a>
                </p>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3 text-center">
              <button
                onClick={handleReturnToHome}
                className="text-white/80 hover:text-white transition-all duration-200 text-sm font-medium py-2 px-4 rounded-lg border border-white/30 hover:border-white/50 bg-primary hover:bg-primary/90 backdrop-blur-sm w-full"
              >
                ← Return to Home
              </button>
              
              <button
                onClick={handleGoToAdminLogin}
                className="text-white/60 hover:text-white transition-all duration-200 text-sm font-medium py-2 px-4 rounded-lg border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 backdrop-blur-sm w-full"
              >
                Administrator Login →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserLogin;