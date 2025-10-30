import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon, color, trend }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</h3>
          {trend && (
            <p className="text-xs text-green-600 font-medium mt-1">{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color} text-white`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;