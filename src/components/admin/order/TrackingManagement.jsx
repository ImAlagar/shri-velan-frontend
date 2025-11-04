// src/components/admin/order/TrackingManagement.jsx
import React, { useState } from 'react';
import { 
  FiTruck, 
  FiMapPin, 
  FiCalendar, 
  FiPlus, 
  FiEdit3,
  FiClock,
  FiCheckCircle,
  FiPackage,
  FiShoppingBag,
  FiX
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { 
  useTrackingInfo, 
  useTrackingHistory, 
  useUpdateTracking,
  useAddTrackingEvent,
  useShippingCarriers 
} from '../../../hooks/useOrders';

const TrackingManagement = ({ order }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [trackingForm, setTrackingForm] = useState({
    trackingNumber: '',
    carrier: '',
    trackingUrl: '',
    estimatedDelivery: ''
  });
  const [eventForm, setEventForm] = useState({
    status: '',
    description: '',
    location: ''
  });

  const { data: trackingData, refetch: refetchTracking } = useTrackingInfo(order.id);
  const { data: trackingHistory, refetch: refetchHistory } = useTrackingHistory(order.id);
  const { data: carriersData } = useShippingCarriers();
  const updateTrackingMutation = useUpdateTracking();
  const addTrackingEventMutation = useAddTrackingEvent();

  const tracking = trackingData?.data || order;
  const history = trackingHistory?.data || [];
  const carriers = carriersData?.data || [
    { code: 'fedex', name: 'FedEx' },
    { code: 'ups', name: 'UPS' },
    { code: 'dhl', name: 'DHL' },
    { code: 'usps', name: 'USPS' },
    { code: 'bluedart', name: 'Blue Dart' },
    { code: 'delhivery', name: 'Delhivery' },
    { code: 'custom', name: 'Custom Carrier' }
  ];

  const statusConfig = {
    'order_placed': { icon: FiShoppingBag, color: 'bg-blue-500', label: 'Order Placed' },
    'confirmed': { icon: FiCheckCircle, color: 'bg-green-500', label: 'Confirmed' },
    'processing': { icon: FiPackage, color: 'bg-purple-500', label: 'Processing' },
    'shipped': { icon: FiTruck, color: 'bg-orange-500', label: 'Shipped' },
    'out_for_delivery': { icon: FiTruck, color: 'bg-red-500', label: 'Out for Delivery' },
    'delivered': { icon: FiCheckCircle, color: 'bg-green-600', label: 'Delivered' },
    'cancelled': { icon: FiClock, color: 'bg-gray-500', label: 'Cancelled' }
  };

  const handleTrackingUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateTrackingMutation.mutateAsync({
        orderId: order.id,
        trackingData: trackingForm
      });
      setIsEditing(false);
      refetchTracking();
      toast.success('Tracking information updated successfully');
    } catch (error) {
      toast.error('Failed to update tracking information');
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      await addTrackingEventMutation.mutateAsync({
        orderId: order.id,
        eventData: eventForm
      });
      setShowAddEvent(false);
      setEventForm({ status: '', description: '', location: '' });
      refetchHistory();
      refetchTracking();
      toast.success('Tracking event added successfully');
    } catch (error) {
      toast.error('Failed to add tracking event');
    }
  };

  const startEditing = () => {
    setTrackingForm({
      trackingNumber: tracking.trackingNumber || '',
      carrier: tracking.carrier || '',
      trackingUrl: tracking.trackingUrl || '',
      estimatedDelivery: tracking.estimatedDelivery ? 
        new Date(tracking.estimatedDelivery).toISOString().split('T')[0] : ''
    });
    setIsEditing(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrentStatus = () => {
    return tracking.currentStatus || order.status.toLowerCase();
  };

  return (
    <div className="space-y-6">
      {/* Current Tracking Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FiTruck className="w-5 h-5 text-blue-600" />
            Order Tracking
          </h3>
          <div className="flex gap-2">
            <button
              onClick={startEditing}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <FiEdit3 className="w-4 h-4" />
              Edit Tracking
            </button>
            <button
              onClick={() => setShowAddEvent(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add Event
            </button>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleTrackingUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tracking Number *
                </label>
                <input
                  type="text"
                  value={trackingForm.trackingNumber}
                  onChange={(e) => setTrackingForm({...trackingForm, trackingNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tracking number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Carrier *
                </label>
                <select
                  value={trackingForm.carrier}
                  onChange={(e) => setTrackingForm({...trackingForm, carrier: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Carrier</option>
                  {carriers.map(carrier => (
                    <option key={carrier.code} value={carrier.code}>
                      {carrier.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tracking URL
                </label>
                <input
                  type="url"
                  value={trackingForm.trackingUrl}
                  onChange={(e) => setTrackingForm({...trackingForm, trackingUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://carrier.com/track/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Delivery
                </label>
                <input
                  type="date"
                  value={trackingForm.estimatedDelivery}
                  onChange={(e) => setTrackingForm({...trackingForm, estimatedDelivery: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={updateTrackingMutation.isPending}
              >
                {updateTrackingMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Current Status</h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-3 h-3 rounded-full ${statusConfig[getCurrentStatus()]?.color || 'bg-gray-400'}`}></div>
                  <span className="font-semibold text-gray-900 capitalize">
                    {statusConfig[getCurrentStatus()]?.label || getCurrentStatus().replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
              
              {tracking.trackingNumber && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tracking Number</h4>
                  <p className="font-mono text-gray-900 mt-1">{tracking.trackingNumber}</p>
                </div>
              )}
              
              {tracking.carrier && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Carrier</h4>
                  <p className="text-gray-900 mt-1 capitalize">{tracking.carrier}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {tracking.estimatedDelivery && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" />
                    Estimated Delivery
                  </h4>
                  <p className="text-gray-900 mt-1">{formatDate(tracking.estimatedDelivery)}</p>
                </div>
              )}
              
              {tracking.trackingUrl && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tracking Link</h4>
                  <a 
                    href={tracking.trackingUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 mt-1 inline-block break-all"
                  >
                    View on Carrier Website →
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tracking Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiClock className="w-5 h-5 text-purple-600" />
          Tracking History
        </h3>
        
        {history.length > 0 ? (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            {history.map((event, index) => {
              const config = statusConfig[event.status] || { icon: FiClock, color: 'bg-gray-400', label: event.status };
              const EventIcon = config.icon;
              
              return (
                <div key={event.id} className="relative flex items-start gap-4 pb-6 last:pb-0">
                  <div className={`w-12 h-12 ${config.color} rounded-full flex items-center justify-center flex-shrink-0 z-10`}>
                    <EventIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 capitalize">
                        {config.label || event.status.replace(/_/g, ' ')}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {formatDate(event.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">{event.description}</p>
                    {event.location && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FiMapPin className="w-4 h-4" />
                        {event.location}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <FiClock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No tracking history available</p>
            <button
              onClick={() => setShowAddEvent(true)}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Add First Tracking Event
            </button>
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Tracking Event</h3>
              <button
                onClick={() => setShowAddEvent(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  value={eventForm.status}
                  onChange={(e) => setEventForm({...eventForm, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Status</option>
                  {Object.entries(statusConfig).map(([value, config]) => (
                    <option key={value} value={value}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Describe the tracking event..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Distribution Center, Local Facility"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                  disabled={addTrackingEventMutation.isPending}
                >
                  {addTrackingEventMutation.isPending ? 'Adding...' : 'Add Event'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddEvent(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingManagement;