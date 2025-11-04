import React from 'react';
import { motion } from 'framer-motion';
import {
  FaShoppingBag,
  FaCheckCircle,
  FaBox,
  FaTruck,
  FaShippingFast,
  FaTimesCircle,
  FaClock,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { useTrackingHistory, useTrackingInfo } from '../../../hooks/useOrders';

const TrackingTab = ({ order, formatDate }) => {
  const { data: trackingData, isLoading } = useTrackingInfo(order.id);
  const { data: trackingHistory } = useTrackingHistory(order.id);

  const getStatusColor = (status) => {
    const colors = {
      order_placed: 'bg-blue-500',
      confirmed: 'bg-blue-600',
      processing: 'bg-yellow-500',
      shipped: 'bg-orange-500',
      out_for_delivery: 'bg-purple-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusIcon = (status) => {
    const icons = {
      order_placed: FaShoppingBag,
      confirmed: FaCheckCircle,
      processing: FaBox,
      shipped: FaTruck,
      out_for_delivery: FaShippingFast,
      delivered: FaCheckCircle,
      cancelled: FaTimesCircle,
    };
    return icons[status] || FaClock;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const tracking = trackingData?.data || order;
  const history = trackingHistory?.data || [];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ===== Current Status ===== */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">
          Current Status
        </h4>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Status Info */}
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 ${getStatusColor(
                tracking.currentStatus || order.status.toLowerCase()
              )} rounded-full flex items-center justify-center`}
            >
              {React.createElement(
                getStatusIcon(tracking.currentStatus || order.status.toLowerCase()),
                { className: 'w-6 h-6 text-white' }
              )}
            </div>
            <div>
              <h5 className="font-bold text-gray-900 dark:text-white capitalize">
                {(tracking.currentStatus || order.status).replace(/_/g, ' ')}
              </h5>
              {tracking.estimatedDelivery && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Estimated delivery: {formatDate(tracking.estimatedDelivery)}
                </p>
              )}
            </div>
          </div>

          {/* Tracking Number */}
          {tracking.trackingNumber && (
            <div className="text-sm text-right sm:text-left">
              <p className="text-gray-600 dark:text-gray-300">Tracking Number</p>
              <p className="font-mono font-bold text-gray-900 dark:text-white">
                {tracking.trackingNumber}
              </p>
              {tracking.trackingUrl && (
                <a
                  href={tracking.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Track Package →
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===== Tracking History ===== */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">
          Tracking History
        </h4>

        <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">
          {history.length > 0 ? (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

              {history.map((event, index) => {
                const EventIcon = getStatusIcon(event.status);
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex items-start space-x-4 pb-5 last:pb-0"
                  >
                    <div
                      className={`w-12 h-12 ${getStatusColor(
                        event.status
                      )} rounded-full flex items-center justify-center flex-shrink-0 z-10`}
                    >
                      <EventIcon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                        <h5 className="font-bold text-gray-900 dark:text-white capitalize">
                          {event.status.replace(/_/g, ' ')}
                        </h5>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(event.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                        {event.description}
                      </p>
                      {event.location && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                          <FaMapMarkerAlt className="w-3 h-3" />
                          <span>{event.location}</span>
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <FaClock className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No tracking history available yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ===== Shipping & Delivery Info ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Shipping Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
            Shipping Details
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-300">Carrier</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {tracking.carrier || 'Not specified'}
              </p>
            </div>
            {tracking.trackingNumber && (
              <div>
                <p className="text-gray-600 dark:text-gray-300">Tracking Number</p>
                <p className="font-mono font-semibold text-gray-900 dark:text-white">
                  {tracking.trackingNumber}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
            Delivery Information
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-300">Status</p>
              <p className="font-semibold text-gray-900 dark:text-white capitalize">
                {(tracking.currentStatus || order.status).replace(/_/g, ' ')}
              </p>
            </div>
            {tracking.estimatedDelivery && (
              <div>
                <p className="text-gray-600 dark:text-gray-300">Estimated Delivery</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatDate(tracking.estimatedDelivery)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingTab;
