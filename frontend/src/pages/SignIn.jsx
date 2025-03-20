import React, { useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import ThemeToggle from "../components/ThemeToggle"; // ✅ Import Theme Toggle
import { useTheme } from "../components/ThemeContext"; // ✅ Import Theme Context

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme(); // ✅ Get current theme

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, "students", user.email), {
        email: user.email,
        name: name || user.displayName,
        profile_picture: profilePicture || user.photoURL,
        created_at: serverTimestamp(),
      });

      navigate("/");
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const handleEmailSignIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "students", email), {
        email,
        name,
        profile_picture: profilePicture,
        created_at: serverTimestamp(),
      });

      navigate("/");
    } catch (error) {
      console.error("Error signing in with email", error);
    }
  };

  const handleSwitchToLogin = () => {
    navigate("/login");
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
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          className="border p-2 mb-4 w-full rounded-lg bg-transparent"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 mb-4 w-full rounded-lg bg-transparent"
        />
        {!isLogin && (
          <>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="border p-2 mb-4 w-full rounded-lg bg-transparent"
            />
            <input
              type="text"
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
              placeholder="Profile Picture URL (optional)"
              className="border p-2 mb-4 w-full rounded-lg bg-transparent"
            />
          </>
        )}

        {!isLogin && (
          <button
            onClick={handleEmailSignIn}
            className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 w-full"
          >
            Sign Up with Email
          </button>
        )}

        <div className="text-center mt-4">
          <p className="mb-2">or</p>
          <button
            onClick={handleGoogleSignIn}
            className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 w-full"
          >
            Sign in with Google
          </button>
        </div>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <button
            onClick={handleSwitchToLogin}
            className="text-blue-500 underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;