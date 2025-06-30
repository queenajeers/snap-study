import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { X, Menu, Sparkles } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (user)
    return (
      <div>
        <nav className="relative z-50  backdrop-blur-xl border-b border-white/10">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-3">
                <img
                  src="/SnapStudyLogoDarkMode.png"
                  className="w-32"
                  alt="Logo"
                />
              </div>
              <div>Logout</div>
            </div>
          </div>
        </nav>
      </div>
    );

  return (
    <div>
      <nav className="relative z-50  backdrop-blur-xl border-b border-white/10">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <img
                src="/SnapStudyLogoDarkMode.png"
                className="w-32"
                alt="Logo"
              />
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8 items-center">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `text-gray-300 relative group transition-colors hover:text-white`
                }
              >
                {({ isActive }) => (
                  <span className="relative">
                    Overview
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ${
                        isActive ? "w-full" : "w-0"
                      }`}
                    ></span>
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/plans"
                className={({ isActive }) =>
                  `text-gray-300 relative group transition-colors hover:text-white`
                }
              >
                {({ isActive }) => (
                  <span className="relative">
                    Pricing
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ${
                        isActive ? "w-full" : "w-0"
                      }`}
                    ></span>
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/app"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
              >
                <span className="relative z-10 flex items-center">
                  Try SnapStudy
                  <Sparkles className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                </span>
              </NavLink>
            </div>

            {/* Hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-white"
              >
                <Menu className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Top Dropdown Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-0 left-0 w-full h-[30vh] bg-[#1F2427] z-60 border-b border-white/10 shadow-xl transition-all duration-300 flex flex-col items-center justify-center space-y-5 md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 text-white"
          >
            <X className="w-6 h-6" />
          </button>

          <NavLink
            to="/"
            end
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg text-white font-medium hover:text-pink-500"
          >
            Overview
          </NavLink>
          <NavLink
            to="/plans"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg text-white font-medium hover:text-pink-500"
          >
            Pricing
          </NavLink>
        </div>
      )}
    </div>
  );
}
