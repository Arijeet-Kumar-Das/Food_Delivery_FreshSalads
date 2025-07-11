import React from "react";
import { Element } from "react-scroll";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import About from "../components/About";
import Contact from "../components/Contact";
import {
  FaLeaf,
  FaArrowDown,
  FaStar,
  FaHeart,
  FaUtensils,
} from "react-icons/fa";
import Home from "../assets/home.avif";
import img1 from "../assets/h-food-1.jpg";
import img2 from "../assets/h-food-2.jpg";
import img3 from "../assets/h-food-3.jpg";
import img4 from "../assets/h-food-4.jpg";
import Footer from "../components/Footer";

const HomePage = () => {
  const salads = [
    {
      name: "Mix Salad",
      description: "Fresh seasonal vegetables with house dressing",
      price: 200.0,
      image: img1,
      rating: 4.8,
    },
    {
      name: "Greek Salad",
      description: "Spicy with garlic and feta cheese",
      price: 220.0,
      image: img2,
      rating: 4.9,
    },
    {
      name: "Green Salad",
      description: "Tomato, cucumber & fresh veggies",
      price: 250.0,
      image: img3,
      rating: 4.5,
    },
    {
      name: "Avocado Salad",
      description: "Creamy avocado and crisp cucumber",
      price: 150.0,
      image: img4,
      rating: 4.7,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <Element name="home">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Section - Enhanced Chef's Special */}
            <div className="lg:w-[45%]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="h-full flex flex-col"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
                  Fresh Healthy{" "}
                  <span className="text-green-600">Delicious</span> Salads
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  We make fresh and healthy foods with love
                </p>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="relative rounded-2xl overflow-hidden h-[500px] shadow-xl flex-grow"
                >
                  <img
                    src={Home}
                    alt="Fresh Salad"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-t from-black/70 to-transparent p-6 rounded-t-2xl"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                          <FaUtensils className="mr-1" />
                          CHEF'S PICK
                        </div>
                        <div className="flex items-center text-yellow-300 bg-black/30 px-3 py-1 rounded-full">
                          <FaStar className="mr-1" />
                          <span>5.0</span>
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold mb-2">
                        Mediterranean Power Bowl
                      </h3>
                      <p className="text-green-200 font-medium mb-4">
                        Today's featured creation with quinoa, kale, and roasted
                        veggies
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">Rs 299</span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full flex items-center gap-2"
                        >
                          Order Now <FaArrowDown className="text-xs" />
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Section - Optimized Menu Cards */}
            <Element name="menu" className="lg:w-[55%]">
              <div className="grid grid-cols-1 gap-5 h-full">
                {salads.map((salad, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex h-[150px]"
                  >
                    <div className="w-2/5 relative">
                      <img
                        src={salad.image}
                        alt={salad.name}
                        className="w-full h-full object-cover"
                      />
                      <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-all">
                        <FaHeart className="text-red-500 text-sm" />
                      </button>
                    </div>
                    <div className="w-3/5 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
                            {salad.name}
                          </h3>
                          <div className="flex items-center bg-green-100 px-2 py-1 rounded-full">
                            <FaStar className="text-yellow-400 mr-1 text-xs" />
                            <span className="text-green-800 font-bold text-xs">
                              {salad.rating}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {salad.description}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-green-600">
                          Rs. {salad.price.toFixed(2)}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors duration-300"
                        >
                          Add to Cart
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Element>
          </div>
        </div>
      </Element>

      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage;
