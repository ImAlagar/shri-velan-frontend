// components/admin/stats/OrderStats.jsx
import React from 'react';
import { FiPackage, FiDollarSign, FiCheckCircle, FiClock, FiTruck } from 'react-icons/fi';
import StatsGrid from '../../../shared/StatsGrid';
import StatCard from '../../../shared/StatCard';

const OrderStats = ({ orders = [] }) => {
  // Calculate order statistics
  const orderStats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(order => order.status === 'Pending').length,
    processingOrders: orders.filter(order => order.status === 'Processing').length,
    shippedOrders: orders.filter(order => order.status === 'Shipped').length,
    deliveredOrders: orders.filter(order => order.status === 'Delivered').length,
    totalRevenue: orders.reduce((sum, order) => sum + order.amount, 0),
    averageOrderValue: orders.reduce((sum, order) => sum + order.amount, 0) / orders.length || 0
  };

  const orderStatsData = [
    {
      title: "Total Orders",
      value: orderStats.totalOrders,
      change: 8,
      icon: FiPackage,
      color: "blue",
      description: "All time",
      trend: "up"
    },
    {
      title: "Pending",
      value: orderStats.pendingOrders,
      change: -2,
      icon: FiClock,
      color: "yellow",
      description: "Awaiting processing",
      alert: orderStats.pendingOrders > 5 ? "High pending orders" : null,
      trend: "down"
    },
    {
      title: "Processing",
      value: orderStats.processingOrders,
      change: 3,
      icon: FiTruck,
      color: "blue",
      description: "In progress",
      trend: "up"
    },
    {
      title: "Total Revenue",
      value: `$${orderStats.totalRevenue.toFixed(2)}`,
      change: 15,
      icon: FiDollarSign,
      color: "green",
      description: "This month",
      trend: "up"
    }
  ];

  return (
    <StatsGrid>
      {orderStatsData.map((stat, index) => (
        <StatCard
          key={stat.title}
          {...stat}
          index={index}
        />
      ))}
    </StatsGrid>
  );
};

export default OrderStats;