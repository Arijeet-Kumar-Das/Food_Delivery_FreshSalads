import React, { useEffect, useRef, useState } from "react";
import {
  FaLeaf,
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaUserCircle,
  FaClipboardList,
  FaLifeRing,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link } from "react-scroll";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { Link as RouteLink } from "react-router-dom";

const Navbar = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Left side - Logo */}
          <div className="flex items-center space-x-4">
            <FaLeaf className="text-green-600 text-2xl" />
            <Link
              to="home"
              smooth={true}
              duration={500}
              className="font-bold text-xl text-green-800 cursor-pointer"
            >
              FreshSalads
            </Link>
          </div>

          {/* Center - Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="home"
              smooth={true}
              duration={500}
              className="text-green-600 font-medium cursor-pointer"
            >
              Home
            </Link>
            <RouteLink
              to="/menu"
              className="text-gray-600 hover:text-green-600 cursor-pointer"
            >
              Menu
            </RouteLink>
            <Link
              to="about"
              smooth={true}
              duration={500}
              className="text-gray-600 hover:text-green-600 cursor-pointer"
            >
              About
            </Link>
            <Link
              to="contact"
              smooth={true}
              duration={500}
              className="text-gray-600 hover:text-green-600 cursor-pointer"
            >
              Contact
            </Link>
          </div>

          {/* Right side - Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-green-600">
              <FaSearch />
            </button>

            {isAuthenticated && (
              <button
                className="p-2 text-gray-600 hover:text-green-600"
                onClick={() => navigate("/orders")}
              >
                <FaClipboardList />
              </button>
            )}

            {isAuthenticated && (
              <button
                className="p-2 text-gray-600 hover:text-green-600"
                onClick={() => navigate("/support")}
              >
                <FaLifeRing />
              </button>
            )}

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
              <FaUser onClick={() => navigate("/login")} />
            )}

            <button className="relative p-2 text-gray-600 hover:text-green-600">
              <FaShoppingCart />
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
