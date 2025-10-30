import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const AdminResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (message) setMessage('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
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
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMessage('Your password has been reset successfully! Redirecting to login...');
      setFormData({ password: '', confirmPassword: '' });
      
      // Redirect to login after success
      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 3000);
    } catch (error) {
      setMessage('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnToCustomerPortal = () => {
    window.location.href = '/';
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
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="text-center max-w-md z-10 relative">
          <div className="mb-8">
            <h1 className="text-4xl font-Italiana font-bold text-white mb-4">
              Shri Velan Organic Foods
            </h1>
            <p className="text-xl text-gray-300 font-SpaceGrotesk">
              Admin Portal
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-green-500">
              Set New Password
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Create a strong new password for your admin account. Make sure it's unique and different from previous passwords.
            </p>
          </div>
          
          {/* Return to Customer Portal Button */}
          <button
            onClick={handleReturnToCustomerPortal}
            className="text-white/80 hover:text-white transition-all duration-200 text-sm font-medium py-2 px-4 rounded-lg border border-white/30 hover:border-white/50 bg-white/5 hover:bg-white/10 backdrop-blur-sm"
          >
            ← Return to Customer Portal
          </button>
        </div>
      </div>

      {/* Right side - Reset Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl w-full max-w-md p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔄</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Reset Password
            </h2>
            <p className="text-gray-300">
              Create your new password
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className={`px-4 py-3 rounded-lg mb-6 text-sm ${
              message.includes('Failed') 
                ? 'bg-red-500/20 border border-red-500 text-red-300'
                : 'bg-green-500/20 border border-green-500 text-green-300'
            }`}>
              {message}
            </div>
          )}

          {/* Reset Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="New Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
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

            <Input
              label="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              error={errors.confirmPassword}
              required
              icon="✅"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              }
            />



            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Resetting Password...</span>
                </div>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Remember your password?{' '}
              <a
                href="/admin/login"
                className="text-green-500 hover:text-green-400 font-semibold transition-colors"
              >
                Back to Login
              </a>
            </p>
          </div>

          {/* Mobile - Return to Customer Portal Button */}
          <div className="mt-6 text-center lg:hidden">
            <button
              onClick={handleReturnToCustomerPortal}
              className="text-white/80 hover:text-white transition-all duration-200 text-sm font-medium py-2 px-4 rounded-lg border border-white/30 hover:border-white/50 bg-white/5 hover:bg-white/10 backdrop-blur-sm"
            >
              ← Return to Customer Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminResetPassword;