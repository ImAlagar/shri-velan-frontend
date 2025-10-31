// src/components/Common/FloatingCartButton.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const FloatingCartButton = () => {
  const location = useLocation();

  const openCart = () => {
    // Your cart opening logic here
    console.log('Open cart');
  };

  const hideOnRoutes = ['/admin', '/login', '/register'];
  const shouldHide = hideOnRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  if (shouldHide) return null;

  return (
    <button
      onClick={openCart}
      className="fixed right-6 bottom-6 z-50 w-12 h-12 bg-primary hover:bg-primary text-white rounded-full shadow-lg flex items-center justify-center relative transition-all duration-300 hover:scale-110"
      aria-label="Open cart"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        0
      </span>
    </button>
  );
};

export default FloatingCartButton;