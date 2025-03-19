// Profile.js
import React from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login"); // Redirect to the login page after logging out
  };

  return (
    <div className="profile-page flex flex-col items-center p-4">
      <div className="flex justify-between w-full">
        {/* Logout button at the top right */}
        <button
          className="bg-red-500 text-white py-2 px-4 rounded-lg"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <h2 className="text-xl font-semibold mt-4">
        Welcome, {currentUser ? currentUser.email : "Guest"}
      </h2>
    </div>
  );
};

export default Profile;
