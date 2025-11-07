import React from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiFileText, FiAlertCircle, FiUserCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
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

  const sections = [
    {
      icon: FiUserCheck,
      title: "Acceptance of Terms",
      content: "By accessing and using our website, you accept and agree to be bound by the terms and provision of this agreement."
    },
    {
      icon: FiFileText,
      title: "User Responsibilities",
      content: "You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer."
    },
    {
      icon: FiShield,
      title: "Intellectual Property",
      content: "All content included on this site, such as text, graphics, logos, images, and software, is the property of our company."
    },
    {
      icon: FiAlertCircle,
      title: "Limitation of Liability",
      content: "We shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service."
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
            <FiFileText className="text-white text-2xl" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-SpaceGrotesk">
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Welcome to Our Platform
          </h2>
          <p className="text-gray-700 leading-relaxed">
            These Terms and Conditions govern your use of our website and services. 
            Please read them carefully before using our platform. By accessing or using 
            our service, you agree to be bound by these terms.
          </p>
        </motion.div>

        {/* Main Content Sections */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100"
              variants={itemVariants}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <section.icon className="text-primary text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {section.title}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Detailed Sections */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Detailed Terms & Conditions
          </h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-primary pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                1. Account Registration
              </h3>
              <p className="text-gray-700">
                You must be at least 18 years old to create an account. You are responsible 
                for maintaining the security of your account and for all activities that 
                occur under your account.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                2. Product Information
              </h3>
              <p className="text-gray-700">
                We strive to provide accurate product information, but we do not warrant 
                that product descriptions or other content is accurate, complete, reliable, 
                current, or error-free.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                3. Pricing and Payments
              </h3>
              <p className="text-gray-700">
                All prices are subject to change without notice. We reserve the right to 
                discontinue any product at any time. Payment must be completed before 
                order processing.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                4. Shipping and Delivery
              </h3>
              <p className="text-gray-700">
                Shipping times are estimates and not guaranteed. Risk of loss and title 
                for items pass to you upon delivery to the carrier.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                5. Returns and Refunds
              </h3>
              <p className="text-gray-700">
                Please review our return policy for detailed information about returns 
                and refunds. Some products may have different return policies.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                6. Prohibited Uses
              </h3>
              <p className="text-gray-700">
                You may not use our products for any illegal or unauthorized purpose. 
                You must not transmit any worms, viruses, or any code of a destructive nature.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          className="bg-gradient-to-r from-primary to-primary/90 rounded-2xl shadow-lg p-8 text-center text-white"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold mb-4">
            Questions About Our Terms?
          </h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            If you have any questions about these Terms and Conditions, please contact us.
          </p>
          <Link to={'/contact'}
            className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Support
          </Link>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          className="text-center mt-8"
          variants={itemVariants}
        >
          <p className="text-gray-500 text-sm">
            By using our service, you acknowledge that you have read, understood, 
            and agree to be bound by these Terms and Conditions.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TermsAndConditions;