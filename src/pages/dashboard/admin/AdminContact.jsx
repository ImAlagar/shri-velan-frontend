// pages/AdminContact.jsx
import React, { useState, useEffect } from 'react';
import { FiMail, FiPhone, FiClock, FiEye, FiTrash2, FiSearch, FiRefreshCw, FiMessageSquare } from 'react-icons/fi';
import { showSuccess, showError, showInfo } from '../../../utils/toast';
import ContactStats from '../../../components/admin/stats/ContactStats';
import DataTable from '../../../shared/DataTable';
import DataCard from '../../../shared/DataCard';
import ContactDetailModal from '../../../components/admin/contacts/ContactDetailModal';
import DeleteConfirmationModal from '../../../shared/DeleteConfirmationModal';
import { 
  useContacts, 
  useDeleteContact, 
  useUpdateContactStatus 
} from '../../../hooks/useContacts';
import { useContactContext } from '../../../contexts/ContactContext';

const AdminContact = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    filters, 
    setFilters 
  } = useContactContext();

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // React Query hooks
  const { 
    data: contactsData, 
    isLoading, 
    error, 
    refetch 
  } = useContacts();

  const deleteMutation = useDeleteContact();
  const updateStatusMutation = useUpdateContactStatus();

  const contacts = contactsData?.data?.contacts || [];

  // Status configuration
