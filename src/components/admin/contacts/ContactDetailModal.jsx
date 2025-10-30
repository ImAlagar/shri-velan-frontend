// components/admin/contacts/ContactDetailModal.jsx
import React from 'react';
import { FiX, FiUser, FiMail, FiPhone, FiCalendar, FiMessageSquare, FiMapPin } from 'react-icons/fi';

const ContactDetailModal = ({ isOpen, onClose, contact }) => {
  if (!isOpen || !contact) return null;

  const statusColors = {
    'NEW': 'bg-blue-100 text-blue-800',
    'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
    'RESOLVED': 'bg-green-100 text-green-800',
    'CLOSED': 'bg-gray-100 text-gray-800'
  };

  const statusLabels = {
    'NEW': 'New',
    'IN_PROGRESS': 'In Progress',
    'RESOLVED': 'Resolved',
    'CLOSED': 'Closed'
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        ></div>

        {/* Modal panel */}
        <div className="relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiMessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Contact Inquiry Details
                </h3>
                <p className="text-sm text-gray-500">
                  Complete inquiry information
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Details */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg font-medium">
                    {contact.name?.split(' ').map(n => n[0]).join('') || '?'}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{contact.name || 'Unknown'}</h4>
                  <p className="text-sm text-gray-500">{contact.email}</p>
                </div>
              </div>

              {/* Status and Date */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    statusColors[contact.status] || 'bg-gray-100 text-gray-800'
                  }`}>
                    {statusLabels[contact.status] || contact.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Submitted</span>
                  <span className="text-sm text-gray-900">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h5>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FiUser className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{contact.name || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiMail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{contact.email}</span>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center space-x-2">
                      <FiPhone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{contact.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submission Info */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-900 mb-3">Submission Details</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Date Submitted</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Time Submitted</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(contact.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h5 className="text-sm font-semibold text-gray-900 mb-3">Message Details</h5>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Subject:</span>
                  <p className="text-sm text-gray-900 mt-1">{contact.subject}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Message:</span>
                  <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{contact.message}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={handleClose}
              className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailModal;