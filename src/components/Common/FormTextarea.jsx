import React from 'react';

const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  className = ''
}) => {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="font-medium text-gray-700 mb-2 text-sm">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${className}`}
      />
    </div>
  );
};

export default FormTextarea;