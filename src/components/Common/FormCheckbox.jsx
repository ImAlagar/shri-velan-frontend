import React from 'react';

const FormCheckbox = ({
  label,
  name,
  checked,
  onChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <label htmlFor={name} className="font-medium text-gray-700 text-sm cursor-pointer">
        {label}
      </label>
    </div>
  );
};

export default FormCheckbox;