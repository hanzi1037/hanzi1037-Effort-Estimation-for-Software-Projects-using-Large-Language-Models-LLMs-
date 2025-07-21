import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from 'lucide-react'; // You can replace this with any icon library or SVGs

export default function Navbar() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="p-4 flex justify-between items-center bg-white dark:bg-gray-800 shadow-md relative">
      {/* Logo */}
      <div className="font-bold text-xl text-gray-800 dark:text-white">
        <Link to="/dashboard">EstimationSystem</Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-4 items-center">
        <Link className="text-gray-800 dark:text-white hover:text-blue-500" to="/dashboard">
          Dashboard
        </Link>

        {/* <span className="mr-2 text-lg text-blue-600">
          {darkMode ? "Dark" : "Light"}
        </span> */}

        {/* <div
          className={`w-12 h-6 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full p-1 cursor-pointer transition ${
            darkMode ? "justify-end" : "justify-start"
          }`}
          onClick={() => setDarkMode(!darkMode)}
        >
          <div className="w-5 h-5 bg-white dark:bg-gray-900 rounded-full shadow-md transition"></div>
        </div> */}

        <button
          onClick={handleLogout}
          className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Hamburger Icon */}
      <div className="md:hidden flex items-center">
        <button
          onClick={toggleMobileMenu}
          className="text-gray-800 dark:text-white focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-800 flex flex-col items-start p-4 space-y-4 shadow-md z-50 md:hidden transition duration-300 ease-in-out">
          <Link
            className="text-gray-800 dark:text-white hover:text-blue-500 w-full"
            to="/dashboard"
            onClick={toggleMobileMenu}
          >
            Dashboard
          </Link>

          <div className="flex items-center w-full justify-between">
            <span className="text-lg text-blue-600">
              {darkMode ? "Dark" : "Light"}
            </span>

            <div
              className={`w-12 h-6 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full p-1 cursor-pointer transition ${
                darkMode ? "justify-end" : "justify-start"
              }`}
              onClick={() => setDarkMode(!darkMode)}
            >
              <div className="w-5 h-5 bg-white dark:bg-gray-900 rounded-full shadow-md transition"></div>
            </div>
          </div>

          <button
            onClick={() => {
              toggleMobileMenu();
              handleLogout();
            }}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
