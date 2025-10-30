import React from 'react';
import { motion } from 'framer-motion';
import AuthLoader from './AuthLoader';

const AuthForm = ({ 
  title, 
  subtitle, 
  children, 
  onSubmit, 
  loading, 
  buttonText = "Submit",
  footerText,
  footerLink,
  footerLinkText,
  imageUrl = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  imageAlt = "Organic Food",
  overlayTitle = "Fresh Organic Delights",
  overlaySubtitle = "Taste the purity of nature in every bite"
}) => {
  return (
    <section className="bg-[#1E1A2B] min-h-screen flex items-center justify-center px-5 lg:px-20 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col md:flex-row bg-[#2C2638] rounded-3xl overflow-hidden shadow-2xl w-full max-w-6xl"
      >
        {/* Form Content */}
        <div className="w-full md:w-1/2 bg-[#2C2638] flex flex-col justify-center p-10 md:p-16">
          <h1 className="text-3xl font-semibold text-white mb-5 text-center">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-gray-400 text-center text-sm mb-6">
              {subtitle}
            </p>
          )}

          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            {children}

            <button
              type="submit"
              disabled={loading}
              className={`${
                loading
                  ? "bg-transparent cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              } text-white font-semibold flex items-center justify-center py-3 rounded-xl mt-3 transition-all`}
            >
              {loading ? <AuthLoader /> : buttonText}
            </button>
          </form>

          {footerText && (
            <p className="text-center text-gray-400 mt-6 text-sm">
              {footerText}{" "}
              <a href={footerLink} className="text-purple-400 hover:underline">
                {footerLinkText}
              </a>
            </p>
          )}
        </div>

        {/* Image Section - This was missing! */}
        <div className="hidden md:block w-1/2 relative overflow-hidden">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Text overlay */}
          <div className="absolute bottom-10 left-0 right-0 text-center px-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              {overlayTitle}
            </h3>
            <p className="text-gray-200 text-lg">
              {overlaySubtitle}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AuthForm;