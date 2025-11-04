// src/pages/admin/OrderDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiEdit,
  FiTruck,
  FiPrinter,
  FiMail,
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiShoppingBag,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useOrder, useUpdateOrderStatus } from "../../../hooks/useOrders";
import TrackingManagement from "../../../components/admin/order/TrackingManagement";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: orderResponse, isLoading, error } = useOrder(id);
  const updateOrderStatusMutation = useUpdateOrderStatus();
  const [order, setOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["details", "tracking", "customer"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (orderResponse?.data) setOrder(orderResponse.data);
    else if (orderResponse) setOrder(orderResponse);
  }, [orderResponse]);

  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
    PROCESSING: "bg-purple-100 text-purple-800 border-purple-200",
    SHIPPED: "bg-indigo-100 text-indigo-800 border-indigo-200",
    DELIVERED: "bg-green-100 text-green-800 border-green-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
    REFUNDED: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const paymentStatusColors = {
    PAID: "bg-green-100 text-green-800 border-green-200",
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    FAILED: "bg-red-100 text-red-800 border-red-200",
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateOrderStatusMutation.mutateAsync({ id: order.id, status: newStatus });
      setOrder((prev) => ({ ...prev, status: newStatus }));
      toast.success("Order status updated successfully");
    } catch {
      toast.error("Failed to update order status");
    }
  };

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount || 0);

  const handlePrint = () => window.print();

  const tabs = [
    { key: "details", label: "Order Details", icon: FiShoppingBag },
    { key: "tracking", label: "Tracking", icon: FiTruck },
    { key: "customer", label: "Customer Info", icon: FiUser },
  ];

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gray-200 rounded-lg h-96"></div>
            <div className="bg-gray-200 rounded-lg h-96"></div>
          </div>
        </div>
      </div>
    );

  if (error || !order)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-red-800 mb-2">Failed to load order</h3>
          <p className="text-red-600 text-sm mb-4">
            {error?.response?.data?.message || error?.message || "Order not found"}
          </p>
          <button
            onClick={() => navigate("/admin/orders")}
            className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6 print:bg-white print:p-0">
      {/* Header */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate("/admin/orders")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors print:hidden"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span className="text-sm sm:text-base">Back</span>
          </button>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
              Order #{order.orderNumber}
            </h1>
            <p className="text-gray-600 text-sm">Placed on {formatDate(order.createdAt)}</p>
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="hidden sm:flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors print:hidden"
        >
          <FiPrinter className="w-4 h-4" />
          <span>Print</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-2 sm:p-3 mb-4 print:hidden">
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-between sm:justify-start">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {activeTab === "details" && (
            <>
              {/* Order Status */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                  <h2 className="text-base font-semibold text-gray-900">Order Status</h2>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[
                      "PENDING",
                      "CONFIRMED",
                      "PROCESSING",
                      "SHIPPED",
                      "DELIVERED",
                      "CANCELLED",
                      "REFUNDED",
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0) + s.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-4 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                  <span className="text-xs text-gray-600">
                    Last updated: {formatDate(order.updatedAt)}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-4">
                  Order Items ({order.orderItems?.length || 0})
                </h2>
                <div className="divide-y divide-gray-100">
                  {order.orderItems?.map((item, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 py-3">
                      <img
                        src={item.product?.images?.[0] || "/images/placeholder-product.jpg"}
                        alt={item.product?.name}
                        className="w-20 h-20 rounded-lg object-cover border mx-auto sm:mx-0"
                      />
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <h3 className="font-medium text-gray-900 truncate">{item.product?.name}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-center sm:text-right text-sm">
                        <p className="font-medium">{formatCurrency(item.price)}</p>
                        <p className="text-gray-600">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FiMapPin className="text-gray-400" />
                  Shipping Address
                </h2>
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-medium">{order.name}</p>
                  <p>{order.address}</p>
                  <p>
                    {order.city}, {order.state} - {order.pincode}
                  </p>
                  <p className="flex items-center gap-1">
                    <FiUser className="text-gray-400" /> {order.phone}
                  </p>
                  <p className="flex items-center gap-1">
                    <FiMail className="text-gray-400" /> {order.email}
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === "tracking" && <TrackingManagement order={order} />}
          {activeTab === "customer" && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiUser className="text-gray-400" /> Customer Info
              </h2>
              <p className="text-sm text-gray-700">
                {order.user?.name || order.name} — {order.email}
              </p>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="space-y-4 sm:space-y-6">
          {/* Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{formatCurrency(order.shippingCost)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FiCreditCard className="text-gray-400" /> Payment Info
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${paymentStatusColors[order.paymentStatus]}`}
                >
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Method</span>
                <span className="capitalize">{order.paymentMethod}</span>
              </div>
              {order.coupon?.code && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Coupon</span>
                  <span className="text-green-600 font-medium">{order.coupon.code}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 print:hidden">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("tracking")}
                className="w-full flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
              >
                <FiTruck className="w-4 h-4" />
                Manage Tracking
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm">
                <FiMail className="w-4 h-4" />
                Send Update
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm">
                <FiEdit className="w-4 h-4" />
                Edit Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
