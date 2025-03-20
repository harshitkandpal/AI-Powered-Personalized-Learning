



// import React, { useState, useEffect, useRef } from "react";
// import { useTheme } from "../components/ThemeContext";
// import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
// import { useAuth } from "../AuthContext"; // Assuming you have an auth context

// const Chatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [prompt, setPrompt] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [isDark, setIsDark] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const { theme } = useTheme();
//   const { currentUser } = useAuth() || { currentUser: null }; // Get current user from auth context
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     setIsDark(theme === "dark");
//   }, [theme]);

//   // Auto-scroll to latest message
//   useEffect(() => {
//     if (messagesEndRef.current && isOpen) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages, isOpen]);

//   // Initialize with welcome message
//   useEffect(() => {
//     if (messages.length === 0) {
//       const welcomeMessage = { 
//         sender: "bot", 
//         text: currentUser 
//           ? `Hello ${currentUser.displayName || 'there'}! How can I help with your learning today?` 
//           : "Hello! How can I help with your learning today?" 
//       };
//       setMessages([welcomeMessage]);
//     }
//   }, [currentUser]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!prompt.trim()) return;

//     const userMessage = { sender: "user", text: prompt };
//     setMessages(prevMessages => [...prevMessages, userMessage]);
//     setIsLoading(true);

//     try {
//       // Send both message and user ID if available
//       const response = await fetch("http://127.0.0.1:5000/chatbot", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           message: prompt,
//           user_id: currentUser ? currentUser.uid : null
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       const botMessage = { sender: "bot", text: data.response };

//       setMessages(prevMessages => [...prevMessages, botMessage]);
//     } catch (error) {
//       console.error("Error fetching chatbot response:", error);
//       // Add error message to the chat
//       const errorMessage = { 
//         sender: "bot", 
//         text: "Sorry, I'm having trouble connecting to the server. Please try again later." 
//       };
//       setMessages(prevMessages => [...prevMessages, errorMessage]);
//     } finally {
//       setIsLoading(false);
//       setPrompt("");
//     }
//   };

//   return (
//     <div 
//       className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
//       style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}
//     >
//       {isOpen && (
//         <div
//           className={`mb-4 rounded-lg shadow-xl flex flex-col ${isDark ? "bg-black text-white" : "bg-white text-gray-800"}`}
//           style={{ boxShadow: '0 10px 25px rgba(0,0,0,0.2)', maxHeight: '600px', width: '350px', overflow: 'hidden' }}
//         >
//           <div className="p-4 border-b flex justify-between items-center">
//             <h3 className="font-medium text-lg">Learning Assistant</h3>
//             <button 
//               onClick={() => setIsOpen(false)}
//               className={`hover:bg-gray-100 p-1 rounded-full ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
//             >
//               <FaTimes size={16} />
//             </button>
//           </div>
          
//           <div className="p-4 overflow-y-auto flex-grow" style={{ maxHeight: '400px', minHeight: '300px' }}>
//             {messages.map((msg, index) => (
//               <div 
//                 key={index} 
//                 className={`mb-3 p-2 rounded-lg ${
//                   msg.sender === "user" 
//                     ? `ml-auto bg-blue-500 text-white` 
//                     : `mr-auto ${isDark ? "bg-gray-700" : "bg-gray-100"}`
//                 }`}
//                 style={{ maxWidth: '80%' }}
//               >
//                 {msg.text}
//               </div>
//             ))}
            
//             {isLoading && (
//               <div className="flex justify-center my-2">
//                 <div className="animate-pulse flex space-x-1">
//                   <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
//                   <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
//                   <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>
          
//           <form onSubmit={handleSubmit} className="border-t p-4 flex">
//             <input
//               type="text"
//               value={prompt}
//               onChange={(e) => setPrompt(e.target.value)}
//               placeholder="Type your message..."
//               className={`flex-grow px-4 py-2 rounded-l-lg focus:outline-none ${isDark ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"}`}
//               disabled={isLoading}
//             />
//             <button 
//               type="submit" 
//               className={`px-4 py-2 rounded-r-lg text-white ${
//                 isLoading || !prompt.trim() ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
//               }`}
//               disabled={isLoading || !prompt.trim()}
//             >
//               <FaPaperPlane size={14} />
//             </button>
//           </form>
//         </div>
//       )}

