import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import { FaLeaf, FaStar, FaHeart, FaSearch } from "react-icons/fa";
import img1 from "../assets/h-food-1.jpg";
import img2 from "../assets/h-food-2.jpg";
import img3 from "../assets/h-food-3.jpg";
import img4 from "../assets/h-food-4.jpg";

const MenuPage = () => {
  const menuCategories = [
    "All",
    "Signature",
    "Vegetarian",
    "Protein",
    "Vegan",
    "Seasonal",
  ];

  const menuItems = [
    {
      id: 1,
      name: "Mediterranean Power Bowl",
      category: "Signature",
      description: "Quinoa, kale, roasted veggies, feta, lemon-tahini dressing",
      price: 12.99,
      rating: 4.9,
      isFavorite: false,
      image: img1,
    },
    {
      id: 2,
      name: "Avocado & Berry Bliss",
      category: "Vegan",
      description: "Mixed greens, avocado, berries, almonds, balsamic glaze",
      price: 10.99,
      rating: 4.7,
      isFavorite: true,
      image: img2,
    },
    {
      id: 3,
      name: "Protein Powerhouse",
      category: "Protein",
      description: "Grilled chicken, quinoa, chickpeas, tahini dressing",
      price: 14.99,
      rating: 4.8,
      isFavorite: false,
      image: img3,
    },
    {
      id: 4,
      name: "Summer Harvest Bowl",
      category: "Seasonal",
      description: "Seasonal fruits, goat cheese, honey-lime dressing",
      price: 11.99,
      rating: 4.6,
      isFavorite: false,
      image: img4,
    },
  ];

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = menuItems.filter(
    (item) =>
      (activeCategory === "All" || item.category === activeCategory) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (id) => {
    // Implement favorite toggle logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar2 />

      {/* Enhanced Hero Section */}
      <motion.div
        className="relative h-80 flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-green-400/90 z-0"></div>
        <div className="absolute inset-0 bg-[url('/path/to/texture.png')] opacity-10 z-0"></div>

        <motion.div
          className="text-center z-10 px-4"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Our <span className="text-yellow-300">Menu</span>
          </motion.h1>
          <motion.p
            className="text-green-100 text-xl md:text-2xl font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Fresh ingredients,{" "}
            <span className="font-medium">crafted with love</span>
          </motion.p>
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <FaLeaf className="mx-auto text-white/50 text-4xl animate-pulse" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced Menu Controls */}
      <div className="max-w-6xl mx-auto px-4 py-12 -mt-10 relative z-10">
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 mb-12"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Animated Category Filter */}
            <motion.div
              className="flex overflow-x-auto w-full scrollbar-hide"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex space-x-2">
                {menuCategories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-5 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                      activeCategory === category
                        ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600"
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Glowing Search Bar */}
            <motion.div
              className="relative w-full md:w-72"
              whileHover={{ scale: 1.02 }}
            >
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white shadow-sm"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{
                y: -8,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-green-100"
            >
              {/* Image with Gradient Overlay */}
              <div className="relative h-56 overflow-hidden group">
                <motion.img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  initial={{ scale: 1 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                {/* Favorite Button */}
                <motion.button
                  onClick={() => toggleFavorite(item.id)}
                  className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm ${
                    item.isFavorite
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-white/90 text-gray-600 hover:text-red-500"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaHeart />
                </motion.button>

                {/* Rating Badge */}
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
                  <FaStar className="text-yellow-300 mr-1" />
                  <span className="text-white font-medium">{item.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <motion.h3
                    className="text-xl font-bold text-gray-800"
                    whileHover={{ color: "#16a34a" }}
                  >
                    {item.name}
                  </motion.h3>
                  <span className="text-lg font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    ${item.price}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 min-h-[40px]">
                  {item.description}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-xs px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                    {item.category}
                  </span>
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      background: "#16a34a",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:shadow-green-200 transition-all"
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MenuPage;
