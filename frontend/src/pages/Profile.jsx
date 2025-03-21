// import React from "react";
// import { useAuth } from "../AuthContext";
// import { useNavigate } from "react-router-dom";
// import defaultProfile from "../assets/react.svg";
// import CourseCard from "../components/CourseCard";
// import { doc, getDoc } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { db } from "../firebase"; // Assuming firebase is set up
// import { useTheme } from "../components/ThemeContext";

// const Profile = () => {  // Correct prop destructuring
//   const { currentUser, logout } = useAuth();
//   const navigate = useNavigate();
//   const [enrolledCourses, setEnrolledCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { theme } = useTheme(); // Use the theme context
//   const isDark = theme === "dark";

//   useEffect(() => {
//     const fetchEnrolledCourses = async () => {
//       if (currentUser) {
//         try {
//           // Fetch the student document
//           const studentRef = doc(db, "students", currentUser.email);
//           const studentSnapshot = await getDoc(studentRef);
          
//           if (studentSnapshot.exists()) {
//             const studentData = studentSnapshot.data();
//             console.log(studentData.enrolled_courses);

//             // Get array of course IDs, filtering out undefined or invalid IDs
//             const enrolledCourseIds = studentData.enrolled_courses
//             console.log(enrolledCourseIds)

//             // Now, fetch details of each course using the enrolled course IDs
//             const coursePromises = enrolledCourseIds.map(async (courseId) => {
//               const courseRef = doc(db, "courses", courseId);
//               const courseSnapshot = await getDoc(courseRef);
//               return courseSnapshot.exists() ? courseSnapshot.data() : null;
//             });

//             const courses = await Promise.all(coursePromises);
//             // Filter out any null values (in case a course no longer exists)
//             setEnrolledCourses(courses.filter(course => course !== null));
//             console.log(enrolledCourses)
//           }
//         } catch (error) {
//           console.error("Error fetching enrolled courses: ", error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     fetchEnrolledCourses();
//   }, [currentUser]);

//   if (loading) {
//     return <p>Loading your courses...</p>;
//   }

//   const activeDays = [
//     { date: "2025-03-14", active: true },
//     { date: "2025-03-15", active: true },
//     { date: "2025-03-16", active: false },
//     { date: "2025-03-17", active: true },
//     { date: "2025-03-18", active: true },
//     { date: "2025-03-19", active: false },
//     { date: "2025-03-20", active: true },
//   ];

//   const userBadges = [
//     { id: 1, name: "First Login", icon: "🏆" },
//     { id: 2, name: "5 Days Streak", icon: "🔥" },
//     { id: 3, name: "Course Completed", icon: "🎓" },
//   ];

//   const handleLogout = async () => {
//     await logout();
//     navigate("/login");
//   };

//   const handleGoBack = () => {
//     navigate(-1);
//   };

//   return (
//     <div className={`profile-page p-6 ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
//       {/* Header with Go Back and Logout buttons */}
//       <div className="flex justify-between mb-6">
//         <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors" onClick={handleGoBack}>
//           ← Go Back
//         </button>
//         <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors" onClick={handleLogout}>
//           Logout
//         </button>
//       </div>

//       <div className="flex flex-col md:flex-row gap-6">
//         {/* Left Side - Profile Picture */}
//         <div className="w-full md:w-1/3">
//           <div className={`rounded-lg shadow p-5 ${isDark ? "bg-gray-800" : "bg-white"}`}>
//             <div className="flex flex-col items-center">
//               <div className={`w-62 h-62 rounded-full mb-4 overflow-hidden ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
//                 {currentUser?.photoURL ? (
//                   <img
//                     src={currentUser.photoURL || defaultProfile}
//                     alt="Profile"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="flex items-center justify-center w-full h-full text-4xl">
//                     👤
//                   </div>
//                 )}
//               </div>
//               <h2 className="text-xl font-semibold">
//                 {currentUser ? currentUser.displayName || currentUser.email : "Guest"}
//               </h2>
//               <p className={isDark ? "text-gray-300" : "text-gray-600"}>
//                 {currentUser?.email || "Please log in"}
//               </p>
//             </div>
//           </div>

