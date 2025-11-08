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
      type: "Name",
      examples: "Personal identification information"
    },
    {
      type: "Contact Information",
      examples: "Email address, phone number"
    },
    {
      type: "Demographic Information",
      examples: "Postcode, preferences and interests (if required)"
    },
    {
      type: "Other Information",
      examples: "Customer surveys and/or offers related data"
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
            Last updated: November 8, 2025
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
            This privacy policy sets out how NADESAN SARANYA uses and protects any information that you give NADESAN SARANYA when you visit their website and/or agree to purchase from them.
          </p>
          <p className="text-gray-700 leading-relaxed">
            NADESAN SARANYA is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, and then you can be assured that it will only be used in accordance with this privacy statement.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            NADESAN SARANYA may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you adhere to these changes.
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
                Internal Record Keeping
              </h3>
              <p className="text-gray-700">
                We maintain internal records of your information for business operations and compliance purposes.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Service Improvement
              </h3>
              <p className="text-gray-700">
                We use the information to improve our products and services based on customer needs and preferences.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Promotional Communication
              </h3>
              <p className="text-gray-700">
                We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Market Research
              </h3>
              <p className="text-gray-700">
                From time to time, we may use your information to contact you for market research purposes via email, phone, fax or mail.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Website Customization
              </h3>
              <p className="text-gray-700">
                We use the information to customise the website according to your interests and preferences.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Cookies Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            How We Use Cookies
          </h2>
          
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              A cookie is a small file which asks permission to be placed on your computer's hard drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Cookie Usage</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• We use traffic log cookies to identify which pages are being used</li>
                <li>• Helps us analyze data about webpage traffic and improve our website</li>
                <li>• We only use this information for statistical analysis purposes</li>
                <li>• Cookies help us provide you with a better website experience</li>
                <li>• A cookie gives us no access to your computer or any information about you</li>
              </ul>
            </div>

            <p className="text-gray-700 leading-relaxed">
              You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.
            </p>
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
                Data Security & Your Rights
              </h2>
              <p className="text-gray-600">
                How we protect your information and your rights
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Security Measures</h3>
              <p className="text-gray-700 mb-3 text-sm">
                We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure we have put in suitable physical, electronic and managerial procedures to safeguard and secure the information we collect online.
              </p>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Suitable physical security measures</li>
                <li>• Electronic security protocols</li>
                <li>• Managerial procedures for data protection</li>
                <li>• Regular security assessments</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Controlling Your Personal Information</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Look for opt-out boxes in forms to restrict direct marketing</li>
                <li>• Change your mind about marketing communications anytime</li>
                <li>• Request correction of incorrect information</li>
                <li>• We won't sell, distribute or lease your personal information to third parties without your permission</li>
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
            If you believe that any information we are holding on you is incorrect or incomplete, 
            please contact us as soon as possible. We will promptly correct any information found to be incorrect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = 'mailto:contact@shrivelanorganicfoods.com'}
            >
              Contact Privacy Team
            </motion.button>
            <motion.button
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = 'tel:9345447148'}
            >
              Call: 9345447148
            </motion.button>
          </div>
        </motion.div>

        {/* Update Notice */}
        <motion.div
          className="text-center mt-8 p-6 bg-yellow-50 rounded-xl border border-yellow-200"
          variants={itemVariants}
        >
          <p className="text-yellow-800 text-sm">
            <strong>Note:</strong> NADESAN SARANYA may change this policy from time to time by updating this page. 
            You should check this page from time to time to ensure that you are happy with any changes.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;