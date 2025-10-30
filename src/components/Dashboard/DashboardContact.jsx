import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, PieChart, Pie, Cell, LineChart, Line 
} from "recharts";
import { 
  BarChart3, 
  ShoppingBag, 
  Layers, 
  Users, 
  TrendingUp,
  Package
} from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function DashboardContent() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);
  const [monthlyOrders, setMonthlyOrders] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [productsRes, categoriesRes, ordersRes, usersRes, ordersMonthlyRes] =
          await Promise.all([
            fetch("https://shri-velan-food.onrender.com/api/products", { headers }),
            fetch("https://shri-velan-food.onrender.com/api/categories", { headers }),
            fetch("https://shri-velan-food.onrender.com/api/orders", { headers }),
            fetch("https://shri-velan-food.onrender.com/api/users", { headers }),
            fetch("https://shri-velan-food.onrender.com/api/orders/monthly", { headers }),
          ]);

        const products = await productsRes.json();
        const categories = await categoriesRes.json();
        const orders = await ordersRes.json();
        const users = await usersRes.json();
        const ordersMonthly = await ordersMonthlyRes.json();

        setStats({
          products: products?.data?.length || 0,
          categories: categories?.data?.length || 0,
          orders: orders?.data?.length || 0,
          users: users?.data?.length || 0,
        });

        setMonthlyOrders(ordersMonthly?.data || []);
        
        // Mock category stats (replace with actual API)
        setCategoryStats([
          { name: 'Health Foods', value: 35 },
          { name: 'Snacks', value: 25 },
          { name: 'Beverages', value: 20 },
          { name: 'Sweets', value: 15 },
          { name: 'Others', value: 5 },
        ]);

        // Mock recent activity
        setRecentActivity([
          { id: 1, action: 'New order', description: 'Order #1234 placed', time: '2 min ago' },
          { id: 2, action: 'Product added', description: 'New health drink added', time: '1 hour ago' },
          { id: 3, action: 'User registered', description: 'New customer registered', time: '2 hours ago' },
        ]);

      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsCards = [
    { 
      title: "Total Products", 
      value: stats.products, 
      icon: <ShoppingBag size={24} />, 
      color: "bg-blue-500",
      trend: "+12%"
    },
    { 
      title: "Categories", 
      value: stats.categories, 
      icon: <Layers size={24} />, 
      color: "bg-green-500",
      trend: "+5%"
    },
    { 
      title: "Total Orders", 
      value: stats.orders, 
      icon: <BarChart3 size={24} />, 
      color: "bg-orange-500",
      trend: "+18%"
    },
    { 
      title: "Registered Users", 
      value: stats.users, 
      icon: <Users size={24} />, 
      color: "bg-purple-500",
      trend: "+8%"
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value.toLocaleString()}</h3>
                <p className="text-xs text-green-600 font-medium mt-1">{card.trend} from last month</p>
              </div>
              <div className={`p-3 rounded-lg ${card.color} text-white`}>
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Orders Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Orders</h3>
            <TrendingUp size={20} className="text-gray-400" />
          </div>
          <div className="h-80">
            {monthlyOrders.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyOrders}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="total" 
                    fill="#4f46e5"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Package size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No order data available</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Category Distribution</h3>
            <Layers size={20} className="text-gray-400" />
          </div>
          <div className="h-80">
            {categoryStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Layers size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No category data available</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}