//           {/* Activity Days */}
//           <div className={`rounded-lg shadow p-6 mt-6 ${isDark ? "bg-gray-700" : "bg-white"}`}>
//             <h3 className="text-lg font-medium mb-2">Activity</h3>
//             <div className="grid grid-cols-7 gap-1">
//               {activeDays.map((day, index) => (
//                 <div
//                   key={index}
//                   className={`h-6 rounded ${day.active ? "bg-green-500" : isDark ? "bg-gray-800" : "bg-gray-200"}`}
//                   title={day.date}
//                 ></div>
//               ))}
//             </div>
//             <p className={`text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
//               Active for {activeDays.filter((day) => day.active).length} days this week
//             </p>
//           </div>
//         </div>

//         {/* Right Side - Badges & Courses */}
//         <div className="w-full md:w-2/3">
//           {/* Badges Section */}
//           <div className={`rounded-lg shadow p-6 mb-6 ${isDark ? "bg-gray-700" : "bg-white"}`}>
//             <h3 className="text-lg font-medium mb-4">Badges Earned</h3>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//               {userBadges.map((badge) => (
//                 <div 
//                   key={badge.id} 
//                   className={`flex items-center p-3 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
//                 >
//                   <div className="text-2xl mr-3">{badge.icon}</div>
//                   <div>
//                     <p className="font-medium">{badge.name}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Courses Section */}
//           <div className={` ${isDark ? "bg-gray-700" : "bg-gray-100"} rounded-lg shadow p-4`}>
//             <h3 className="text-lg font-medium mb-4">Your Courses</h3>
//             <div className="my-learning-page p-6">
//         {enrolledCourses.length > 0 ? (
//           <div className="course-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {enrolledCourses.map((course, index) => (
//               <CourseCard key={index} course={course} />
//             ))}
//           </div>
//         ) : (
//           <p>You are not enrolled in any courses yet.</p>
//         )}
//       </div>
//     </div>
//           </div>
//         </div>
//       </div>
    
//   );
// };

