// shared/DataCard.jsx
import React from 'react';

const DataCard = ({ 
  data, 
  keyField = 'id',
  renderItem,
  emptyMessage = "No data found",
  emptyAction,
  className = ""
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">{emptyMessage}</div>
        <p className="text-gray-400 text-sm mb-4">
          Try adjusting your search criteria
        </p>
        {emptyAction}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-4 ${className}`}>
      {data.map((item) => (
        <div key={item[keyField]}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
};

export default DataCard;