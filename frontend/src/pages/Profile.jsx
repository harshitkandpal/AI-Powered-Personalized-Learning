import React from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import defaultProfile from "../assets/react.svg";
import CourseCard from "../components/CourseCard";

const Profile = ({ courses }) => {  // Correct prop destructuring
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

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
    <div className="profile-page p-6">
      {/* Header with Go Back and Logout buttons */}
      <div className="flex justify-between mb-6">
        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg" onClick={handleGoBack}>
          ← Go Back
        </button>
        <button className="bg-red-500 text-white py-2 px-4 rounded-lg" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side - Profile Picture */}
        <div className="w-full md:w-1/3">
          <div className="bg-zinc-600 rounded-lg shadow p-5">
            <div className="flex flex-col items-center">
              <div className="w-62 h-62 rounded-full bg-gray-200 mb-4 overflow-hidden">
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL || defaultProfile}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-500 text-4xl">
                    👤
                  </div>
                )}
              </div>
              <h2 className="text-xl font-semibold">
                {currentUser ? currentUser.displayName || currentUser.email : "Guest"}
              </h2>
              <p>{currentUser?.email || "Please log in"}</p>
            </div>
          </div>

          {/* Activity Days */}
          <div className="bg-zinc-600 rounded-lg shadow p-6 mt-6">
            <h3 className="text-lg font-medium mb-2">Activity</h3>
            <div className="grid grid-cols-7 gap-1">
              {activeDays.map((day, index) => (
                <div
                  key={index}
                  className={`h-6 rounded ${day.active ? "bg-green-500" : "bg-gray-200"}`}
                  title={day.date}
                ></div>
              ))}
            </div>
            <p className="text-sm mt-2 text-gray-500">
              Active for {activeDays.filter((day) => day.active).length} days this week
            </p>
          </div>
        </div>

        {/* Right Side - Badges & Courses */}
        <div className="w-full md:w-2/3">
          {/* Badges Section */}
          <div className="bg-zinc-600 rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Badges Earned</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {userBadges.map((badge) => (
                <div key={badge.id} className="flex items-center bg-zinc-900 p-3 rounded-lg">
                  <div className="text-2xl mr-3">{badge.icon}</div>
                  <div>
                    <p className="font-medium">{badge.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Courses Section */}
          <div className="bg-zinc-600 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Your Courses</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {courses?.length > 0 ? (
                courses.map((course) => (
                  <CourseCard key={course.course_id} course={course} />
                ))
              ) : (
                <p className="text-gray-400">No courses found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
