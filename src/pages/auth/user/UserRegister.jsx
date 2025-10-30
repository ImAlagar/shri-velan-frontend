import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Helmet } from 'react-helmet';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

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
    }
  };

  const handleReturnToHome = () => {
    window.location.href = '/';
  };

  return (
    <>
      <Helmet>
        <title>Register | Shri Velan Organic Foods</title>
        <meta name="description" content="Create your Shri Velan Organic Foods account to enjoy exclusive offers, faster checkout, and order tracking." />
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
                Join Our Community
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                Start Your Journey
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Create an account to explore our premium organic food products, enjoy exclusive offers, and experience faster checkout.
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

        {/* Right side - Registration Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl w-full max-w-md p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Create Account
              </h2>
              <p className="text-gray-300">
                Join us for a healthier lifestyle
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                error={errors.name}
                required
                icon="👤"
              />

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
                placeholder="Create password (min. 6 characters)"
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

              <Input
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                error={errors.confirmPassword}
                required
                icon="✅"
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  'Create your account'
                )}
              </Button>

              <div className="text-center">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <a
                    href="/login"
                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Sign in
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

export default UserRegister;