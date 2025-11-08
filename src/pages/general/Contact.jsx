import React, { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import contact from "../../assets/2148774913.webp";
import { FaWhatsapp } from "react-icons/fa";
import contactService from "../../services/contactService";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseMessage("");

    try {
      // Use the contactService to create contact
      await contactService.createContact(formData);
      
      setResponseMessage("✅ Thank you! Your message has been sent successfully.");
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      const message = error.response?.data?.message || "Failed to send message. Please try again.";
      setResponseMessage(`❌ ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="font-alice">
      {/* ✅ SEO Meta Tags */}
      <Helmet>
        <title>Contact Shri Velan Organic Foods | Get in Touch</title>
        <meta
          name="description"
          content="Contact Shri Velan Organic Foods for pure, natural, and wholesome organic malt powders and healthy food products. Reach us via email, WhatsApp, or our contact form."
        />
        <meta
          name="keywords"
          content="Shri Velan Organic Foods, contact, organic food, malt powders, health mix, Chidambaram, Tamil Nadu, organic products"
        />
        <meta name="author" content="Shri Velan Organic Foods" />
        <meta property="og:title" content="Contact Shri Velan Organic Foods | Get in Touch" />
        <meta
          property="og:description"
          content="We'd love to hear from you! Get in touch with Shri Velan Organic Foods for all your organic and healthy food product needs."
        />
        <meta property="og:image" content={contact} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://shri-velan-food.onrender.com/contact" />
        <link rel="canonical" href="https://shri-velan-food.onrender.com/contact" />
      </Helmet>

      {/* Background Section */}
      <div
        style={{
          backgroundImage: `url(${contact})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
        className="flex flex-col gap-10 relative items-center py-8 px-5 lg:px-12 text-white"
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>

        {/* Top Content - Moved inside background */}
        <motion.div 
          className="z-10 w-full text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col gap-5">
            <h1 style={{ letterSpacing: "3px" }} className="text-3xl font-Italiana font-semibold">
              Get in Touch with Us
            </h1>
            <div className="gap-2 text-xl flex justify-center items-center">
              <span><FaWhatsapp /></span>
              <a
                href="https://wa.me/918122747148"
                className="hover:underline"
                aria-label="Chat with Shri Velan Foods on WhatsApp"
              >
                +91 8122747148
              </a>
            </div>
            <h1 className="text-xl font-SpaceGrotesk">💬 We'd Love to Hear From You!</h1>
            <p className="font-SpaceGrotesk max-w-3xl mx-auto">
              Whether you're exploring our organic malt powders, nutritional mixes, or
              natural products — your health journey begins here at Shri Velan Organic Foods.
            </p>
          </div>
        </motion.div>

        {/* Main Content Container */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-20 xl:gap-28 w-full px-6 sm:px-10 lg:px-20 xl:px-32 2xl:px-40 z-10">

          {/* Left Content */}
          <motion.div
            className="lg:w-1/2 flex flex-col gap-4"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-3xl xl:text-4xl font-Italiana font-semibold">
              Let's Connect with Shri Velan Organic Foods!
            </h1>
            <p className="text-lg xl:text-xl">
              🥣 <span className="font-medium font-SpaceGrotesk">Pure, Natural & Wholesome Malt Powders</span>
            </p>
            <p className="text-lg xl:text-xl">
              🌾 <span className="font-medium font-SpaceGrotesk">Healthy Organic Foods for a Better Lifestyle</span>
            </p>

            <h2 className="text-2xl xl:text-3xl font-semibold mt-4 font-SpaceGrotesk">
              Have Questions or Need Assistance?
            </h2>
            <p className="text-lg xl:text-xl font-SpaceGrotesk leading-relaxed">
              We're here to help you choose the right organic products for your family's health. From nutritious malt powders
              to wholesome ingredients, Shri Velan Organic Foods is committed to your wellness.
            </p>
            <p className="text-lg xl:text-xl font-SpaceGrotesk leading-relaxed">
              Fill out the form or give us a call — let's make healthy living a part of every meal!
            </p>
          </motion.div>

          {/* Right Form */}
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 w-full"
              aria-label="Contact Form"
            >
              {["name", "phone", "email", "message"].map((field, i) => (
                <motion.div
                  key={field}
                  className="flex flex-col gap-2 w-full"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                >
                  <label className="text-lg md:text-xl font-SpaceGrotesk" htmlFor={field}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {field === "message" ? (
                    <textarea
                      id="message"
                      className="outline-none border border-gray-500 bg-transparent w-full px-4 py-3 rounded-xl focus:border-gray-300 transition-all duration-300 focus:shadow-lg"
                      onChange={handleInputChange}
                      value={formData.message}
                      name="message"
                      placeholder="Type your message..."
                      required
                      rows="4"
                    />
                  ) : (
                    <input
                      id={field}
                      className="outline-none border border-gray-500 bg-transparent w-full px-4 py-3 rounded-xl focus:border-gray-300 transition-all duration-300 focus:shadow-lg"
                      onChange={handleInputChange}
                      value={formData[field]}
                      name={field}
                      type={
                        field === "email"
                          ? "email"
                          : field === "phone"
                          ? "tel"
                          : "text"
                      }
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      required
                    />
                  )}
                </motion.div>
              ))}

              <motion.button
                className="bg-gradient-to-r from-primary to-gray-600 hover:from-gray-600 hover:to-primary transition-all duration-700 ease-in-out px-8 py-3 rounded-full text-white font-semibold"
                disabled={isSubmitting}
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </motion.button>
            </form>

            {responseMessage && (
              <p className="text-white font-SpaceGrotesk text-base md:text-lg mt-4">
                {responseMessage}
              </p>
            )}
          </motion.div>

        </div>

      </div>
    </section>
  );
}

export default Contact;