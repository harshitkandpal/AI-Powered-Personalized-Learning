// Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiUser } from "react-icons/fi"; // Using icons for search and profile

const Navbar = () => {
  return (
    <nav className="navbar bg-white shadow-md p-4 flex justify-between items-center">
      {/* Logo on the left */}
      <div className="logo">
        <Link to="/">
          <img
            src="/path/to/your/logo.png"
            alt="Company Logo"
            className="w-32" // Adjust width based on logo size
          />
        </Link>
      </div>

      {/* Search bar - made wider */}
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

      {/* Tabs - moved closer to the profile section */}
      <div className="nav-links flex space-x-4 ml-4"> {/* Reduced spacing */}
        <Link to="/my-learning" className="text-gray-700 hover:text-blue-600 font-medium">
          My Learning
        </Link>
        <Link to="/domain-roadmaps" className="text-gray-700 hover:text-blue-600 font-medium">
          Domain Roadmaps
        </Link>
      </div>

      {/* Profile section */}
      <div className="profile-section flex items-center space-x-4 ml-6"> {/* Moved slightly left */}
        <Link to="/profile" className="text-gray-600">
          <FiUser size={24} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
