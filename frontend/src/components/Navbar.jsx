import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch, FiUser, FiBell, FiBook, FiAward, FiHome } from 'react-icons/fi';
import { FaSun, FaMoon, FaGraduationCap } from 'react-icons/fa';
import { useTheme } from './ThemeContext';
import { useAuth } from '../AuthContext'; // Assuming you have this

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const location = useLocation();
  const { currentUser } = useAuth(); // Assuming you have an auth context
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New course recommendation for you!', time: '2h ago', unread: true },
    { id: 2, message: 'You earned a new badge!', time: '1d ago', unread: true },
    { id: 3, message: 'Your course "React Basics" is 80% complete', time: '2d ago', unread: false },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [xpPoints, setXpPoints] = useState(350);
  
  // Track scroll position to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulate XP points increasing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setXpPoints(prev => {
        if (prev < 355) return prev + 1;
        return prev;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle notification click
  const handleNotificationClick = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, unread: false } : notification
      )
    );
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <nav 
      className={`relative top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? `${isDark ? 'bg-gray-900/95 text-white' : 'bg-white/95 text-gray-800'} backdrop-blur-md shadow-lg` 
          : `${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} shadow-md`
      } p-3 flex justify-between items-center`}
    >
      {/* Logo with animation */}
      <div className="logo flex items-center">
        <Link to="/" className="flex items-center transform transition-transform hover:scale-105">
          <div className="relative">
            <img
              src="https://img.freepik.com/free-vector/open-magic-book-with-fantasy-blue-light-vector_107791-31843.jpg"
              alt="Company Logo"
              className="w-12 h-12 rounded-full object-cover shadow-md"
            />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
              <FaGraduationCap />
            </div>
          </div>
          <span className={`ml-2 font-bold text-lg tracking-tight ${isDark ? 'text-white' : 'text-gray-800'}`}>
            EduQuest
          </span>
        </Link>
      </div>

      {/* Navigation links with active indicators */}
      <div className="nav-links hidden md:flex space-x-1 ml-4">
        {[
          { path: '/', label: 'Home', icon: <FiHome /> },
          { path: '/my-learning', label: 'My Learning', icon: <FiBook /> },
          { path: '/domain-roadmaps', label: 'Roadmaps', icon: <FiAward /> },
        ].map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`relative px-3 py-2 rounded-lg flex items-center font-medium transition-all duration-300 ${
                isActive 
                  ? `${isDark ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`
                  : `${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'}`
              }`}
            >
              <span className="mr-1">{link.icon}</span>
              {link.label}
              {isActive && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Search bar with animation */}
      <div 
        className={`search-bar flex items-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-2 transition-all duration-300 ${
          searchFocused ? 'ring-2 ring-blue-500 w-2/5' : 'w-1/3'
        }`}
      >
        <input
          type="text"
          placeholder="Search for courses"
          className={`${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'} outline-none p-1.5 flex-grow`}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <button className={`${isDark ? 'text-gray-300' : 'text-gray-600'} ml-2 transform transition-transform hover:scale-110`}>
          <FiSearch size={18} />
        </button>
      </div>

      {/* Right section: XP, Notifications, Theme, Profile */}
      <div className="right-section flex items-center space-x-3">
        {/* XP counter */}
        <div className="hidden md:flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium text-sm">
          <span className="mr-1 text-yellow-300">✨</span>
          <span className="mr-1">350 XP</span>
        </div>
        
        {/* Notifications */}
        <div className="relative">
          <button 
            className={`p-2 rounded-full ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors relative`}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FiBell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
          
          {/* Notifications dropdown */}
          {showNotifications && (
            <div 
              className={`absolute right-0 mt-2 w-72 ${
                isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
              } rounded-lg shadow-xl py-2 z-10 transform transition-all duration-300 origin-top-right`}
            >
              <div className="flex justify-between items-center px-4 py-2 border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold">Notifications</h3>
                <button className="text-xs text-blue-500 hover:text-blue-700">Mark all as read</button>
              </div>
              
              {notifications.length > 0 ? (
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id}
                      className={`px-4 py-3 border-gray-100 dark:border-gray-700 cursor-pointer transition-colors ${
                        notification.unread 
                          ? isDark ? 'bg-gray-700' : 'bg-blue-50' 
                          : ''
                      } `}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex">
                        {notification.unread && (
                          <span className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full mr-2"></span>
                        )}
                        <div>
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs opacity-75 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-3 text-center text-sm opacity-75">
                  No notifications yet
                </div>
              )}
              
              <div className="pt-2 px-4 pb-2 text-center">
                <button className="text-xs text-blue-500 hover:text-blue-700">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Theme toggle button */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${
            isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } transition-all transform hover:rotate-12`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <FaSun className="text-yellow-500 w-5 h-5" />
          ) : (
            <FaMoon className="text-gray-600 w-5 h-5" />
          )}
        </button>

        {/* Profile section */}
        <div className="profile-section">
          <Link 
            to="/profile" 
            className={`relative flex items-center space-x-2 p-1.5 rounded-full ${
              location.pathname === '/profile'
                ? isDark ? 'bg-blue-600' : 'bg-blue-100'
                : isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
            } transition-all`}
          >
            {currentUser?.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover border-2 border-blue-500" 
              />
            ) : (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isDark ? 'bg-gray-700' : 'bg-gray-300'
              }`}>
                <FiUser size={16} />
              </div>
            )}
            <div className="w-2 h-2 absolute bottom-0 right-0 bg-green-500 rounded-full"></div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
