// Dashboard.js
import React from "react";
import { useAuth } from "../AuthContext";

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      <h2>Welcome, {currentUser ? currentUser.email : "Guest"}</h2>
    </div>
  );
};

export default Dashboard;
