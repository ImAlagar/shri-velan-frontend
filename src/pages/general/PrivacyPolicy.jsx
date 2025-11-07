import React from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiLock, FiEye, FiDatabase, FiMail, FiUser } from 'react-icons/fi';

const PrivacyPolicy = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const privacyPoints = [
    {
      icon: FiUser,
      title: "Information Collection",
      content: "We collect personal information you provide directly to us, such as name, email, and contact details."
    },
    {
      icon: FiDatabase,
      title: "Data Usage",
      content: "Your information is used to provide and improve our services, process transactions, and communicate with you."
    },
    {
      icon: FiShield,
      title: "Data Protection",
      content: "We implement security measures to protect your personal information from unauthorized access."
    },
    {
      icon: FiEye,
      title: "Third-Party Sharing",
      content: "We do not sell your personal information. We may share data with trusted service providers."
    }
  ];

  const dataTypes = [
    {
      type: "Personal Information",
      examples: "Name, email address, phone number, shipping address"
    },
    {
      type: "Payment Information",
      examples: "Credit card details, billing address (processed securely by payment processors)"
    },
    {
      type: "Technical Data",
      examples: "IP address, browser type, device information, cookies"
    },
    {
      type: "Usage Data",
      examples: "Pages visited, products viewed, time spent on site"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          variants={itemVariants}
        >
          <motion.div
            className="w-20 h-20 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <FiShield className="text-white text-2xl" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-SpaceGrotesk">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your personal information.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Our Commitment to Your Privacy
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We are committed to protecting your privacy and ensuring that your personal 
            information is handled in a safe and responsible manner. This policy outlines 
            how we collect, use, and protect the information you provide to us.
          </p>
          <p className="text-gray-700 leading-relaxed">
            By using our website and services, you agree to the collection and use of 
            information in accordance with this policy.
          </p>
        </motion.div>

        {/* Key Privacy Points */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {privacyPoints.map((point, index) => (
            <motion.div
              key={point.title}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100"
              variants={itemVariants}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <point.icon className="text-primary text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {point.title}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {point.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Data Collection Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Information We Collect
          </h2>
          
          <div className="grid gap-4 mb-6">
            {dataTypes.map((dataType, index) => (
              <div key={dataType.type} className="flex items-start py-3 border-b border-gray-100 last:border-b-0">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  <FiDatabase className="text-primary text-sm" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {dataType.type}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {dataType.examples}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Detailed Sections */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            How We Use Your Information
          </h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-primary pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Service Provision
              </h3>
              <p className="text-gray-700">
                To process your orders, manage your account, and provide customer support.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Communication
              </h3>
              <p className="text-gray-700">
                To send you important updates, order confirmations, and respond to your inquiries.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Personalization
              </h3>
              <p className="text-gray-700">
                To personalize your experience and provide content and product recommendations.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Analytics
              </h3>
              <p className="text-gray-700">
                To analyze website usage and improve our services, products, and user experience.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Security Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          variants={itemVariants}
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <FiLock className="text-green-600 text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Data Security
              </h2>
              <p className="text-gray-600">
                How we protect your information
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Security Measures</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• SSL encryption for data transmission</li>
                <li>• Secure payment processing</li>
                <li>• Regular security audits</li>
                <li>• Access controls and authentication</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Your Rights</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Access your personal data</li>
                <li>• Correct inaccurate information</li>
                <li>• Request data deletion</li>
                <li>• Opt-out of marketing communications</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Contact & Updates */}
        <motion.div
          className="bg-gradient-to-r from-primary to-primary/90 rounded-2xl shadow-lg p-8 text-center text-white"
          variants={itemVariants}
        >
          <div className="flex justify-center mb-4">
            <FiMail className="text-2xl text-primary-100" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">
            Privacy Questions?
          </h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            If you have any questions about our Privacy Policy or how we handle your data, 
            please don't hesitate to contact our privacy team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Privacy Team
            </motion.button>
            <motion.button
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Download Data
            </motion.button>
          </div>
        </motion.div>

        {/* Update Notice */}
        <motion.div
          className="text-center mt-8 p-6 bg-yellow-50 rounded-xl border border-yellow-200"
          variants={itemVariants}
        >
          <p className="text-yellow-800 text-sm">
            <strong>Note:</strong> We may update this Privacy Policy from time to time. 
            We will notify you of any changes by posting the new Privacy Policy on this page 
            and updating the "Last updated" date.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;