// components/admin/stats/ProductStats.jsx
import React from 'react';
import { Package, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import StatsGrid from '../../../shared/StatsGrid';
import StatCard from '../../../shared/StatCard';

const ProductStats = ({ stats = {} }) => {
  const { overview = {}, alerts = {} } = stats;

  const productStatsData = [
    {
      title: "Total Products",
      value: overview.totalProducts || 0,
      change: overview.growthPercentage || 0,
      icon: Package,
      color: "blue",
      description: "In catalog",
      trend: overview.growthPercentage >= 0 ? "up" : "down"
    },
    {
      title: "Out of Stock",
      value: overview.outOfStock || 0,
      change: -5, // You might want to calculate this from your data
      icon: AlertTriangle,
      color: "red",
      description: "Need restocking",
      alert: overview.outOfStock > 0 ? "Items need attention" : null,
      trend: "down"
    },
    {
      title: "Low Stock",
      value: overview.lowStock || 0,
      change: 8, // You might want to calculate this from your data
      icon: TrendingUp,
      color: "orange",
      description: "Below 10 units",
      alert: overview.lowStock > 3 ? "Monitor inventory" : null,
      trend: "up"
    },
    {
      title: "Inventory Value",
      value: `$${(overview.totalInventoryValue || 0).toLocaleString()}`,
      change: 15, // You might want to calculate this from your data
      icon: DollarSign,
      color: "green",
      description: "Total stock value",
      trend: "up"
    }
  ];

  return (
    <StatsGrid>
      {productStatsData.map((stat, index) => (
        <StatCard
          key={stat.title}
          {...stat}
          index={index}
        />
      ))}
    </StatsGrid>
  );
};

export default ProductStats;