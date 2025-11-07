// components/UserForgotPassword.jsx
import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Helmet } from 'react-helmet';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const UserForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const { loading, error, setError, forgotPassword } = useAuth();

  const handleChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
    if (error) setError('');
    if (message) setMessage('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setError('');
    setMessage('');

    try {
      // Call the actual API
      const result = await forgotPassword(email);
      
      if (result.success) {
        setMessage(result.message || 'Password reset instructions have been sent to your email!');
        setEmail('');
      } else {
        setError(result.message || 'Failed to send reset instructions. Please try again.');
      }
    } catch (err) {
      // Error is already set in the context, but we can add a fallback
      if (!error) {
        setError('Failed to send reset instructions. Please try again.');
      }
    }
  };

  const handleReturnToHome = () => {
    window.location.href = '/';
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password | Shri Velan Organic Foods</title>
        <meta name="description" content="Reset your Shri Velan Organic Foods account password. Enter your email to receive reset instructions." />
      </Helmet>

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
                Account Recovery
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                Reset Your Password
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Enter your email address and we'll send you instructions to reset your password and regain access to your account.
              </p>
            </div>
            
            {/* Return to Home Button */}
            <button
              onClick={handleReturnToHome}
              className="text-white/80 hover:text-white transition-all duration-200 text-sm font-medium py-2 px-4 rounded-lg border border-white/30 hover:border-white/50 bg-white/5 hover:bg-white/10 backdrop-blur-sm"
            >
              ← Return to Home
            </button>
          </div>
        </div>

        {/* Right side - Forgot Password Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl w-full max-w-md p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔑</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Forgot Password
              </h2>
              <p className="text-gray-300">
                Enter your email to reset your password
              </p>
            </div>

            {/* Messages */}
            {message && (
              <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg mb-6 text-sm">
                {message}
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            {/* Forgot Password Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your registered email"
                error={errors.email}
                required
                icon="✉️"
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary hover:bg-primary text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending instructions...</span>
                  </div>
                ) : (
                  'Send Reset Instructions'
                )}
              </Button>

              <div className="text-center">
                <p className="text-gray-400">
                  Remember your password?{' '}
                  <a
                    href="/login"
                    className="font-medium text-primary hover:text-primary transition-colors"
                  >
                    Back to login
                  </a>
                </p>
              </div>
            </form>

            {/* Mobile - Return to Home Button */}
            <div className="mt-6 text-center lg:hidden">
              <button
                onClick={handleReturnToHome}
                className="text-white/80 hover:text-white transition-all duration-200 text-sm font-medium py-2 px-4 rounded-lg border border-white/30 hover:border-white/50 bg-white/5 hover:bg-white/10 backdrop-blur-sm"
              >
                ← Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserForgotPassword;