import React, { useState } from 'react';
import { FiSave, FiBell, FiShield, FiCreditCard, FiGlobe } from 'react-icons/fi';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    storeName: 'Shri Velan Organic Foods',
    storeEmail: 'contact@shrivelanorganic.com',
    currency: 'USD',
    timezone: 'UTC-5',
    
    // Notification Settings
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    newsletter: false,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    
    // Payment Settings
    stripeEnabled: true,
    paypalEnabled: true,
    cashOnDelivery: true
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // Handle settings save
    console.log('Saving settings:', settings);
    // Typically you would make an API call here
  };

  const tabs = [
    { id: 'general', name: 'General', icon: <FiGlobe className="w-4 h-4" /> },
    { id: 'notifications', name: 'Notifications', icon: <FiBell className="w-4 h-4" /> },
    { id: 'security', name: 'Security', icon: <FiShield className="w-4 h-4" /> },
    { id: 'payments', name: 'Payments', icon: <FiCreditCard className="w-4 h-4" /> }
  ];

  return (
    <div className="p-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your store settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border border-blue-100'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={settings.storeName}
                      onChange={(e) => handleSettingChange('storeName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Email
                    </label>
                    <input
                      type="email"
                      value={settings.storeEmail}
                      onChange={(e) => handleSettingChange('storeEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={settings.currency}
                      onChange={(e) => handleSettingChange('currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleSettingChange('timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="UTC-5">EST (UTC-5)</option>
                      <option value="UTC-8">PST (UTC-8)</option>
                      <option value="UTC+0">GMT (UTC+0)</option>
                      <option value="UTC+5:30">IST (UTC+5:30)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
                
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive email notifications for important events' },
                    { key: 'orderNotifications', label: 'Order Notifications', description: 'Get notified when new orders are placed' },
                    { key: 'lowStockAlerts', label: 'Low Stock Alerts', description: 'Receive alerts when product stock is low' },
                    { key: 'newsletter', label: 'Newsletter', description: 'Subscribe to our monthly newsletter' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings[item.key]}
                          onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.twoFactorAuth}
                        onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                      min="5"
                      max="120"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Expiry (days)
                    </label>
                    <input
                      type="number"
                      value={settings.passwordExpiry}
                      onChange={(e) => handleSettingChange('passwordExpiry', parseInt(e.target.value))}
                      min="30"
                      max="365"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Payment Settings</h3>
                
                <div className="space-y-4">
                  {[
                    { key: 'stripeEnabled', label: 'Stripe Payments', description: 'Accept payments via Stripe' },
                    { key: 'paypalEnabled', label: 'PayPal', description: 'Accept payments via PayPal' },
                    { key: 'cashOnDelivery', label: 'Cash on Delivery', description: 'Offer cash on delivery option' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings[item.key]}
                          onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={handleSaveSettings}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiSave className="w-4 h-4" />
                <span>Save Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;