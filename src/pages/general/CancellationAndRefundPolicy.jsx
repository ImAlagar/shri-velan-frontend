import React from 'react';
import { motion } from 'framer-motion';
import { FiRefreshCw, FiXCircle, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const CancellationAndRefundPolicy = () => {
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

  const policyPoints = [
    {
      icon: FiXCircle,
      title: "Cancellation Policy",
      content: "Cancellations will be considered only if the request is made within Not Applicable of placing the order."
    },
    {
      icon: FiAlertTriangle,
      title: "Perishable Items",
      content: "We do not accept cancellation requests for perishable items like flowers, eatables etc."
    },
    {
      icon: FiCheckCircle,
      title: "Quality Issues",
      content: "Refund/replacement can be made if the customer establishes that the quality of product delivered is not good."
    },
    {
      icon: FiRefreshCw,
      title: "Refund Processing",
      content: "In case of any Refunds approved, it'll take Not Applicable for the refund to be processed to the end customer."
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
            <FiRefreshCw className="text-white text-2xl" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-SpaceGrotesk">
            Cancellation & Refund Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our policies for order cancellations and refund requests
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
            Our Cancellation & Refund Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            NADESAN SARANYA believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. Under this policy:
          </p>
        </motion.div>

        {/* Policy Points */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {policyPoints.map((point, index) => (
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

        {/* Detailed Policy */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Detailed Policy Information
          </h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-orange-500 pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Order Cancellation
              </h3>
              <p className="text-gray-700">
                Cancellations will be considered only if the request is made within Not Applicable of placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Perishable Items
              </h3>
              <p className="text-gray-700">
                NADESAN SARANYA does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Damaged or Defective Items
              </h3>
              <p className="text-gray-700">
                In case of receipt of damaged or defective items please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within Not Applicable of receipt of the products.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Product Quality & Expectations
              </h3>
              <p className="text-gray-700">
                In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within Not Applicable of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Manufacturer Warranty
              </h3>
              <p className="text-gray-700">
                In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them according to the manufacturer's warranty terms and conditions.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Refund Processing
              </h3>
              <p className="text-gray-700">
                In case of any Refunds approved by the NADESAN SARANYA, it'll take Not Applicable for the refund to be processed to the end customer. The refund will be processed through the original payment method used for the purchase.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg p-8 text-center text-white"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold mb-4">
            Need Help with Cancellation or Refund?
          </h2>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Our customer service team is here to help you with any questions regarding cancellations, returns, or refunds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = 'tel:9345447148'}
            >
              Call Customer Service
            </motion.button>
            <motion.button
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = 'mailto:contact@shrivelanorganicfoods.com'}
            >
              Email Us
            </motion.button>
          </div>
        </motion.div>

        {/* Important Note */}
        <motion.div
          className="text-center mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200"
          variants={itemVariants}
        >
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> All cancellation and refund requests are subject to verification and approval by our team. 
            Please ensure you provide complete details and supporting evidence when submitting your request.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CancellationAndRefundPolicy;