const statusColors = {
  'PENDING': 'bg-blue-100 text-blue-800',
  'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
  'RESOLVED': 'bg-green-100 text-green-800',
  'CLOSED': 'bg-gray-100 text-gray-800'
};
const statusLabels = {
  'PENDING': 'New',
  'IN_PROGRESS': 'In Progress',
  'RESOLVED': 'Resolved',
  'CLOSED': 'Closed'
};

  // Filter contacts based on search and filters
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || contact.status === filters.status;
    
    return matchesSearch && matchesStatus;
  });

  // Sort contacts
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    const order = filters.sortOrder === 'asc' ? 1 : -1;
    
    switch (filters.sortBy) {
      case 'name':
        return (a.name || '').localeCompare(b.name || '') * order;
      case 'email':
        return (a.email || '').localeCompare(b.email || '') * order;
      case 'createdAt':
        return (new Date(a.createdAt) - new Date(b.createdAt)) * order;
      case 'status':
        return (a.status || '').localeCompare(b.status || '') * order;
      default:
        return 0;
    }
  });

  // Handle resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handlers
  const handleView = (contact) => {
    setSelectedContact(contact);
    setIsDetailModalOpen(true);
    showInfo(`Viewing contact from ${contact.name}`);
  };

  const handleDelete = (contact) => {
    setSelectedContact(contact);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedContact) return;
    
    try {
      await deleteMutation.mutateAsync(selectedContact.id);
      setIsDeleteModalOpen(false);
      setSelectedContact(null);
      showSuccess(`Contact from "${selectedContact.name}" deleted successfully`);
    } catch (error) {
      showError('Failed to delete contact');
    }
  };

  const handleStatusUpdate = async (contact, newStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: contact.id,
        status: newStatus
      });
      showSuccess(`Contact status updated to ${statusLabels[newStatus]}`);
    } catch (error) {
      showError('Failed to update contact status');
    }
  };

  const handleRefresh = () => {
    refetch();
    showSuccess('Contacts list refreshed');
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value) {
      showInfo(`Searching for: ${value}`);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    if (newFilters.status !== 'all') {
      showInfo('Filters applied');
    }
  };

  // Desktop columns for DataTable
  const columns = [
    {
      title: 'Contact',
      dataIndex: 'name',
      key: 'contact',
      sortable: true,
      render: (record) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{record.name}</div>
          <div className="text-sm text-gray-500">{record.email}</div>
          {record.phone && (
            <div className="text-xs text-gray-400">{record.phone}</div>
          )}
        </div>
      )
    },
    {
      title: 'Subject & Message',
      dataIndex: 'subject',
      key: 'subject',
      render: (record) => (
        <div className="max-w-xs">
          <div className="text-sm font-medium text-gray-900 truncate">{record.subject}</div>
          <div className="text-xs text-gray-500 truncate">{record.message}</div>
        </div>
      )
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sortable: true,
      render: (record) => (
        <div className="text-sm text-gray-500">
          {new Date(record.createdAt).toLocaleDateString()}
          <div className="text-xs text-gray-400">
            {new Date(record.createdAt).toLocaleTimeString()}
          </div>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sortable: true,
      render: (record) => (
        <select
          value={record.status}
          onChange={(e) => handleStatusUpdate(record, e.target.value)}
          className={`text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-blue-500 px-3 py-1 cursor-pointer ${
            statusColors[record.status] || 'bg-gray-100 text-gray-800'
          }`}
        >
          <option value="NEW">New</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleView(record)}
            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDelete(record)}
            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Contact"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // Mobile card render function
  const renderContactCard = (contact) => (
    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        {/* Contact Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                {contact.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 truncate">{contact.email}</p>
            </div>
            
            {/* Status */}
            <select
              value={contact.status}
              onChange={(e) => handleStatusUpdate(contact, e.target.value)}
              className={`text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-blue-500 px-2 py-1 cursor-pointer flex-shrink-0 ${
                statusColors[contact.status] || 'bg-gray-100 text-gray-800'
              }`}
            >
              <option value="NEW">New</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          {/* Contact Details */}
          <div className="space-y-2 mb-3">
            {contact.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <FiPhone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{contact.phone}</span>
              </div>
            )}
            <div className="flex items-center text-sm text-gray-600">
              <FiClock className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Subject & Message */}
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-900 mb-1 truncate">
              {contact.subject}
            </h4>
            <p className="text-sm text-gray-600 line-clamp-2">
              {contact.message}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-1 mt-3 sm:mt-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleView(contact);
            }}
            className="text-blue-600 hover:text-blue-900 p-2 sm:p-2.5 hover:bg-blue-50 rounded-lg transition-colors active:scale-95"
          >
            <FiEye className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(contact);
            }}
            className="text-red-600 hover:text-red-900 p-2 sm:p-2.5 hover:bg-red-50 rounded-lg transition-colors active:scale-95"
          >
            <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
          <div className="bg-gray-200 rounded-lg h-64"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-red-400 rounded-full mr-3"></div>
              <div>
                <h3 className="text-lg font-medium text-red-800">Failed to load contacts</h3>
                <p className="text-red-600 mt-1">{error.message}</p>
              </div>
            </div>
            <button
              onClick={() => refetch()}
              className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      {/* Header Section */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
              Contact Inquiries
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Manage customer inquiries and messages ({contacts.length} total)
            </p>
          </div>
          <div className="flex flex-col xs:flex-row gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm sm:text-base"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>

          </div>
        </div>

        {/* Contact Statistics */}
        <div className="mb-6 lg:mb-8">
          <ContactStats />
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search contacts by name, email, or subject..."
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange({ status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">All Status</option>
              <option value="NEW">New</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Inquiries Display */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isMobile ? (
          <div className="p-4">
            <DataCard
              data={sortedContacts}
              renderItem={renderContactCard}
              emptyMessage="No contact inquiries found"
              emptyAction={
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-4">
                    No contact inquiries match your search criteria
                  </p>
                </div>
              }
            />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={sortedContacts}
            keyField="id"
            emptyMessage={
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">No contact inquiries found</div>
                <p className="text-gray-400 text-sm mb-4">
                  {searchTerm || filters.status !== 'all'
                    ? 'Try adjusting your search criteria' 
                    : 'No contact inquiries received yet'
                  }
                </p>
              </div>
            }
            className="border-0"
          />
        )}
      </div>

      {/* Contact Detail Modal */}
      <ContactDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedContact(null);
        }}
        contact={selectedContact}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedContact(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Contact Inquiry"
        message={`Are you sure you want to delete the inquiry from "${selectedContact?.name}"? This action cannot be undone.`}
        confirmText="Delete Inquiry"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AdminContact;