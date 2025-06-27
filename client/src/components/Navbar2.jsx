import React, { useRef, useState } from "react";
import {
  FaLeaf,
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";

const Navbar2 = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo linking to homepage */}
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <FaLeaf className="text-green-600 text-2xl" />
            <span className="font-bold text-xl text-green-800">
              FreshSalads
            </span>
          </div>

          {/* Right side icons (same functionality) */}
          <div className="flex items-center space-x-4">
            <button
              className="p-2 text-gray-600 hover:text-green-600"
              onClick={() => console.log("Search clicked")} // Add search functionality
            >
              <FaSearch />
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  className="p-2 text-gray-600 hover:text-green-600"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <FaUserCircle className="text-xl" />
                </button>
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                    ref={dropdownRef}
                  >
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-800 hover:bg-green-50 hover:text-green-600 flex items-center"
                    >
                      <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="p-2 text-gray-600 hover:text-green-600"
                onClick={() => navigate("/login")}
              >
                <FaUser />
              </button>
            )}

            <button
              className="relative p-2 text-gray-600 hover:text-green-600"
              onClick={() => navigate("/cart")}
            >
              <FaShoppingCart />
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3 {/* Replace with dynamic count later */}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar2;
