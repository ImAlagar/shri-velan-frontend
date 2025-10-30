import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import AuthForm from './AuthForm';
import FormInput from './FormInput';
import PasswordInput from './PasswordInput';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false); // Add this state

  const { loading, error, setError, login, redirectToDestination } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login(formData.email, formData.password);
      redirectToDestination();
    } catch (err) {
      // Error is handled in the hook
    }
  };

  return (
    <AuthForm
      title="Login to your account"
      subtitle="Welcome back! Please enter your details."
      onSubmit={handleSubmit}
      loading={loading}
      buttonText="Login"
      footerText="Don't have an account?"
      footerLink="/register"
      footerLinkText="Sign up"
    >
      <FormInput
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        required
        error={error}
      />

      <PasswordInput
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter your password"
        required
        showPassword={showPassword} // Add this prop
        onTogglePassword={() => setShowPassword(!showPassword)} // Add this prop
      />

      <div className="flex items-center justify-between text-gray-400 text-sm">
        <a href="/forget-password" className="hover:text-white transition">
          Forgot password?
        </a>
      </div>
    </AuthForm>
  );
};

export default Login;