import React from "react";
import { FaLeaf, FaUtensils, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section id="about" className="bg-green-50 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Our Story
          </h2>
          <div className="w-20 h-1 bg-green-500 mx-auto"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden h-96 shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Our Kitchen"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Fresh & Healthy Since 2023
            </h3>
            <p className="text-gray-600 mb-6">
              At FreshSalads, we believe in serving food that's as nutritious as
              it is delicious. Our chef brings 15 years of culinary experience
              to craft salads that are both good for you and full of flavor.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <FaLeaf className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">
                    100% Fresh Ingredients
                  </h4>
                  <p className="text-gray-600">
                    Locally sourced, organic produce delivered daily
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <FaUtensils className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Healthy Options</h4>
                  <p className="text-gray-600">
                    Nutritious meals without compromising on taste
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <FaHeart className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Made with Love</h4>
                  <p className="text-gray-600">
                    Every dish prepared with care and attention
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
