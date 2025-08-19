import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  addItem,
  incrementQuantity,
  decrementQuantity,
  removeItem,
} from "../store/cartSlice";
import api from "../utils/api";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import StarRating from "../components/StarRating";
import AddonSelector from "../components/AddonSelector";
import {
  FaLeaf,
  FaStar,
  FaHeart,
  FaSearch,
  FaShoppingCart,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddonModal, setShowAddonModal] = useState(false);
  const [selectedFoodId, setSelectedFoodId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await api.get("/categories");
        const categoriesData = Array.isArray(categoriesResponse.data)
          ? categoriesResponse.data
          : categoriesResponse.data?.data || [];

        setCategories([
          "All",
          ...categoriesData.map((cat) => cat.name || cat.category_name),
        ]);

        const foodsResponse = await api.get("/foods");
        const foodsData = Array.isArray(foodsResponse.data)
          ? foodsResponse.data
          : foodsResponse.data?.data || [];

        setMenuItems(
          foodsData.map((food) => ({
            id: food.id,
            name: food.name,
            category:
              categoriesData.find((cat) => cat.id === food.category_id)?.name ||
              "Other",
            description: food.description,
            price: food.price,
            rating: Number(food.rating_average) || 0,
            isFavorite: false,
            image: `/assets/${food.image_url}`,
          }))
        );
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err.response?.data?.error || err.message || "Failed to load menu data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredItems = menuItems.filter(
    (item) =>
      (activeCategory === "All" || item.category === activeCategory) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (id) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleAddToCart = (item) => {
    setSelectedFoodId(item.id);
    setShowAddonModal(true);
  };

  const confirmAddons = (addons) => {
    const food = menuItems.find((m) => m.id === selectedFoodId);
    if (!food) return;
    dispatch(
      addItem({
        id: food.id,
        name: food.name,
        price: food.price,
        description: food.description,
        image: food.image,
        category: food.category,
        addons,
      })
    );
    setShowAddonModal(false);
  };

  const handleIncrement = (id) => {
    dispatch(incrementQuantity(id));
  };

  const handleDecrement = (id) => {
    const item = cartItems.find((item) => item.id === id);
    if (item && item.quantity <= 1) {
      dispatch(removeItem(id));
    } else {
      dispatch(decrementQuantity(id));
    }
  };

  const getItemQuantity = (id) => {
    const itemInCart = cartItems.find((item) => item.id === id);
    return itemInCart ? itemInCart.quantity : 0;
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-red-500 text-center p-4 max-w-md">
          <h2 className="text-xl font-bold mb-2">Error Loading Menu</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <Navbar2 />

      {/* Hero Section */}
      <div className="relative bg-green-600 py-20">
        <div className="absolute inset-0 bg-[url('/assets/menu-pattern.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <FaLeaf className="text-white text-4xl" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Discover Our <span className="text-yellow-300">Fresh</span> Menu
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-green-100 max-w-2xl mx-auto"
          >
            Each dish is crafted with seasonal ingredients and a whole lot of
            love
          </motion.p>
        </div>
      </div>

      {/* Menu Controls */}
      <div className="max-w-7xl mx-auto px-6 py-8 -mt-10 relative z-20">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Category Filter */}
            <div className="flex overflow-x-auto w-full scrollbar-hide">
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                      activeCategory === category
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative w-full md:w-80"
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => {
            const quantity = getItemQuantity(item.id);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-100"
              >
                {/* Image */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/assets/default-food.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm ${
                      item.isFavorite
                        ? "bg-red-500 text-white"
                        : "bg-white/90 text-gray-600"
                    }`}
                  >
                    <FaHeart />
                  </button>

                  {/* Rating Badge */}
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center">
                    <FaStar className="text-yellow-300 mr-1 text-sm" />
                    <span className="text-white text-sm font-medium">
                      {item.rating}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-green-700 font-semibold mb-2">₹{item.price}</p>

                  <div className="flex justify-between items-center">
                    <span className="text-xs px-2.5 py-1 bg-green-100 text-green-800 rounded-full">
                      {item.category}
                    </span>

                    {quantity > 0 ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDecrement(item.id)}
                          className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="font-medium w-6 text-center text-gray-700">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleIncrement(item.id)}
                          className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AddonSelector
        foodId={selectedFoodId}
        isOpen={showAddonModal}
        onClose={() => setShowAddonModal(false)}
        onConfirm={confirmAddons}
      />

      <Footer />
    </div>
  );
};

export default MenuPage;
