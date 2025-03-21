



import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../components/ThemeContext";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import { useAuth } from "../AuthContext"; // Assuming you have an auth context

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const { currentUser } = useAuth() || { currentUser: null }; // Get current user from auth context
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = { 
        sender: "bot", 
        text: currentUser 
          ? `Hello ${currentUser.displayName || 'there'}! How can I help with your learning today?` 
          : "Hello! How can I help with your learning today?" 
      };
      setMessages([welcomeMessage]);
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = { sender: "user", text: prompt };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      // Send both message and user ID if available
      const response = await fetch("http://127.0.0.1:5000/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: prompt }),

      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = { sender: "bot", text: data.response };

      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      // Add error message to the chat
      const errorMessage = { 
        sender: "bot", 
        text: "Sorry, I'm having trouble connecting to the server. Please try again later." 
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      setPrompt("");
    }
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
      style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}
    >
      {isOpen && (
        <div
          className={`mb-4 rounded-lg shadow-xl flex flex-col ${isDark ? "bg-black text-white" : "bg-white text-gray-800"}`}
          style={{ boxShadow: '0 10px 25px rgba(0,0,0,0.2)', maxHeight: '600px', width: '350px', overflow: 'hidden' }}
        >
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-medium text-lg">Learning Assistant</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className={`hover:bg-gray-100 p-1 rounded-full ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            >
              <FaTimes size={16} />
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto flex-grow" style={{ maxHeight: '400px', minHeight: '300px' }}>
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-3 p-2 rounded-lg ${
                  msg.sender === "user" 
                    ? `ml-auto bg-blue-500 text-white` 
                    : `mr-auto ${isDark ? "bg-gray-700" : "bg-gray-100"}`
                }`}
                style={{ maxWidth: '80%' }}
              >
                {msg.text}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-center my-2">
                <div className="animate-pulse flex space-x-1">
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="border-t p-4 flex">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your message..."
              className={`flex-grow px-4 py-2 rounded-l-lg focus:outline-none ${isDark ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"}`}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className={`px-4 py-2 rounded-r-lg text-white ${
                isLoading || !prompt.trim() ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={isLoading || !prompt.trim()}
            >
              <FaPaperPlane size={14} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 rounded-full shadow-xl flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white"
        style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.3)', height: '60px', width: '60px' }}
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </button>
    </div>
  );
};

export default Chatbot;
