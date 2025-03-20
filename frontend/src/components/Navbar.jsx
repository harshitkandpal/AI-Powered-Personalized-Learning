// src/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiUser } from 'react-icons/fi';
import { useTheme } from './ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa'; // Import Sun and Moon icons

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar bg-white shadow-md p-4 flex justify-between items-center">
      {/* Logo on the left */}
      <div className="logo">
        <Link to="/">
          <img
            src="https://img.freepik.com/free-vector/open-magic-book-with-fantasy-blue-light-vector_107791-31843.jpg"
            alt="Company Logo"
            className="w-22 rounded-full object-cover h-20"
          />
        </Link>
      </div>

      {/* Search bar */}
      <div className="search-bar flex items-center bg-gray-200 rounded-lg p-2 w-2/4">
        <input
          type="text"
          placeholder="Search for courses"
          className="bg-transparent outline-none p-2 flex-grow"
        />
        <button className="text-gray-600 ml-2">
          <FiSearch size={20} />
        </button>
      </div>

      {/* Navigation links */}
      <div className="nav-links flex space-x-4 ml-4">
        <Link to="/my-learning" className="text-gray-700 hover:text-blue-600 font-medium">
          My Learning
        </Link>
        <Link to="/domain-roadmaps" className="text-gray-700 hover:text-blue-600 font-medium">
          Domain Roadmaps
        </Link>
      </div>

      {/* Theme toggle button */}
      <button
        onClick={toggleTheme}
        className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <FaSun className="text-yellow-500 w-5 h-5" /> // Sun icon for dark theme
        ) : (
          <FaMoon className="text-gray-500 w-5 h-5" /> // Moon icon for light theme
        )}
      </button>

      {/* Profile section */}
      <div className="profile-section flex items-center space-x-4 ml-6">
        <Link to="/profile" className="text-gray-600">
          <FiUser size={24} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
