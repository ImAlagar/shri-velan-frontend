import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminLogin = () => {
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
    
    try {
      // Pass 'ADMIN' as required role - only ADMIN users can login here
      await login(formData, 'ADMIN');
      
      // Redirect to admin dashboard
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
      
    } catch (err) {
      // Error is already handled in the auth hook
      console.error('Admin login error:', err);
    }
  };

  const handleReturnToCustomerPortal = () => {
    navigate('/');
  };

  const handleGoToUserLogin = () => {
    navigate('/login');
  };

  return (
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
              Admin Dashboard
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              Administrator Access Only
            </h2>
            <p className="text-gray-300 leading-relaxed">
              This portal is exclusively for authorized administrators. Customer accounts cannot access this area.
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
              <span className="text-2xl">🔐</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Admin Login
            </h2>
            <p className="text-gray-300">
              Administrator access only
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
              placeholder="admin@example.com"
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
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              }
            />

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
                'Sign In to Admin Dashboard'
              )}
            </Button>
          </form>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3 text-center">
            <button
              onClick={handleReturnToCustomerPortal}
              className="text-white/80 hover:text-white transition-all duration-200 text-sm font-medium py-2 px-4 rounded-lg border border-white/30 hover:border-white/50 bg-primary hover:bg-primary/90 backdrop-blur-sm w-full"
            >
              ← Return to Customer Portal
            </button>
            
            <button
              onClick={handleGoToUserLogin}
              className="text-white/60 hover:text-white transition-all duration-200 text-sm font-medium py-2 px-4 rounded-lg border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 backdrop-blur-sm w-full"
            >
              Customer Login →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;