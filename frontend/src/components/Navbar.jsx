// src/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiUser } from 'react-icons/fi';
import { useTheme } from './ThemeContext';

const Navbar = () => {
  const { toggleTheme } = useTheme();

  return (
    <nav className="navbar bg-white shadow-md p-4 flex justify-between items-center">
      {/* Logo on the left */}
      <div className="logo">
        <Link to="/">
          <img
            src="/path/to/your/logo.png"
            alt="Company Logo"
            className="w-32"
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
        {/* Sun and Moon icons */}
        
        <svg
          className="w-5 h-5 text-yellow-500 dark:text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"
            clipRule="evenodd"
          />
        </svg>
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
