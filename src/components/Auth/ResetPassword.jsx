import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthForm from './AuthForm';
import PasswordInput from './PasswordInput';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error, setError } = useAuth();
  const navigate = useNavigate();
  const { token } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (localError) setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters long");
      return;
    }

    try {
      // Note: You'll need to add resetPassword method to authService
      // await authService.resetPassword(token, formData.password);
      
      // Simulate success for now
      setMessage('Password reset successful! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
    } catch (err) {
      // Error handled in hook
    }
  };

  return (
    <AuthForm
      title="Reset Password"
      subtitle="Enter your new password below."
      onSubmit={handleSubmit}
      loading={loading}
      buttonText="Reset Password"
      footerText="Back to"
      footerLink="/login"
      footerLinkText="Login"
    >
      <PasswordInput
        label="New Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter new password"
        required
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
      />

      <PasswordInput
        label="Confirm New Password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm new password"
        required
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
      />

      {message && (
        <p className="text-green-400 text-sm text-center">{message}</p>
      )}
      {(error || localError) && (
        <p className="text-red-400 text-sm text-center">{error || localError}</p>
      )}
    </AuthForm>
  );
};

export default ResetPassword;