import React from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import defaultProfile from "../assets/react.svg";
import CourseCard from "../components/CourseCard";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase"; // Assuming firebase is set up
import { useTheme } from "../components/ThemeContext";

const Profile = () => {  // Correct prop destructuring
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme(); // Use the theme context
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (currentUser) {
        try {
          // Fetch the student document
          const studentRef = doc(db, "students", currentUser.email);
          const studentSnapshot = await getDoc(studentRef);
          
          if (studentSnapshot.exists()) {
            const studentData = studentSnapshot.data();
            console.log(studentData.enrolled_courses);

            // Get array of course IDs, filtering out undefined or invalid IDs
            const enrolledCourseIds = studentData.enrolled_courses
            console.log(enrolledCourseIds)

            // Now, fetch details of each course using the enrolled course IDs
            const coursePromises = enrolledCourseIds.map(async (courseId) => {
              const courseRef = doc(db, "courses", courseId);
              const courseSnapshot = await getDoc(courseRef);
              return courseSnapshot.exists() ? courseSnapshot.data() : null;
            });

            const courses = await Promise.all(coursePromises);
            // Filter out any null values (in case a course no longer exists)
            setEnrolledCourses(courses.filter(course => course !== null));
            console.log(enrolledCourses)
          }
        } catch (error) {
          console.error("Error fetching enrolled courses: ", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEnrolledCourses();
  }, [currentUser]);

  if (loading) {
    return <p>Loading your courses...</p>;
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
    { id: 1, name: "First Login", icon: "🏆" },
    { id: 2, name: "5 Days Streak", icon: "🔥" },
    { id: 3, name: "Course Completed", icon: "🎓" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={`profile-page p-6 ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
      {/* Header with Go Back and Logout buttons */}
      <div className="flex justify-between mb-6">
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors" onClick={handleGoBack}>
          ← Go Back
        </button>
        <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side - Profile Picture */}
        <div className="w-full md:w-1/3">
          <div className={`rounded-lg shadow p-5 ${isDark ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex flex-col items-center">
              <div className={`w-62 h-62 rounded-full mb-4 overflow-hidden ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL || defaultProfile}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-4xl">
                    👤
                  </div>
                )}
              </div>
              <h2 className="text-xl font-semibold">
                {currentUser ? currentUser.displayName || currentUser.email : "Guest"}
              </h2>
              <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                {currentUser?.email || "Please log in"}
              </p>
            </div>
          </div>

          {/* Activity Days */}
          <div className={`rounded-lg shadow p-6 mt-6 ${isDark ? "bg-gray-700" : "bg-white"}`}>
            <h3 className="text-lg font-medium mb-2">Activity</h3>
            <div className="grid grid-cols-7 gap-1">
              {activeDays.map((day, index) => (
                <div
                  key={index}
                  className={`h-6 rounded ${day.active ? "bg-green-500" : isDark ? "bg-gray-800" : "bg-gray-200"}`}
                  title={day.date}
                ></div>
              ))}
            </div>
            <p className={`text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Active for {activeDays.filter((day) => day.active).length} days this week
            </p>
          </div>
        </div>

        {/* Right Side - Badges & Courses */}
        <div className="w-full md:w-2/3">
          {/* Badges Section */}
          <div className={`rounded-lg shadow p-6 mb-6 ${isDark ? "bg-gray-700" : "bg-white"}`}>
            <h3 className="text-lg font-medium mb-4">Badges Earned</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {userBadges.map((badge) => (
                <div 
                  key={badge.id} 
                  className={`flex items-center p-3 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
                >
                  <div className="text-2xl mr-3">{badge.icon}</div>
                  <div>
                    <p className="font-medium">{badge.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Courses Section */}
          <div className={` ${isDark ? "bg-gray-700" : "bg-gray-100"} rounded-lg shadow p-4`}>
            <h3 className="text-lg font-medium mb-4">Your Courses</h3>
            <div className="my-learning-page p-6">
        {enrolledCourses.length > 0 ? (
          <div className="course-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))}
          </div>
        ) : (
          <p>You are not enrolled in any courses yet.</p>
        )}
      </div>
    </div>
          </div>
        </div>
      </div>
    
  );
};

export default Profile;
