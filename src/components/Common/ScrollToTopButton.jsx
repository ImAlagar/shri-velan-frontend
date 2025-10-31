// src/components/Common/ScrollToTopButton.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hideOnRoutes = ['/admin'];
  const shouldHide = hideOnRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  if (shouldHide || !isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed right-6 bottom-20 z-50 w-12 h-12 bg-primary hover:bg-primary text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
      aria-label="Scroll to top"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
};

export default ScrollToTopButton;