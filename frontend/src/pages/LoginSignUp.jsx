import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, provider, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle"; // ✅ Import Theme Toggle
import { useTheme } from "../components/ThemeContext"; // ✅ Import Theme Context
import './LoginSignUp.css'

const LoginSignUp = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and sign-up
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const navigate = useNavigate();
  const { theme } = useTheme(); // ✅ Get the theme state

  // Handle Email login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      console.error("Error logging in with email", error);
    }
  };

  // Handle Email sign-up
  const handleSignUp = async (e) => {
    e.preventDefault();
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
      console.error("Error signing up with email", error);
    }
  };

  // Handle Google login/sign-up
  // Handle Google login/sign-up
const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      const userRef = doc(db, "students", user.email); // Reference to the user's Firestore document
      const userSnapshot = await getDoc(userRef); // Check if the user already exists
  
      if (userSnapshot.exists()) {
        // If the user exists, we only update their profile (if necessary)
        await setDoc(
          userRef,
          {
            name: name || user.displayName,
            profile_picture: profilePicture || user.photoURL,
            updated_at: serverTimestamp(),
          },
          { merge: true } // Use merge to update only specific fields
        );
      } else {
        // If the user does not exist, create a new document
        await setDoc(userRef, {
          email: user.email,
          name: name || user.displayName,
          profile_picture: profilePicture || user.photoURL,
          created_at: serverTimestamp(),
        });
      }
  
      navigate("/"); // Redirect to the home page
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };
  

  return (
    <>
    <header className="absolute top-4 right-4">
        <ThemeToggle /> {/* ✅ Theme Toggle button */}
      </header>
    <div
      className={`container ${isLogin ? "" : "active"} transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-black" : "bg-gray-100 text-black"
      }`}
    >
      

      {/* Login Form */}
      <div className={`form-container sign-in `}>
        <form onSubmit={handleLogin}>
          <h2 className="text-2xl font-bold mb-4 text-black">Login</h2>
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
          <button type="submit" className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 w-full">
            Login with Email
          </button>
          <div className="text-center mt-4">
            <p className="mb-2">or</p>
            <button onClick={handleGoogleSignIn} className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 w-full">
              Continue with Google
            </button>
          </div>
        </form>
      </div>

      {/* Sign-Up Form */}
      <div className={`form-container sign-up`}>
        <form onSubmit={handleSignUp}>
          <h2 className="text-2xl font-bold mb-4 text-black">Sign Up</h2>
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
          <button type="submit" className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 w-full">
            Sign Up with Email
          </button>
          <div className="text-center mt-4">
            <p className="mb-2">or</p>
            <button onClick={handleGoogleSignIn} className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 w-full">
              Sign Up with Google
            </button>
          </div>
        </form>
      </div>

      {/* Toggle for switching between login and signup */}
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1 className="text-5xl m-4">Hello, Friend!</h1>
            <h3>Enter your personal details and start journey with us</h3>
            <button onClick={() => setIsLogin(true)} className="bg-transparent text-2xl border-white p-2 rounded">
              Log In
            </button>
          </div>
          <div className="toggle-panel toggle-right">
          <h1 className="text-5xl m-4">Welcome Back!</h1>
            <h3>To keep connected with us please login with your personal info</h3>
            <button onClick={() => setIsLogin(false)} className="bg-transparent text-2xl border-white p-2 rounded">
            Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginSignUp;
