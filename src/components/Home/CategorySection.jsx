import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // ✅ Import Link
import { useActiveCategories } from "../../hooks/useCategories";

const CategorySection = () => {
  const { data: categoriesResponse = {}, isLoading, isError } = useActiveCategories();

  // Extract categories array
  const categories = categoriesResponse.data || [];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }
    }
  };

  const cardHoverVariants = {
    initial: { 
      scale: 1, 
      y: 0,
      rotate: 0
    },
    hover: { 
      scale: 1.03, 
      y: -8,
      rotate: 0,
      transition: { 
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 300,
        damping: 20
      } 
    }
  };

  const imageHoverVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="flex justify-center items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
            <p className="text-gray-600 text-sm sm:text-base">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (isError) {
    return (
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">😢</div>
          <p className="text-red-500 font-medium text-sm sm:text-base">Failed to load categories</p>
          <p className="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2">Please try again later</p>
        </div>
      </section>
    );
  }

  // Main Render
  return (
    <section className="py-12 lg:py-16 ">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-10 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-3 sm:mb-4">
            Shop By Category
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto px-4">
            Discover our carefully curated collection of products across various categories
          </p>
        </motion.div>

        {/* Category Grid */}
        {categories.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center py-10 sm:py-12"
          >
            <p className="text-gray-500 text-base sm:text-lg">No categories available at the moment.</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 
                       gap-3 sm:gap-4 md:gap-5 lg:gap-6"
          >
            {categories.map((cat) => (
              <motion.div
                key={cat.id}
                variants={itemVariants}
                whileHover="hover"
                initial="initial"
                className="group relative"
              >
                {/* ✅ Wrap the entire card with Link */}
                <Link to={`/category/${cat.id}`}>
                  <motion.div
                    variants={cardHoverVariants}
                    className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-2xl 
                               transition-all duration-300 p-3 sm:p-4 flex flex-col 
                               items-center cursor-pointer border border-gray-100 
                               group-hover:border-primary/20 group-hover:shadow-lg
                               relative overflow-hidden"
                  >
                    {/* Background Gradient on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl sm:rounded-2xl" />
                    
                    {/* Image Container */}
                    <div className="relative w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-44 
                                  flex items-center justify-center overflow-hidden rounded-lg sm:rounded-xl 
                                  mb-2 sm:mb-3 bg-gray-50 z-10">
                      <motion.img
                        variants={imageHoverVariants}
                        initial="initial"
                        whileHover="hover"
                        src={cat.image || "/placeholder.jpg"}
                        alt={cat.name}
                        className="object-contain w-full h-full p-2 transition-all duration-300"
                        onError={(e) => {
                          e.target.src = "/placeholder.jpg";
                        }}
                      />
                      
                      {/* Overlay Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                                    -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-20" />
                    </div>

                    {/* Category Name */}
                    <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-gray-800 text-center 
                                 group-hover:text-primary transition-all duration-300 relative z-10
                                 line-clamp-2 leading-tight sm:leading-normal">
                      {cat.name}
                    </h3>

                    {/* Subtle border animation */}
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-500 
                                  group-hover:w-4/5 group-hover:left-1/10 transition-all duration-500 transform" />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;