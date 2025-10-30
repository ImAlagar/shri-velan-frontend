import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-[#1E1A2B] flex items-center justify-center p-4">
      <div className="bg-[#2C2638] p-8 rounded-2xl shadow-2xl text-center max-w-md">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-gray-400 mb-6">
          You don't have permission to access this page. This area is restricted to administrators only.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to="/dashboard-login"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            Admin Login
          </Link>
          <Link
            to="/"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;