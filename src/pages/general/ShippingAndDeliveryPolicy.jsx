import React from 'react';
import { motion } from 'framer-motion';
import { FiTruck, FiGlobe, FiClock, FiPackage } from 'react-icons/fi';

const ShippingAndDeliveryPolicy = () => {
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

  const shippingInfo = [
    {
      icon: FiGlobe,
      title: "International Shipping",
      content: "For International buyers, orders are shipped and delivered through registered international courier companies and/or International speed post only."
    },
    {
      icon: FiTruck,
      title: "Domestic Shipping",
      content: "For domestic buyers, orders are shipped through registered domestic courier companies and/or speed post only."
    },
    {
      icon: FiClock,
      title: "Shipping Time",
      content: "Orders are shipped within 0-7 days or as per the delivery date agreed at the time of order confirmation."
    },
    {
      icon: FiPackage,
      title: "Delivery Terms",
      content: "Delivery of all orders will be to the address provided by the buyer. Delivery of our services will be confirmed on your mail ID."
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
            <FiTruck className="text-white text-2xl" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-SpaceGrotesk">
            Shipping & Delivery Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Understand our shipping process and delivery timelines
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
            Shipping Information
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This policy outlines how we handle shipping and delivery for all orders placed through our platform.
          </p>
        </motion.div>

        {/* Shipping Methods */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {shippingInfo.map((item, index) => (
            <motion.div
              key={item.title}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100"
              variants={itemVariants}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <item.icon className="text-primary text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {item.title}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {item.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Detailed Policy */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Detailed Shipping Policy
          </h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-green-500 pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Shipping Partners
              </h3>
              <p className="text-gray-700">
                We partner with reputable courier services and postal authorities to ensure safe and timely delivery of your orders.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delivery Timeline
              </h3>
              <p className="text-gray-700">
                Orders are shipped within 0-7 days from the date of order and payment, or as per the delivery date agreed at the time of order confirmation. Delivering of the shipment is subject to Courier Company / post office norms.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Liability Disclaimer
              </h3>
              <p className="text-gray-700">
                NADESAN SARANYA is not liable for any delay in delivery by the courier company / postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within 0-7 days from the date of the order and payment or as per the delivery date agreed at the time of order confirmation.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delivery Address
              </h3>
              <p className="text-gray-700">
                Delivery of all orders will be to the address provided by the buyer. Please ensure your shipping address is complete and accurate to avoid delivery issues.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Service Confirmation
              </h3>
              <p className="text-gray-700">
                Delivery of our services will be confirmed on your mail ID as specified during registration.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Support Section */}
        <motion.div
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-8 text-center text-white"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold mb-4">
            Need Help with Shipping?
          </h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            For any issues in utilizing our services or questions about your order delivery, please contact our helpdesk.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = 'tel:9345447148'}
            >
              Call: 9345447148
            </motion.button>
            <motion.button
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = 'mailto:contact@shrivelanorganicfoods.com'}
            >
              Email Support
            </motion.button>
          </div>
        </motion.div>

        {/* Important Note */}
        <motion.div
          className="text-center mt-8 p-6 bg-yellow-50 rounded-xl border border-yellow-200"
          variants={itemVariants}
        >
          <p className="text-yellow-800 text-sm">
            <strong>Important:</strong> Please ensure your contact information and shipping address are accurate. 
            We are not responsible for delays caused by incorrect address information or circumstances beyond our control.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ShippingAndDeliveryPolicy;