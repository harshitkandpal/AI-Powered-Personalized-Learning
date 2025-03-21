import React from "react";

const AchievementSystem = ({ achievements, isDark }) => {
  return (
    <div className={`rounded-lg shadow-lg p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}>
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <span className="mr-2">🎯</span>Achievements
      </h3>
      <div className="space-y-5">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="flex items-center">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
              achievement.progress === 100 
                ? "bg-gradient-to-r from-green-400 to-green-600" 
                : isDark ? "bg-gray-700" : "bg-gray-200"
            }`}>
              <span className="text-2xl">{achievement.icon}</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="font-medium">{achievement.title}</span>
                <span className={`text-sm ${
                  achievement.progress === 100 ? "text-green-500" : ""
                }`}>
                  {achievement.progress}%
                </span>
              </div>
              <div className={`${isDark ? "bg-gray-700" : "bg-gray-200"} rounded-full h-2.5 w-full`}>
                <div 
                  className={`${
                    achievement.progress === 100 
                      ? "bg-green-500" 
                      : "bg-blue-500"
                  } h-full rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${achievement.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs opacity-75">
                  {achievement.progress === 100 ? "Completed" : "In progress"}
                </span>
                <span className="text-xs font-medium">
                  {achievement.progress === 100 ? `+${achievement.xp} XP earned` : `+${achievement.xp} XP`}
                </span>
              </div>
            </div>
            {achievement.progress === 100 && (
              <div className="ml-4 text-green-500 text-xl animate-bounce-slow">✓</div>
            )}
          </div>
        ))}
      </div>
      
      {/* Upcoming achievements preview */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium mb-3">Coming up next</h4>
        <div className={`p-3 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"} flex items-center group cursor-pointer transform transition-transform hover:scale-102`}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 bg-gray-600 text-gray-400">
            <span className="text-xl">🌟</span>
          </div>
          <div className="flex-1">
            <p className="font-medium">Earn your first Perfect Score</p>
            <p className="text-xs opacity-75">Complete any quiz with 100% accuracy</p>
          </div>
          <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs font-bold text-blue-500">+100 XP</span>
          </div>
        </div>
      </div>
      
      {/* Add some CSS for animations */}
      <style jsx>{`
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default AchievementSystem;