// export default Profile;
import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import defaultProfile from "../assets/react.svg";
import CourseCard from "../components/CourseCard";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Assuming firebase is set up
import { useTheme } from "../components/ThemeContext";
import LearningStreak from "../components/LearningStreak";
import AchievementSystem from "../components/AchievementSystem";
import toast, { Toaster } from "react-hot-toast";
import Confetti from "react-confetti";

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);
  
  // User stats
  const userLevel = 3;
  const experiencePoints = 350; // Out of 500 for next level

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (currentUser) {
        try {
          // Fetch the student document
          const studentRef = doc(db, "students", currentUser.email);
          const studentSnapshot = await getDoc(studentRef);
          
          if (studentSnapshot.exists()) {
            const studentData = studentSnapshot.data();
            
            // Get array of course IDs, filtering out undefined or invalid IDs
            const enrolledCourseIds = studentData.enrolled_courses;
            
            // Now, fetch details of each course using the enrolled course IDs
            const coursePromises = enrolledCourseIds.map(async (courseId) => {
              const courseRef = doc(db, "courses", courseId);
              const courseSnapshot = await getDoc(courseRef);
              return courseSnapshot.exists() ? { 
                id: courseId,
                ...courseSnapshot.data(),
                progress: Math.floor(Math.random() * 100) // Simulate progress for demo
              } : null;
            });

            const courses = await Promise.all(coursePromises);
            // Filter out any null values (in case a course no longer exists)
            setEnrolledCourses(courses.filter(course => course !== null));
          }
        } catch (error) {
          console.error("Error fetching enrolled courses: ", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEnrolledCourses();
    
    // Simulate achievement notification
    setTimeout(() => {
      setNewAchievement({ name: "5 Days Streak", icon: "🔥" });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }, 2000);
  }, [currentUser]);

  // Notify about courses close to completion
  useEffect(() => {
    if (enrolledCourses.length > 0) {
      const almostCompleteCourse = enrolledCourses.find(
        course => course.progress >= 90 && course.progress < 100
      );
      
      if (almostCompleteCourse) {
        toast(`Almost there! Complete "${almostCompleteCourse.title}" to earn a badge!`, {
          icon: '🎓',
          style: {
            borderRadius: '10px',
            background: isDark ? '#1F2937' : '#fff',
            color: isDark ? '#fff' : '#000',
          },
          duration: 5000,
        });
      }
    }
  }, [enrolledCourses, isDark]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-screen ${isDark ? "bg-gray-900 text-white" : "bg-gray-100"}`}>
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg">Loading your progress...</p>
        </div>
      </div>
    );
  }

  const activeDays = [
    { date: "2025-03-14", active: true },
    { date: "2025-03-15", active: true },
    { date: "2025-03-16", active: false },
    { date: "2025-03-17", active: true },
    { date: "2025-03-18", active: true },
    { date: "2025-03-19", active: false },
    { date: "2025-03-20", active: true },
  ];

  const userBadges = [
    { id: 1, name: "First Login", icon: "🏆", date: "March 10, 2025" },
    { id: 2, name: "5 Days Streak", icon: "🔥", date: "March 15, 2025" },
    { id: 3, name: "Course Completed", icon: "🎓", date: "March 18, 2025" },
  ];

  const achievements = [
    { id: 1, title: "First Quiz Completed", progress: 100, icon: "📝", xp: 50 },
    { id: 2, title: "Watch 10 Videos", progress: 70, icon: "📺", xp: 100 },
    { id: 3, title: "Complete 5 Courses", progress: 40, icon: "🎓", xp: 200 },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      setIsLoggingOut(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const dismissAchievement = () => {
    setShowConfetti(false);
    setNewAchievement(null);
  };

  return (
    <div className={`profile-page min-h-screen p-6 ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
      {/* Toast notifications */}
      <Toaster position="bottom-right" />
      
      {/* Confetti and achievement popup */}
      {showConfetti && (
        <>
          <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={300} />
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className={`p-8 rounded-lg ${isDark ? "bg-gray-800" : "bg-white"} text-center transform transition-all duration-500 animate-bounce-once shadow-2xl max-w-sm`}>
              <div className="text-6xl mb-4 animate-bounce">{newAchievement.icon}</div>
              <h3 className="text-xl font-bold mb-2">Achievement Unlocked!</h3>
              <p className="text-lg mb-3">{newAchievement.name}</p>
              <p className="text-sm mb-5 opacity-75">+50 XP Earned</p>
              <button 
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-all transform hover:scale-105 active:scale-95"
                onClick={dismissAchievement}
              >
                Awesome!
              </button>
            </div>
          </div>
        </>
      )}

      {/* Header with Go Back and Logout buttons */}
      <div className="flex justify-between mb-6">
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all transform hover:scale-105 active:scale-95" 
          onClick={handleGoBack}
        >
          ← Go Back
        </button>
        <button 
          className={`bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-all transform hover:scale-105 active:scale-95 ${isLoggingOut ? "opacity-75" : ""}`} 
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side - Profile Picture and Stats */}
        <div className="w-full md:w-1/3 space-y-6">
          {/* Profile Card */}
          <div className={`rounded-lg shadow-lg p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex flex-col items-center">
              {/* Animated Avatar with Level Badge */}
              <div className="relative mb-6">
                <div className={`w-32 h-32 rounded-full overflow-hidden border-4 ${isDark ? "border-gray-700" : "border-white"} shadow-lg`}>
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL || defaultProfile}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-4xl bg-gray-200">
                      👤
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center border-2 border-white text-sm font-bold shadow-lg animate-pulse-slow">
                  {userLevel}
                </div>
                {/* Experience ring */}
                <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                  <circle 
                    cx="50" cy="50" r="48" 
                    fill="none" 
                    stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} 
                    strokeWidth="3" 
                  />
                  <circle 
                    cx="50" cy="50" r="48" 
                    fill="none" 
                    stroke="url(#gradient)" 
                    strokeWidth="3" 
                    strokeDasharray="302"
                    strokeDashoffset={302 - (302 * (experiencePoints / 500))}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-semibold mb-1">
                {currentUser ? currentUser.displayName || currentUser.email.split("@")[0] : "Guest"}
              </h2>
              <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {currentUser?.email || "Please log in"}
              </p>

              {/* XP Progress Bar */}
              <div className="w-full mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Level {userLevel}</span>
                  <span>{experiencePoints}/500 XP to Level {userLevel + 1}</span>
                </div>
                <div className={`${isDark ? "bg-gray-700" : "bg-gray-200"} rounded-full h-3 w-full overflow-hidden`}>
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-1000 ease-out"
                    style={{ width: `${(experiencePoints / 500) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Streak Component */}
          <LearningStreak streakData={activeDays} isDark={isDark} />

          {/* Daily Challenges */}
          <div className={`rounded-lg shadow-lg p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <span className="mr-2">📅</span>Daily Challenges
            </h3>
            <div className="space-y-4">
              <div className={`p-3 rounded ${isDark ? "bg-gray-700" : "bg-gray-100"} flex items-center`}>
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <span className="text-green-500">✓</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Complete one lesson</p>
                  <p className="text-xs opacity-75">+15 XP</p>
                </div>
              </div>
              <div className={`p-3 rounded ${isDark ? "bg-gray-700" : "bg-gray-100"} flex items-center`}>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-500">⚡</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Pass a quiz</p>
                  <p className="text-xs opacity-75">+25 XP</p>
                </div>
                <button className="bg-blue-500 text-white text-xs px-2 py-1 rounded transition-colors hover:bg-blue-600">
                  Start
                </button>
              </div>
              <div className={`p-3 rounded ${isDark ? "bg-gray-700" : "bg-gray-100"} flex items-center`}>
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <span className="text-gray-500">🏆</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Join a study group</p>
                  <p className="text-xs opacity-75">+30 XP</p>
                </div>
                <button className="bg-blue-500 text-white text-xs px-2 py-1 rounded transition-colors hover:bg-blue-600">
                  Find
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Badges, Achievements & Courses */}
        <div className="w-full md:w-2/3 space-y-6">
          {/* Badges Section */}
          <div className={`rounded-lg shadow-lg p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <span className="mr-2">🏆</span>Badges Earned
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {userBadges.map((badge) => (
                <div 
                  key={badge.id} 
                  className={`flex items-center p-4 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
                >
                  <div className="text-3xl mr-4">{badge.icon}</div>
                  <div>
                    <p className="font-medium">{badge.name}</p>
                    <p className="text-xs opacity-75">Earned: {badge.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Section */}
          <AchievementSystem achievements={achievements} isDark={isDark} />

          {/* Courses Section */}
          <div className={`rounded-lg shadow-lg p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <span className="mr-2">📚</span>Your Courses
            </h3>
            {enrolledCourses.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {enrolledCourses.map((course, index) => (
      <div
        key={index}
        className={`relative rounded-lg overflow-hidden  transform transition-all duration-300 hover:scale-105 ${isDark ? "bg-gray-800" : "bg-white"}`}
      >
        <CourseCard key={course.course_id} course={course} />

        {/* Display 'Almost Done' tag if progress is 90% or more */}
        {course.progress >= 90 && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            Almost Done!
          </div>
        )}
      </div>
    ))}
  </div>
) : (
  <div className={`p-8 text-center rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
    <p className="text-lg">You are not enrolled in any courses yet.</p>
    <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
      Browse Courses
    </button>
  </div>
)}

          </div>
        </div>
      </div>

      {/* Add some CSS for animations */}
      <style jsx>{`
        @keyframes bounce-once {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-25px); }
        }
        .animate-bounce-once {
          animation: bounce-once 1s ease-in-out;
        }
        .animate-pulse-slow {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default Profile;