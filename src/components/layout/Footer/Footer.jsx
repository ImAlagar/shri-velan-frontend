import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useProducts } from "../../../hooks/useProducts";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Fetch products from API with debugging
  const { data: productsData, isLoading, error } = useProducts({
    limit: 5,
    page: 1
  });


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

  // Get products with better error handling
  const getProducts = () => {
    if (isLoading) {
      return null;
    }

    if (error) {
      console.error('Products fetch error:', error);
      return null;
    }

    // Try different possible response structures
    const products = 
      productsData?.products || 
      productsData?.data?.products || 
      productsData?.data ||
      productsData ||
      [];

    return Array.isArray(products) ? products.slice(0, 5) : [];
  };

  const products = getProducts();

  return (
    <>
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
                "https://www.facebook.com/share/1Cw3cEfV86/",
                "https://www.instagram.com/shrivelanorganicfoods?igsh=cnJhbHp3b2owbXQ3",
                "https://youtube.com/@shrivelan_healthmix",
              ]
            }
          `}
        </script>
      </Helmet>

      <footer className="bg-gray-900 text-white">
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
              
              <div className="flex space-x-4">
                {[
                  { icon: <FaFacebook />, url: "https://www.facebook.com/share/1Cw3cEfV86/", color: "hover:text-blue-400" },
                  { icon: <FaInstagram />, url: "https://www.instagram.com/shrivelanorganicfoods?igsh=cnJhbHp3b2owbXQ3", color: "hover:text-pink-400" },
                  { icon: <FaYoutube />, url: "https://youtube.com/@shrivelan_healthmix", color: "hover:text-red-400" },
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
                  { name: "Contact Us", path: "/contact" }
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

            {/* Products Section */}
            <motion.div variants={itemVariants}>
              <h4 className="font-SpaceGrotesk text-lg font-semibold tracking-wider mb-6 text-primary">
                Our Products
              </h4>
              <ul className="space-y-3 font-SpaceGrotesk tracking-wide">
                {isLoading ? (
                  // Loading state
                  Array.from({ length: 5 }).map((_, index) => (
                    <li key={index}>
                      <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                    </li>
                  ))
                ) : error ? (
                  // Error state
                  <li className="text-yellow-500">Failed to load products</li>
                ) : products && products.length > 0 ? (
                  // Success state - show products from API
                  products.map((product, index) => (
                    <li key={product._id || product.id || index}>
                      <motion.a
                        href={`/products/${product.slug || product._id}`}
                        className="text-gray-300 hover:text-primary transition duration-300"
                        whileHover={{ x: 5 }}
                      >
                        {product.name || product.title || `Product ${index + 1}`}
                      </motion.a>
                    </li>
                  ))
                ) : (
                  // No products available
                  <li className="text-gray-400">No products available</li>
                )}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants}>
              <h4 className="font-SpaceGrotesk text-lg font-semibold tracking-wider mb-6 text-primary">
                Contact Us
              </h4>
              <div className="space-y-4 font-SpaceGrotesk tracking-wide">
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
        <motion.footer
          className="border-t border-gray-700 py-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-16">
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
              <p className="font-SpaceGrotesk tracking-wide text-gray-400 text-sm sm:text-base">
                © {currentYear} Shri Velan Organic Foods. All rights reserved.
              </p>

              <div className="flex flex-wrap justify-center md:justify-end gap-4 sm:gap-6 font-SpaceGrotesk tracking-wide text-xs sm:text-sm">
                {[
                  { name: "Privacy Policy", path: "/privacy" },
                  { name: "Terms of Service", path: "/terms" },
                  { name: "Shipping & Delivery Policy", path: "/shipping" },
                  { name: "Cancellation & Refund Policy", path: "/cancellation" },
                  { name: "Contact Us", path: "/contact-us" },
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

            <motion.div
              className="flex flex-wrap justify-center items-center gap-6 mt-8 pt-6 border-t border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {[
                { icon: "🌿", text: "100% Organic" },
                { icon: "⚡", text: "Fast Delivery" },
                { icon: "❤️", text: "Made with Love" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="bg-primary/20 rounded-full p-4 inline-flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl">{item.icon}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 mt-2 font-SpaceGrotesk">{item.text}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.footer>
      </footer>
    </>
  );
};

export default Footer;