//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="p-4 rounded-full shadow-xl flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white"
//         style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.3)', height: '60px', width: '60px' }}
//         aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
//       >
//         {isOpen ? <FaTimes /> : <FaRobot />}
//       </button>
//     </div>
//   );
// };

// export default Chatbot;

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../components/ThemeContext";
import { FaRobot, FaTimes, FaPaperPlane, FaCog, FaUser } from "react-icons/fa";
import { useAuth } from "../AuthContext";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { theme } = useTheme();
  const { currentUser } = useAuth() || { currentUser: null };
  const messagesEndRef = useRef(null);
  
  // User preferences state
  const [preferences, setPreferences] = useState({
    communication_style: "friendly",
    encouragement_level: "moderate",
    detail_level: "balanced"
  });

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Initialize with welcome message and fetch user preferences if logged in
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = { 
        sender: "bot", 
        text: currentUser 
          ? `Hi ${currentUser.displayName || 'there'}! I'm Lexi, your learning buddy. How can I help make learning more fun today?` 
          : "Hey there! I'm Lexi, your learning buddy. How can I help make learning more fun today?" 
      };
      setMessages([welcomeMessage]);
    }
    
    // Fetch user preferences if user is logged in
    if (currentUser && currentUser.uid) {
      fetchUserPreferences(currentUser.uid);
    }
  }, [currentUser]);

  // Fetch user preferences from the backend
  const fetchUserPreferences = async (userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/user_preferences?user_id=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.preferences) {
          setPreferences(data.preferences);
        }
      }
    } catch (error) {
      console.error("Error fetching user preferences:", error);
    }
  };

  // Update user preferences
  const updatePreferences = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch("http://127.0.0.1:5000/update_chatbot_preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: currentUser.uid,
          preferences: preferences
        }),
      });
      
      if (response.ok) {
        // Success notification could be added here
        setShowSettings(false);
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = { sender: "user", text: prompt };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          user_id: currentUser ? currentUser.uid : null
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      // Format the bot's response text with paragraph breaks
      const formattedText = data.response ? data.response.replace(/\n\n/g, '\n').replace(/\n/g, '<br/>') : "";
      
      const botMessage = { 
        sender: "bot", 
        text: formattedText,
        html: true 
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      const errorMessage = { 
        sender: "bot", 
        text: "Oops! Looks like I'm having trouble connecting. Give me a moment and try again?" 
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      setPrompt("");
    }
  };

  const renderMessage = (msg) => {
    if (msg.html) {
      return <div dangerouslySetInnerHTML={{ __html: msg.text }} />;
    }
    return msg.text;
  };

  // Settings panel
  const SettingsPanel = () => (
    <div className={`p-4 ${isDark ? "bg-gray-800" : "bg-gray-50"} border-b`}>
      <h4 className="font-medium mb-3">Chatbot Preferences</h4>
      
      <div className="mb-3">
        <label className="block text-sm mb-1">Communication Style</label>
        <select 
          value={preferences.communication_style}
          onChange={(e) => setPreferences({...preferences, communication_style: e.target.value})}
          className={`w-full p-2 rounded ${isDark ? "bg-gray-700 text-white" : "bg-white border"}`}
        >
          <option value="friendly">Friendly & Casual</option>
          <option value="professional">Professional & Formal</option>
          <option value="encouraging">Highly Encouraging</option>
          <option value="direct">Direct & To-the-point</option>
        </select>
      </div>
      
      <div className="mb-3">
        <label className="block text-sm mb-1">Encouragement Level</label>
        <select 
          value={preferences.encouragement_level}
          onChange={(e) => setPreferences({...preferences, encouragement_level: e.target.value})}
          className={`w-full p-2 rounded ${isDark ? "bg-gray-700 text-white" : "bg-white border"}`}
        >
          <option value="high">High - Very Supportive</option>
          <option value="moderate">Moderate - Balanced Support</option>
          <option value="low">Low - Minimal Cheerleading</option>
        </select>
      </div>
      
      <div className="mb-3">
        <label className="block text-sm mb-1">Detail Level</label>
        <select 
          value={preferences.detail_level}
          onChange={(e) => setPreferences({...preferences, detail_level: e.target.value})}
          className={`w-full p-2 rounded ${isDark ? "bg-gray-700 text-white" : "bg-white border"}`}
        >
          <option value="concise">Concise - Brief answers</option>
          <option value="balanced">Balanced - Moderate detail</option>
          <option value="detailed">Detailed - In-depth explanations</option>
        </select>
      </div>
      
      <div className="flex justify-end space-x-2 mt-4">
        <button 
          onClick={() => setShowSettings(false)}
          className={`px-3 py-1 rounded ${isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          Cancel
        </button>
        <button 
          onClick={updatePreferences}
          className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
        >
          Save
        </button>
      </div>
    </div>
  );

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
      style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}
    >
      {isOpen && (
        <div
          className={`mb-4 rounded-lg shadow-xl flex flex-col ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}
          style={{ boxShadow: '0 10px 25px rgba(0,0,0,0.2)', maxHeight: '600px', width: '350px', overflow: 'hidden' }}
        >
          <div className="p-3 border-b flex justify-between items-center">
            <div className="flex items-center">
              <FaRobot className="text-blue-500 mr-2" />
              <h3 className="font-medium text-lg">Lexi</h3>
              {currentUser && (
                <span className={`ml-2 text-xs px-2 py-1 rounded-full ${isDark ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-700"}`}>
                  Learning Buddy
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              {currentUser && (
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className={`hover:bg-gray-100 p-1 rounded-full ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                  title="Preferences"
                >
                  <FaCog size={16} />
                </button>
              )}
              <button 
                onClick={() => setIsOpen(false)}
                className={`hover:bg-gray-100 p-1 rounded-full ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                title="Close"
              >
                <FaTimes size={16} />
              </button>
            </div>
          </div>
          
          {showSettings ? (
            <SettingsPanel />
          ) : (
            <>
              <div className="p-4 overflow-y-auto flex-grow" style={{ maxHeight: '400px', minHeight: '300px' }}>
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`mb-3 p-3 rounded-lg flex ${
                      msg.sender === "user" 
                        ? `ml-auto bg-blue-500 text-white` 
                        : `mr-auto ${isDark ? "bg-gray-800" : "bg-gray-100"}`
                    }`}
                    style={{ maxWidth: '80%' }}
                  >
                    {msg.sender === "user" ? (
                      <>
                        <div className="flex-grow">{msg.text}</div>
                        <div className="ml-2 self-end">
                          <FaUser size={12} className="text-blue-200" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mr-2 self-end">
                          <FaRobot size={12} className={isDark ? "text-gray-500" : "text-gray-400"} />
                        </div>
                        <div className="flex-grow">{renderMessage(msg)}</div>
                      </>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-center my-2 ml-2">
                    <FaRobot size={12} className={`mr-2 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                    <div className="animate-pulse flex space-x-1">
                      <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                      <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <form onSubmit={handleSubmit} className="border-t p-2 flex">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Type your message..."
                  className={`flex-grow px-3 py-2 rounded-l-lg focus:outline-none ${isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"}`}
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  className={`px-3 py-2 rounded-r-lg text-white ${
                    isLoading || !prompt.trim() ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  disabled={isLoading || !prompt.trim()}
                >
                  <FaPaperPlane size={14} />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 rounded-full shadow-xl flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white transition-all transform hover:scale-105"
        style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.3)', height: '60px', width: '60px' }}
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </button>
    </div>
  );
};

export default Chatbot;