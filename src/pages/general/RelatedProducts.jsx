import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const RelatedProducts = ({ currentProductId, categoryId }) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { data: productsData } = useProducts({ category: categoryId });
  
  const relatedProducts = productsData?.data?.products?.filter(
    product => product.id !== currentProductId
  ).slice(0, 8);

  // Auto-slide for mobile
  useEffect(() => {
    if (window.innerWidth >= 768 || !relatedProducts?.length) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = (prev + 1) % Math.ceil(relatedProducts.length / 2); // Show 2 cards per slide on mobile
        scrollToSlide(nextSlide);
        return nextSlide;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [relatedProducts]);

  const handleViewDetails = (product) => {
    navigate(`/product-details/${product.id}`, { state: { product } });
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 400;
    const newScrollLeft = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });

    setTimeout(updateArrowVisibility, 300);
  };

  const scrollToSlide = (slideIndex) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 280; // Approximate card width + gap
    const slidesPerView = window.innerWidth < 768 ? 2 : 1; // 2 cards per slide on mobile
    
    container.scrollTo({
      left: slideIndex * cardWidth * slidesPerView,
      behavior: 'smooth'
    });
  };

  const updateArrowVisibility = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(container.scrollLeft < (container.scrollWidth - container.clientWidth));
  };

  const handleScroll = () => {
    updateArrowVisibility();
    
    // Update current slide for mobile dots
    if (window.innerWidth < 768) {
      const container = scrollContainerRef.current;
      const cardWidth = 280;
      const slideIndex = Math.round(container.scrollLeft / (cardWidth * 2));
      setCurrentSlide(slideIndex);
    }
  };

  if (!relatedProducts?.length) return null;

  const totalSlides = Math.ceil(relatedProducts.length / (window.innerWidth < 768 ? 2 : 1));

  return (
    <section className="container mx-auto px-4 py-12 relative">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
        
      </div>

      {/* Scroll Container */}
      <div className="relative">
        {/* Left Arrow - Mobile & Desktop */}
        <button
          onClick={() => scroll('left')}
          disabled={!showLeftArrow}
          className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full border border-gray-300 transition-all duration-200 ${
            showLeftArrow 
              ? 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md cursor-pointer' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-0'
          } ${window.innerWidth < 768 ? 'flex' : 'hidden md:flex'}`}
        >
          <FaChevronLeft size={14} />
        </button>

        {/* Right Arrow - Mobile & Desktop */}
        <button
          onClick={() => scroll('right')}
          disabled={!showRightArrow}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full border border-gray-300 transition-all duration-200 ${
            showRightArrow 
              ? 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md cursor-pointer' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-0'
          } ${window.innerWidth < 768 ? 'flex' : 'hidden md:flex'}`}
        >
          <FaChevronRight size={14} />
        </button>

        {/* Left Gradient Overlay */}
        {showLeftArrow && (
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none hidden md:block" />
        )}

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto scrollbar-hide gap-6 pb-4 -mx-4 px-4 snap-x snap-mandatory scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {relatedProducts.map((product, index) => {
            const currentPrice = Math.min(
              product.offerPrice || Infinity, 
              product.normalPrice || Infinity
            );
            const originalPrice = product.offerPrice && product.normalPrice && 
                                product.offerPrice !== product.normalPrice 
                              ? Math.max(product.offerPrice, product.normalPrice)
                              : null;
            const hasDiscount = originalPrice && originalPrice > currentPrice;

            return (
              <div
                key={product.id}
                className="flex-none w-64 sm:w-72 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 snap-start cursor-pointer flex flex-col"
                onClick={() => handleViewDetails(product)}
              >
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-xl bg-gray-50">
                  <img
                    src={product.images?.[0] || '/images/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-product.jpg';
                    }}
                  />
                  
                  {/* Discount Badge */}
                  {hasDiscount && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight min-h-[3rem]">
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3 mt-auto">
                    <span className="text-xl font-bold text-green-700">
                      ₹{currentPrice}
                    </span>
                    {hasDiscount && (
                      <span className="text-gray-400 line-through text-sm">
                        ₹{originalPrice}
                      </span>
                    )}
                  </div>

                  {/* View Details Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(product);
                    }}
                    className="w-full bg-primary text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm mt-auto"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Gradient Overlay */}
        {showRightArrow && (
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none hidden md:block" />
        )}

        {/* Mobile Navigation Dots */}
        <div className="flex justify-center gap-2 mt-4 md:hidden">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                scrollToSlide(index);
              }}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide 
                  ? 'bg-green-600' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;