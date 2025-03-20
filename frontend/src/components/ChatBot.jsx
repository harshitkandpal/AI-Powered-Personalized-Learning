import React, { useState, useEffect } from "react";
import { useTheme } from "../components/ThemeContext";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isDark, setIsDark] = useState(false);
  const { theme } = useTheme();
  
  // Effect to track theme changes
  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your logic to handle the prompt submission here
    console.log("User prompt:", prompt);
    setPrompt("");
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
      style={{ 
        position: 'fixed', 
        bottom: '24px', 
        right: '24px', 
        zIndex: 9999 
      }}
    >
      {/* Chatbot Box */}
      {isOpen && (
        <div
          className={`mb-4 rounded-lg shadow-xl flex flex-col ${isDark ? "bg-black text-white" : "bg-white text-gray-800"}`}
          style={{ 
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            maxHeight: '600px',
            width: '320px',
            overflow: 'hidden'
          }}
        >
          {/* Chat Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-medium text-lg">Chatbot</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className={`hover:bg-gray-100 p-1 rounded-full ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            >
              <FaTimes size={16} />
            </button>
          </div>
          
          {/* Chat Messages Area */}
          <div className="p-4 overflow-y-auto flex-grow" style={{ maxHeight: '400px', minHeight: '300px' }}>
            <p className="mb-2 text-base">How can I assist you today?</p>
            {/* Chat messages will go here */}
          </div>
          
          {/* Chat Input Area */}
          <form onSubmit={handleSubmit} className="border-t p-4 flex">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your message..."
              className={`flex-grow px-4 py-2 rounded-l-lg focus:outline-none ${isDark ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"}`}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-r-lg bg-blue-500 hover:bg-blue-600 text-white"
            >
              <FaPaperPlane size={14} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Chatbot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 rounded-full shadow-xl flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white"
        style={{ 
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          height: '60px',
          width: '60px'
        }}
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </button>
    </div>
  );
};

export default Chatbot;