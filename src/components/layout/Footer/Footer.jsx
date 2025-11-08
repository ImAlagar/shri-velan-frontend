import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <>
      {/* --- SEO Structured Data --- */}
      <Helmet>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Shri Velan Organic Foods",
              "description": "Wholesome Goodness in Every Bite – Fresh, Fast & Flavorful organic foods",
              "url": "https://yourwebsite.com",
              "logo": "https://yourwebsite.com/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-9876543210",
                "contactType": "customer service",
                "email": "info@shrivelanorganic.com"
              },
              "sameAs": [
                "https://facebook.com/shrivelanorganic",
                "https://instagram.com/shrivelanorganic",
                "https://twitter.com/shrivelanorganic"
              ]
            }
          `}
        </script>
      </Helmet>

      {/* --- Footer Section --- */}
      <footer className="bg-gray-900 text-white">
        {/* Main Footer Content */}
        <motion.div
          className="container mx-auto px-5 lg:px-12 py-12 lg:py-16"
          initial="hidden"
          whileInView="visible"
          variants={footerVariants}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Company Info */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <h3 className="font-Italiana text-2xl font-semibold tracking-widest text-primary mb-4">
                Shri Velan Organic Foods
              </h3>
              <p className="font-SpaceGrotesk tracking-wide text-gray-300 leading-relaxed mb-6">
                Bringing you the purity of homemade traditional foods with love and care. 
                Wholesome goodness in every bite since 2023.
              </p>
              
              {/* Social Media Links */}
              <div className="flex space-x-4">
                {[
                  { icon: <FaFacebook />, url: "#", color: "hover:text-blue-400" },
                  { icon: <FaInstagram />, url: "#", color: "hover:text-pink-400" },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    className={`bg-gray-800 p-3 rounded-full transition duration-300 ${social.color} hover:bg-primary/20`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h4 className="font-SpaceGrotesk text-lg font-semibold tracking-wider mb-6 text-primary">
                Quick Links
              </h4>
              <ul className="space-y-3 font-SpaceGrotesk tracking-wide">
                {[
                  { name: "Home", path: "/" },
                  { name: "About Us", path: "/about" },
                  { name: "Products", path: "/products" },
                  { name: "Combo Products", path: "/combo-products" },
                  { name: "Contact Us", path: "/contact-us" }
                ].map((link, index) => (
                  <li key={index}>
                    <motion.a
                      href={link.path}
                      className="text-gray-300 hover:text-primary transition duration-300"
                      whileHover={{ x: 5 }}
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Products */}
            <motion.div variants={itemVariants}>
              <h4 className="font-SpaceGrotesk text-lg font-semibold tracking-wider mb-6 text-primary">
                Our Products
              </h4>
              <ul className="space-y-3 font-SpaceGrotesk tracking-wide">
                {[
                  "Healthy Noodles",
                  "Rice Porridge Mix",
                  "Malt Varieties",
                  "Muesli Bites",
                  "Organic Snacks",
                  "Traditional Mixes"
                ].map((product, index) => (
                  <li key={index}>
                    <motion.a
                      href="/products"
                      className="text-gray-300 hover:text-primary transition duration-300"
                      whileHover={{ x: 5 }}
                    >
                      {product}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants}>
              <h4 className="font-SpaceGrotesk text-lg font-semibold tracking-wider mb-6 text-primary">
                Contact Us
              </h4>
              <div className="space-y-4 font-SpaceGrotesk tracking-wide">
                {/* Phone */}
                <motion.div 
                  className="flex items-start space-x-3 text-gray-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <FaPhone className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href="tel:+919876543210" className="hover:text-primary transition">
                      +91 98765 43210
                    </a>
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div 
                  className="flex items-start space-x-3 text-gray-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <FaEnvelope className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:info@shrivelanorganic.com" className="hover:text-primary transition">
                      info@shrivelanorganic.com
                    </a>
                  </div>
                </motion.div>

                {/* Address */}
                <motion.div 
                  className="flex items-start space-x-3 text-gray-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p>123 Organic Street,<br />Health City, TN 600001</p>
                  </div>
                </motion.div>


              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-gray-700 py-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-5 lg:px-20">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Copyright */}
              <p className="font-SpaceGrotesk tracking-wide text-gray-400 text-center md:text-left">
                © {currentYear} Shri Velan Organic Foods. All rights reserved.
              </p>

              {/* Legal Links */}
              <div className="flex space-x-6 font-SpaceGrotesk tracking-wide text-sm">
                {[
                  { name: "Privacy Policy", path: "/privacy" },
                  { name: "Terms of Service", path: "/terms" },
                  { name: "Shipping & Delivery Policy", path: "/shipping" },
                  { name: "Cancellation & Refund Policy", path: "/cancellation" },
                ].map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.path}
                    className="text-gray-400 hover:text-primary transition duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Certification Badges */}
            <motion.div
              className="flex justify-center items-center space-x-6 mt-6 pt-6 border-t border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <div className="bg-primary/20 rounded-full p-3 inline-block">
                  <span className="text-2xl">🌿</span>
                </div>
                <p className="text-xs text-gray-400 mt-2 font-SpaceGrotesk">100% Organic</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/20 rounded-full p-3 inline-block">
                  <span className="text-2xl">⚡</span>
                </div>
                <p className="text-xs text-gray-400 mt-2 font-SpaceGrotesk">Fast Delivery</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/20 rounded-full p-3 inline-block">
                  <span className="text-2xl">❤️</span>
                </div>
                <p className="text-xs text-gray-400 mt-2 font-SpaceGrotesk">Made with Love</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </footer>
    </>
  );
};

export default Footer;