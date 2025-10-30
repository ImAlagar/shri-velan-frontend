import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthForm from './AuthForm';
import FormInput from './FormInput';
import PasswordInput from './PasswordInput';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const { loading, error, setError, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors when user starts typing
    if (error) setError('');
    if (localError) setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters long");
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      // Redirect to login after successful registration
      navigate('/login', { 
        state: { message: 'Registration successful! Please login.' },
        replace: true 
      });
    } catch (err) {
      // Error handled in hook
    }
  };

  return (
    <AuthForm
      title="Create your account"
      subtitle="Join us today! Create your account to get started."
      onSubmit={handleSubmit}
      loading={loading}
      buttonText="Sign Up"
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Login"
    >
      <FormInput
        label="Full Name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter your full name"
        required
      />

      <FormInput
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        required
      />

      <PasswordInput
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Create password (min. 6 characters)"
        required
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
      />

      <PasswordInput
        label="Confirm Password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm your password"
        required
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
      />

      {(error || localError) && (
        <p className="text-red-400 text-sm text-center">{error || localError}</p>
      )}
    </AuthForm>
  );
};

export default Signup;