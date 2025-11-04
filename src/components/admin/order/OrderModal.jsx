import React from 'react';
import { FiX } from 'react-icons/fi';

const OrderModal = ({ isOpen, onClose, order, mode = 'view' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Create Order' : 
             mode === 'edit' ? 'Edit Order' : 'Order Details'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          {/* Add your order form/details content here */}
          <p>Order modal content for {mode} mode</p>
          {order && (
            <div>
              <p>Order: {order.orderNumber}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderModal;