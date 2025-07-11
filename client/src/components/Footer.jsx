import React, { useState } from "react";
import { Link } from "react-scroll";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaLeaf,
  FaPaperPlane,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEnvelope,
} from "react-icons/fa";
import { SiFoodpanda } from "react-icons/si";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail("");
    }
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-white to-green-50 border-t border-green-100/50 shadow-[0_-4px_32px_rgba(34,197,94,0.08)]">
      {/* Floating leaf decorations */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: [0, -15, 0], opacity: 1 }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 left-10 text-green-300/30 text-6xl"
      >
        <FaLeaf />
      </motion.div>
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: [0, 15, 0], opacity: 1 }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute -bottom-10 right-16 text-green-300/20 text-7xl"
      >
        <FaLeaf />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-5">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 text-3xl font-bold text-green-700"
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <FaLeaf className="text-green-600" />
              </motion.span>
              <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                FreshSalads
              </span>
            </motion.div>

            <p className="text-gray-600 text-lg leading-relaxed">
              Revolutionizing healthy eating with farm-fresh ingredients
              delivered to your doorstep.
            </p>

            <div className="flex gap-4">
              {[
                { icon: <FaFacebookF />, color: "bg-blue-600" },
                {
                  icon: <FaInstagram />,
                  color: "bg-gradient-to-tr from-purple-600 to-pink-600",
                },
                { icon: <FaTwitter />, color: "bg-sky-500" },
                { icon: <FaLinkedinIn />, color: "bg-blue-700" },
              ].map((item, idx) => (
                <motion.a
                  key={idx}
                  href="#"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`${item.color} text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all`}
                  aria-label="Social Link"
                >
                  {item.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-green-200/50 inline-block">
              Explore
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Our Menu", to: "menu" },
                { label: "Meal Plans", to: "plans" },
                { label: "Nutrition Info", to: "nutrition" },
                { label: "How It Works", to: "process" },
                { label: "Testimonials", to: "reviews" },
              ].map((link) => (
                <motion.li key={link.to} whileHover={{ x: 5 }}>
                  <Link
                    to={link.to}
                    smooth={true}
                    duration={500}
                    className="text-gray-600 hover:text-green-600 font-medium transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-all"></span>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-green-200/50 inline-block">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 text-green-600">
                  <FaMapMarkerAlt />
                </div>
                <p className="text-gray-600">
                  123 Salad Lane
                  <br />
                  Greenville, CA 90210
                </p>
              </li>
              <li className="flex items-center gap-3">
                <div className="text-green-600">
                  <FaPhoneAlt />
                </div>
                <a
                  href="tel:+18005551234"
                  className="text-gray-600 hover:text-green-600"
                >
                  (800) 555-1234
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="text-green-600">
                  <FaEnvelope />
                </div>
                <a
                  href="mailto:hello@freshsalads.com"
                  className="text-gray-600 hover:text-green-600"
                >
                  hello@freshsalads.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-green-200/50 inline-block">
              Join Our Community
            </h3>

            {isSubscribed ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-green-100 border border-green-200 text-green-700 p-4 rounded-lg"
              >
                🎉 Thanks for subscribing! Check your email for a special offer.
              </motion.div>
            ) : (
              <>
                <p className="text-gray-600 mb-4">
                  Get 10% off your first order and weekly healthy recipes.
                </p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-white/90"
                    required
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-green-200/50 flex items-center justify-center gap-2 transition-all"
                  >
                    <FaPaperPlane />
                    Subscribe Now
                  </motion.button>
                </form>
                <p className="text-xs text-gray-400 mt-2">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="border-t border-green-100/50 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} FreshSalads. All rights reserved.
          </div>

          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-green-600 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-green-600 text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-green-600 text-sm">
              Shipping Policy
            </a>
          </div>
        </motion.div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-green-300/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-green-400/10 rounded-full blur-3xl"></div>
      </div>
    </footer>
  );
};

export default Footer;
