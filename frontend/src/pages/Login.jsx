import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle"; // ✅ Import Theme Toggle
import { useTheme } from "../components/ThemeContext"; // ✅ Import Theme Context

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { theme } = useTheme(); // ✅ Get the theme state

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      console.error("Error logging in with email", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.error("Error logging in with Google", error);
    }
  };

  const handleNavigateToSignUp = () => {
    navigate("/signin");
  };

  return (
    <div
      className={`flex flex-col justify-center items-center h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Header with Theme Toggle */}
      <header className="absolute top-4 right-4">
        <ThemeToggle /> {/* ✅ Theme Toggle button */}
      </header>

      <div
        className={`p-8 rounded-xl shadow-md w-full max-w-md transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 mb-4 w-full rounded-lg bg-transparent"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-4 w-full rounded-lg bg-transparent"
          />
          <button
            type="submit"
            className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 w-full"
          >
            Login with Email
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="mb-2">or</p>
          <button
            onClick={handleGoogleLogin}
            className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 w-full"
          >
            Continue with Google
          </button>
        </div>

        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <button
            onClick={handleNavigateToSignUp}
            className="text-blue-500 underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;