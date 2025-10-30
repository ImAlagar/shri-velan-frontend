import React from 'react';
import { motion } from 'framer-motion';

const ChartCard = ({ title, icon, children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {icon}
      </div>
      {children}
    </motion.div>
  );
};

export default ChartCard;