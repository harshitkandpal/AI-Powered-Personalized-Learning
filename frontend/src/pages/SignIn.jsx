import React, { useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false); // Toggle between Sign In and Login
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user data to Firestore
      await setDoc(doc(db, "students", user.email), {
        email: user.email,
        name: name || user.displayName, // Use provided name, or fallback to Google name
        profile_picture: profilePicture || user.photoURL, // Optional
        created_at: serverTimestamp(),
      });

      navigate("/dashboard"); // Redirect to dashboard after login
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const handleEmailSignIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      // Save user data to Firestore
      await setDoc(doc(db, "students", email), {
        email,
        name,
        profile_picture: profilePicture,
        created_at: serverTimestamp(),
      });

      navigate("/dashboard"); // Redirect to dashboard after login
    } catch (error) {
      console.error("Error signing in with email", error);
    }
  };

  // Handle switch to login page
  const handleSwitchToLogin = () => {
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          className="border p-2 mb-4 w-full rounded-lg"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 mb-4 w-full rounded-lg"
        />
        {!isLogin && (
          <>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="border p-2 mb-4 w-full rounded-lg"
            />
            <input
              type="text"
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
              placeholder="Profile Picture URL (optional)"
              className="border p-2 mb-4 w-full rounded-lg"
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
            onClick={handleSwitchToLogin} // Navigate to login page
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
