import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  icon,
  rightIcon,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg
            text-white placeholder-gray-400 focus:outline-none focus:ring-2
            focus:ring-primary focus:border-transparent transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-400 text-sm flex items-center space-x-1">
          <span>⚠️</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default Input;