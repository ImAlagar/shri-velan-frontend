// src/components/layout/Topbar.jsx
import React from "react";
import {
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Topbar = () => {
  // Content for scrolling animation
  const topbarContent = [
    "+91 98765 43210",
    "info@shrivelanorganic.com", 
    "123 Organic Street, Health City, TN 600001"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="bg-primary text-white relative overflow-hidden sticky top-0 z-50"
    >
      <div className="relative py-2">
        {/* Scrolling Contact Info */}
        <div className="overflow-hidden whitespace-nowrap">
          <motion.div
            className="inline-flex items-center space-x-8 text-sm font-medium text-white"
            animate={{ 
              x: [0, -1200],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear"
              }
            }}
          >
            {/* Multiple copies for seamless looping */}
            {[...Array(3)].map((_, copyIndex) => (
              <div key={copyIndex} className="inline-flex items-center space-x-8">
                {topbarContent.map((text, index) => (
                  <div key={`${copyIndex}-${index}`} className="inline-flex items-center space-x-2">
                    <span className="flex items-center whitespace-nowrap">
                      {text}
                    </span>
                    {index < topbarContent.length - 1 && (
                      <span className="text-white/60">•</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Social Media Overlay - Right Side */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 hidden md:flex items-center space-x-3 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
          {[
            { Icon: FaFacebook, link: "#" },
            { Icon: FaInstagram, link: "#" },
          ].map(({ Icon, link }, index) => (
            <motion.a
              key={index}
              href={link}
              className="text-white hover:text-yellow-300 transition-colors"
              whileHover={{ scale: 1.2, rotate: 10 }}
            >
              <Icon className="w-3 h-3" />
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Topbar;