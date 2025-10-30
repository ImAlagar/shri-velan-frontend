import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import AuthForm from './AuthForm';
import FormInput from './FormInput';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const { loading, error, setError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      // Note: You'll need to add forgotPassword method to authService
      // await authService.forgotPassword(email);
      
      // Simulate API call for now
      setMessage('Password reset link sent to your email!');
      
      // Clear form
      setEmail('');
    } catch (err) {
      // Error handled in hook
    }
  };

  return (
    <AuthForm
      title="Forgot Password"
      subtitle="Enter your registered email and we'll send you a password reset link."
      onSubmit={handleSubmit}
      loading={loading}
      buttonText="Send Reset Link"
      footerText="Remember your password?"
      footerLink="/login"
      footerLinkText="Back to Login"
    >
      <FormInput
        label="Email"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your registered email"
        required
      />

      {message && (
        <p className="text-green-400 text-sm text-center">{message}</p>
      )}
      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}
    </AuthForm>
  );
};

export default ForgetPassword;