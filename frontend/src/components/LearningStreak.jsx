import React, { useState, useEffect } from "react";

const LearningStreak = ({ streakData, isDark }) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Current streak calculation
  const currentStreak = streakData.filter((day, index, array) => {
    if (index === 0) return day.active;
    return day.active && array[index-1].active;
  }).length;

  // Get day names for displaying
  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className={`rounded-lg shadow-lg p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium flex items-center">
          <span className="mr-2">🔥</span>Learning Streak
        </h3>
        <div className={`flex items-center ${animate ? "animate-pulse" : ""}`}>
          <span className="text-xl font-bold">{currentStreak} days</span>
        </div>
      </div>
      
      <div className="flex justify-between mb-4">
        {streakData.map((day, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 mb-1 rounded-full flex items-center justify-center transition-all duration-500 ${
                day.active 
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md transform scale-110" 
                  : isDark ? "bg-gray-700" : "bg-gray-200"
              }`}
            >
              {day.active ? (
                <span className={`text-sm ${animate && index === streakData.length - 1 ? "animate-ping" : ""}`}>✓</span>
              ) : (
                <span className="text-sm opacity-50">·</span>
              )}
            </div>
            <span className="text-xs font-medium">{getDayName(day.date)}</span>
            <span className="text-xs opacity-75">{day.date.slice(-2)}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm font-medium">Best streak: 12 days</span>
            <div className="text-xs opacity-75">Keep going to beat your record!</div>
          </div>
          <button className="text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors transform hover:scale-105">
            View Stats →
          </button>
        </div>
      </div>
      
      {/* Bonus section: Next milestone */}
      <div className={`mt-4 p-3 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
        <div className="flex items-center">
          <div className="mr-3 text-xl">🎯</div>
          <div className="flex-1">
            <div className="text-sm font-medium">Next milestone: 7-day streak</div>
            <div className="w-full mt-1">
              <div className={`${isDark ? "bg-gray-600" : "bg-gray-300"} rounded-full h-1.5 w-full`}>
                <div 
                  className="bg-orange-500 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(currentStreak / 7) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="ml-3 text-sm font-bold">{currentStreak}/7</div>
        </div>
      </div>
    </div>
  );
};

export default LearningStreak;