import React from "react";
import heroImage from "../../assets/heroImage.webp";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import Categories from "./Categories";
import FeaturedProducts from "../../components/Home/FeaturedProducts";
import ComboDeals from "../../components/Home/ComboDeals";
import storyImage from "../../assets/2148774913.webp"

const Home = () => {
  const Content = [
    {
      color: "bg-purple-100/70",
      img: "✨",
      para: "Natural Ingredients",
    },
    {
      color: "bg-fuchsia-100/70",
      img: "🌾",
      para: "Rich in Nutrition",
    },
    {
      color: "bg-rose-100/70",
      img: "⏱️",
      para: "Easy to Prepare",
    },
    {
      color: "bg-violet-100/70",
      img: "❤️",
      para: "Loved by All Ages",
    },
  ];

  // Animation variants for grid items
  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      className="bg-gradient-to-tr from-primary/50 to-white px-5 lg:px-12 pt-4"
      id="home"
    >
      {/* --- SEO Meta Tags --- */}
      <Helmet>
        <title>Shri Velan Organic Foods | Wholesome Goodness in Every Bite</title>
        <meta
          name="description"
          content="Shri Velan Organic Foods offers healthy noodles, rice porridge mix, malt varieties, and muesli bites made from natural ingredients. Wholesome goodness in every bite!"
        />
        <meta
          name="keywords"
          content="organic foods, healthy noodles, malt drink, rice porridge, muesli, healthy snacks, Shri Velan Organic Foods"
        />
        <meta property="og:title" content="Shri Velan Organic Foods" />
        <meta
          property="og:description"
          content="Wholesome Goodness in Every Bite – Fresh, Fast & Flavorful! Explore our range of organic and healthy foods."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com/" />
        <meta property="og:image" content={heroImage} />
      </Helmet>

      {/* Hero Section */}
      <motion.div
        className="flex flex-col-reverse lg:flex-row items-center gap-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Left Content */}
        <div className="lg:w-1/2 flex flex-col gap-6">
          <h1 className="font-Italiana text-lg font-semibold tracking-widest uppercase text-primary">
            Shri Velan Organic Foods
          </h1>

          <h2
            style={{ lineHeight: "1.3" }}
            className="text-3xl lg:text-5xl leading-snug tracking-wide font-SpaceGrotesk text-gray-800"
          >
            Wholesome Goodness in Every Bite –{" "}
            <span className="text-primary">Fresh, Fast & Flavorful!</span>
          </h2>

          <p className="font-SpaceGrotesk tracking-wider text-gray-700 leading-relaxed">
            Bring home the perfect balance of{" "}
            <strong>taste, nutrition, and tradition.</strong> From quick-cook
            noodles to hearty rice porridge mixes, energizing malt drinks, and
            crunchy muesli bites — our products are crafted to keep you
            <strong> healthy, active, and satisfied</strong> every single day.
          </p>

          <a
            href="products"
            className="font-SpaceGrotesk flex bg-primary w-fit px-6 py-3 text-white tracking-widest rounded-2xl shadow-lg hover:bg-primary/90 transition duration-300"
          >
            Shop Now
          </a>
        </div>

        {/* Right Image */}
        <motion.div
          className="lg:w-1/2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <img
            src={heroImage}
            alt="Healthy organic food - noodles, malt, porridge, and muesli"
            loading="lazy"
          />
        </motion.div>
      </motion.div>

      {/* --- Features Grid --- */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-8"
        initial="hidden"
        whileInView="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
        }}
        viewport={{ once: true }}
      >
        {Content.map((content, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className={`${content.color} flex flex-col items-center justify-center text-center p-8 shadow-md hover:shadow-xl transition duration-300`}
            whileHover={{ scale: 1.05, rotate: 1 }}
          >
            <motion.span
              className="text-5xl mb-3"
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
            >
              {content.img}
            </motion.span>
            <p className="text-lg font-SpaceGrotesk tracking-wide text-gray-800">
              {content.para}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Categories Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-16 mt-16"
      >
        <Categories />
      </motion.div>

      {/* Featured Products Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        className="mb-16"
      >
        <FeaturedProducts />
      </motion.div>

      {/* Combo Deals Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
        className="mb-16"
      >
        <ComboDeals />
      </motion.div>


    {/* --- Why Choose Us Section --- */}
    <motion.div
      className="py-16 mb-16 bg-white/30 rounded-3xl"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-Italiana text-gray-800 mb-6">
            Why Families <span className="text-primary">Trust Us</span>
          </h2>
          <p className="font-SpaceGrotesk text-gray-600 text-lg max-w-2xl mx-auto">
            Three generations of commitment to purity, taste, and your family's health
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: "👨‍🌾",
              title: "Family Legacy",
              description: "3 generations of traditional organic farming expertise",
              color: "from-amber-50 to-amber-100/50"
            },
            {
              icon: "🌱",
              title: "100% Natural",
              description: "No preservatives, no MSG Powder, no artificial colors ever",
              color: "from-green-50 to-green-100/50"
            },
            {
              icon: "🚛",
              title: "Transparent Delivery",
              description: "Tamil Nadu: ₹50/kg • Other States: ₹100/kg",
              color: "from-blue-50 to-blue-100/50"
            },
            {
              icon: "⭐",
              title: "Proven Quality",
              description: "Trusted by 10k+ families across India",
              color: "from-purple-50 to-purple-100/50"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className={`bg-gradient-to-br ${feature.color} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="font-SpaceGrotesk font-semibold text-gray-800 text-xl mb-3">
                {feature.title}
              </h3>
              <p className="font-SpaceGrotesk text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-2xl inline-block">
            <p className="font-SpaceGrotesk text-gray-700 text-lg mb-4">
              Join <strong>10k+</strong> families across India who choose purity and tradition
            </p>
            <a
              href="/products"
              className="font-SpaceGrotesk bg-primary text-white px-8 py-3 rounded-2xl shadow-lg hover:bg-primary/90 transition duration-300 inline-flex items-center gap-2 group"
            >
              Experience Traditional Goodness
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>

    </section>
  );
};

export default Home;