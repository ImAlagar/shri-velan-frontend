import React from 'react';
import { FiPlus, FiX } from 'react-icons/fi';

const DynamicInputList = ({
  label,
  items = [],
  onAdd,
  onRemove,
  onChange,
  placeholder = "Enter item",
  addButtonText = "Add Item",
  className = ''
}) => {
  return (
    <div className={className}>
      <label className="font-medium text-gray-700 mb-3 text-sm block">
        {label}
      </label>
      
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3 items-center">
            <input
              type="text"
              value={item}
              onChange={(e) => onChange(index, e.target.value)}
              placeholder={`${placeholder} ${index + 1}`}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <FiPlus size={16} />
        {addButtonText}
      </button>
    </div>
  );
};

export default DynamicInputList;