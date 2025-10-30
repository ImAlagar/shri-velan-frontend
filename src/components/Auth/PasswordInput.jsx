import React from 'react';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';

const PasswordInput = ({ 
  label = "Password",
  name = "password",
  value, 
  onChange, 
  placeholder, 
  required = false, 
  error,
  showPassword,
  onTogglePassword,
  className = ''
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={name} className="text-gray-300 font-medium">{label}</label>
      )}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          id={name}
          placeholder={placeholder}
          className={`w-full px-5 py-3 rounded-xl border ${
            error ? 'border-red-500' : 'border-gray-600'
          } bg-transparent text-white outline-none focus:border-purple-500 focus:shadow-md focus:shadow-purple-700/30 transition-all pr-12 ${className}`}
          value={value}
          onChange={onChange}
          required={required}
        />
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
        >
          {showPassword ? <VscEyeClosed size={20} /> : <VscEye size={20} />}
        </button>
      </div>
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
};

export default PasswordInput;