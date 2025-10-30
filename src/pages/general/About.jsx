import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

export default function About() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
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

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <section
      className="bg-gradient-to-br from-primary/50 to-white px-5 lg:px-20 py-16 lg:py-24"
      id="about"
    >
      {/* --- SEO Meta Tags --- */}
      <Helmet>
        <title>About Us | Shri Velan Organic Foods - Our Story & Mission</title>
        <meta
          name="description"
          content="Learn about Shri Velan Organic Foods' journey since 2023 - from homemade traditional foods to trusted natural, healthy mixes made with love and care."
        />
        <meta
          name="keywords"
          content="about Shri Velan, our story, organic food journey, traditional foods, healthy mixes, company mission"
        />
        <meta property="og:title" content="About Shri Velan Organic Foods" />
        <meta
          property="og:description"
          content="Discover our journey of sharing purity and tradition through handmade organic foods since 2023."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* --- Header Section --- */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-Italiana text-lg font-semibold tracking-widest uppercase text-primary mb-4">
          Our Story
        </h1>
        <h2 className="text-4xl lg:text-5xl font-SpaceGrotesk text-gray-800 tracking-wide">
          From Our Kitchen to <span className="text-primary">Your Home</span>
        </h2>
        <div className="w-24 h-1 bg-primary mx-auto mt-6"></div>
      </motion.div>

      {/* --- Main Content --- */}
      <motion.div
        className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* --- Left Content --- */}
        <motion.div
          className="lg:w-1/2 flex flex-col gap-8"
          variants={itemVariants}
        >
          <motion.div
            className="flex items-start gap-4"
            variants={itemVariants}
          >
            <span className="text-2xl text-primary mt-1">❤</span>
            <div>
              <h3 className="text-2xl font-SpaceGrotesk font-semibold text-gray-800 mb-4">
                Our Beginning
              </h3>
              <p className="font-SpaceGrotesk tracking-wide text-gray-700 leading-relaxed text-lg">
                <strong>Shri Velan Organic Foods</strong>, started in January 2023, began with a simple dream — to share the purity of homemade traditional foods with every family.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-start gap-4"
            variants={itemVariants}
          >
            <span className="text-2xl text-primary mt-1">🌱</span>
            <div>
              <h3 className="text-2xl font-SpaceGrotesk font-semibold text-gray-800 mb-4">
                Our Growth
              </h3>
              <p className="font-SpaceGrotesk tracking-wide text-gray-700 leading-relaxed text-lg">
                What started as small-batch kitchen preparations soon grew into a trusted name for natural, healthy mixes made with <strong>love and care</strong>.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-start gap-4"
            variants={itemVariants}
          >
            <span className="text-2xl text-primary mt-1">🤝</span>
            <div>
              <h3 className="text-2xl font-SpaceGrotesk font-semibold text-gray-800 mb-4">
                Our Belief
              </h3>
              <p className="font-SpaceGrotesk tracking-wide text-gray-700 leading-relaxed text-lg">
                We believe that food is not just nourishment, but a <strong>bond of trust</strong>. That's why every product we make is handcrafted, hygienically packed, and free from chemicals — just the way you'd make it at home.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-start gap-4"
            variants={itemVariants}
          >
            <span className="text-2xl text-primary mt-1">✨</span>
            <div>
              <h3 className="text-2xl font-SpaceGrotesk font-semibold text-gray-800 mb-4">
                Our Promise
              </h3>
              <p className="font-SpaceGrotesk tracking-wide text-gray-700 leading-relaxed text-lg">
                From porridge mixes to malt powders and muesli, each blend is a reminder that healthy food can be <strong>delicious, simple, and made with heart</strong>.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* --- Right Image/Content --- */}
        <motion.div
          className="lg:w-1/2"
          variants={imageVariants}
        >
          <div className="bg-white/70 rounded-3xl p-8 lg:p-12 shadow-xl border border-primary/20">
            <h3 className="text-3xl font-SpaceGrotesk font-bold text-primary text-center mb-8">
              Why Choose Us?
            </h3>
            
            <div className="space-y-6">
              <motion.div 
                className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-3xl">👩‍🍳</span>
                <div>
                  <h4 className="font-SpaceGrotesk font-semibold text-gray-800">Handcrafted with Care</h4>
                  <p className="font-SpaceGrotesk text-sm text-gray-600">Every batch made with personal attention</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center gap-4 p-4 bg-green-50 rounded-xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-3xl">🌿</span>
                <div>
                  <h4 className="font-SpaceGrotesk font-semibold text-gray-800">100% Natural</h4>
                  <p className="font-SpaceGrotesk text-sm text-gray-600">No chemicals, no preservatives</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-3xl">🏠</span>
                <div>
                  <h4 className="font-SpaceGrotesk font-semibold text-gray-800">Home-style Quality</h4>
                  <p className="font-SpaceGrotesk text-sm text-gray-600">Just like homemade, but conveniently packed</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-3xl">💝</span>
                <div>
                  <h4 className="font-SpaceGrotesk font-semibold text-gray-800">Made with Love</h4>
                  <p className="font-SpaceGrotesk text-sm text-gray-600">Passion in every product we create</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* --- Mission Statement --- */}
      <motion.div
        className="mt-20 text-center bg-white/50 rounded-3xl p-8 lg:p-12 shadow-lg"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <motion.span 
          className="text-5xl mb-6 block"
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
        >
          🌟
        </motion.span>
        <h3 className="text-2xl lg:text-3xl font-SpaceGrotesk font-semibold text-gray-800 mb-6">
          Bringing Generations of Tradition to Your Table
        </h3>
        <p className="font-SpaceGrotesk tracking-wide text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto">
          At Shri Velan Organic Foods, we're not just making food – we're preserving traditions, 
          building trust, and creating healthy habits for generations to come. Join us in our journey 
          to make every meal a celebration of purity and taste.
        </p>
      </motion.div>
    </section>
  );
}