import React from "react";
import { Link } from "react-scroll";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaLeaf,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-white/80 to-green-50/80 backdrop-blur-xl border-t border-gray-200 shadow-[0_4px_32px_0_rgba(34,197,94,0.04)] mt-16">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Logo + Tagline */}
          <div>
            <div className="flex items-center gap-2 text-green-600 text-3xl font-extrabold tracking-tight drop-shadow-sm">
              <FaLeaf className="animate-spin-slow" />
              <span>FreshSalads</span>
            </div>
            <p className="text-gray-600 mt-3 text-base font-medium max-w-xs">
              Bringing fresh, healthy, and delicious salads right to your door.
            </p>
            <div className="flex gap-4 mt-5">
              {[
                { icon: <FaFacebookF />, href: "#" },
                { icon: <FaInstagram />, href: "#" },
                { icon: <FaTwitter />, href: "#" },
                { icon: <FaLinkedinIn />, href: "#" },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="text-gray-400 hover:text-green-600 transition-colors duration-200 bg-white/70 rounded-full p-2 shadow-md hover:scale-110"
                  aria-label="Social Link"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-semibold text-gray-800 mb-2 tracking-tight">
              Quick Links
            </h3>
            {[
              { label: "Home", to: "home" },
              { label: "Menu", to: "menu" },
              { label: "About", to: "about" },
              { label: "Contact", to: "contact" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                smooth={true}
                duration={500}
                className="cursor-pointer text-gray-500 hover:text-green-600 font-medium transition-colors duration-200 px-1 py-0.5 rounded hover:bg-green-50"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 tracking-tight">
              Stay Updated
            </h3>
            <p className="text-gray-600 text-base mb-4">
              Subscribe for tasty updates & exclusive offers.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 w-full bg-white/80 shadow-inner placeholder-gray-400"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:from-green-600 hover:to-green-700 hover:scale-105 transition-all"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-10 pt-7 text-center text-xs text-gray-500 tracking-wide">
          <span>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-green-600">FreshSalads</span>.
            All rights reserved.
          </span>
        </div>
      </div>
      {/* Decorative Gradient Glow */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-72 h-24 bg-green-400/20 blur-2xl rounded-full pointer-events-none"></div>
    </footer>
  );
};

export default Footer;
