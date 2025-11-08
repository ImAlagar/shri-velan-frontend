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
      title: "Content Changes",
      content: "The content of the pages of this website is subject to change without notice."
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
            Last updated: November 8, 2025
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
          <p className="text-gray-700 leading-relaxed mb-4">
            For the purpose of these Terms and Conditions, The term "we", "us", "our" used anywhere on this page shall mean NADESAN SARANYA, whose registered/operational office is 26a, Kasukadai Street , Thathayengarpet block Tiruchirappalli TAMIL NADU 621210. "you", "your", "user", "visitor" shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Your use of the website and/or purchase from us are governed by following Terms and Conditions:
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
                Content Accuracy
              </h3>
              <p className="text-gray-700">
                Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                User Responsibility
              </h3>
              <p className="text-gray-700">
                Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Intellectual Property
              </h3>
              <p className="text-gray-700">
                Our website contains material which is owned by or licensed to us. This material includes, but are not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions. All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Unauthorized Use & Links
              </h3>
              <p className="text-gray-700">
                Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense. From time to time our website may also include links to other websites. These links are provided for your convenience to provide further information. You may not create a link to our website from another website or document without NADESAN SARANYA's prior written consent.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Governing Law & Disputes
              </h3>
              <p className="text-gray-700">
                Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India. We, shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time.
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 inline-block"
            >
              Contact Support
            </Link>
            <button
              onClick={() => window.location.href = 'mailto:contact@shrivelanorganicfoods.com'}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors duration-300"
            >
              Email Us
            </button>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          className="text-center mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200"
          variants={itemVariants}
        >
          <p className="text-blue-800 text-sm">
            <strong>Registered Office:</strong> 26a, Kasukadai Street, Thathayengarpet block, Tiruchirappalli, TAMIL NADU 621210
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TermsAndConditions;