import React from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiUser, FiInfo } from 'react-icons/fi';

const ContactUsPolicy = () => {
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

  const contactDetails = [
    {
      icon: FiUser,
      title: "Merchant Legal Entity Name",
      content: "NADESAN SARANYA"
    },
    {
      icon: FiMapPin,
      title: "Registered Address",
      content: "26a, Kasukadai Street, Thathayengarpet block, Tiruchirappalli, TAMIL NADU 621210"
    },
    {
      icon: FiMapPin,
      title: "Operational Address", 
      content: "26a, Kasukadai Street, Thathayengarpet block, Tiruchirappalli, TAMIL NADU 621210"
    },
    {
      icon: FiPhone,
      title: "Telephone Number",
      content: "9345447148"
    },
    {
      icon: FiMail,
      title: "Email ID",
      content: "contact@shrivelanorganicfoods.com"
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
            <FiInfo className="text-white text-2xl" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-SpaceGrotesk">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            How to get in touch with us - official contact information and policies
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Last updated: November 8, 2025
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Contact Information Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This page contains the official contact information for NADESAN SARANYA. 
            Please use the details below to get in touch with us for any queries, 
            support, or business communications.
          </p>
        </motion.div>

        {/* Contact Details Grid */}
        <div className="grid gap-6 mb-12">
          {contactDetails.map((detail, index) => (
            <motion.div
              key={detail.title}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100"
              variants={itemVariants}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <detail.icon className="text-primary text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {detail.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {detail.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>



        {/* Quick Actions */}
        <motion.div
          className="bg-gradient-to-r from-primary to-primary/90 rounded-2xl shadow-lg p-8 text-center text-white"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold mb-4">
            Ready to Get in Touch?
          </h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Use the contact information above to reach out to us. We're here to help with any questions or concerns you may have.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = 'tel:9345447148'}
            >
              Call Now
            </motion.button>
            <motion.button
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = 'mailto:contact@shrivelanorganicfoods.com'}
            >
              Send Email
            </motion.button>
          </div>
        </motion.div>

        {/* Update Notice */}
        <motion.div
          className="text-center mt-8 p-6 bg-yellow-50 rounded-xl border border-yellow-200"
          variants={itemVariants}
        >
          <p className="text-yellow-800 text-sm">
            <strong>Note:</strong> This contact information is updated regularly. 
            In case of any changes, the most current information will be reflected on this page.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ContactUsPolicy;