import React from 'react';

const FormInput = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={props.id} className="text-gray-300 font-medium">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="px-5 py-3 rounded-xl border border-gray-600 bg-transparent text-white outline-none focus:border-purple-500 focus:shadow-md focus:shadow-purple-700/30 transition-all"
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      />
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
};

export default FormInput;