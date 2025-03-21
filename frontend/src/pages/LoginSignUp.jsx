// import React, { useState } from "react";
// import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
// import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
// import { auth, provider, db } from "../firebase";
// import { useNavigate } from "react-router-dom";
// import ThemeToggle from "../components/ThemeToggle"; // ✅ Import Theme Toggle
// import { useTheme } from "../components/ThemeContext"; // ✅ Import Theme Context
// import './LoginSignUp.css'

// const LoginSignUp = () => {
//   const [isLogin, setIsLogin] = useState(true); // Toggle between login and sign-up
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [profilePicture, setProfilePicture] = useState("");
//   const navigate = useNavigate();
//   const { theme } = useTheme(); // ✅ Get the theme state

//   // Handle Email login
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       navigate("/");
//     } catch (error) {
//       console.error("Error logging in with email", error);
//     }
//   };

//   // Handle Email sign-up
//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);

//       await setDoc(doc(db, "students", email), {
//         email,
//         name,
//         profile_picture: profilePicture,
//         created_at: serverTimestamp(),
//       });

//       navigate("/");
//     } catch (error) {
//       console.error("Error signing up with email", error);
//     }
//   };

//   // Handle Google login/sign-up
//   // Handle Google login/sign-up
// const handleGoogleSignIn = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
  
//       const userRef = doc(db, "students", user.email); // Reference to the user's Firestore document
//       const userSnapshot = await getDoc(userRef); // Check if the user already exists
  
//       if (userSnapshot.exists()) {
//         // If the user exists, we only update their profile (if necessary)
//         await setDoc(
//           userRef,
//           {
//             name: name || user.displayName,
//             profile_picture: profilePicture || user.photoURL,
//             updated_at: serverTimestamp(),
//           },
//           { merge: true } // Use merge to update only specific fields
//         );
//       } else {
//         // If the user does not exist, create a new document
//         await setDoc(userRef, {
//           email: user.email,
//           name: name || user.displayName,
//           profile_picture: profilePicture || user.photoURL,
//           created_at: serverTimestamp(),
//         });
//       }
  
//       navigate("/"); // Redirect to the home page
//     } catch (error) {
//       console.error("Error signing in with Google", error);
//     }
//   };
  

//   return (
//     <>
//     <header className="absolute top-4 right-4">
//         <ThemeToggle /> {/* ✅ Theme Toggle button */}
//       </header>
//     <div
//       className={`container ${isLogin ? "" : "active"} transition-colors duration-300 ${
//         theme === "dark" ? "bg-gray-900 text-black" : "bg-gray-100 text-black"
//       }`}
//     >
      

//       {/* Login Form */}
//       <div className={`form-container sign-in `}>
//         <form onSubmit={handleLogin}>
//           <h2 className="text-2xl font-bold mb-4 text-black">Login</h2>
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="border p-2 mb-4 w-full rounded-lg bg-transparent"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="border p-2 mb-4 w-full rounded-lg bg-transparent"
//           />
//           <button type="submit" className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 w-full">
//             Login with Email
//           </button>
//           <div className="text-center mt-4">
//             <p className="mb-2">or</p>
//             <button onClick={handleGoogleSignIn} className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 w-full">
//               Continue with Google
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Sign-Up Form */}
//       <div className={`form-container sign-up`}>
//         <form onSubmit={handleSignUp}>
//           <h2 className="text-2xl font-bold mb-4 text-black">Sign Up</h2>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Full Name"
//             className="border p-2 mb-4 w-full rounded-lg bg-transparent"
//           />
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             className="border p-2 mb-4 w-full rounded-lg bg-transparent"
//           />
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             className="border p-2 mb-4 w-full rounded-lg bg-transparent"
//           />
//           <input
//             type="text"
//             value={profilePicture}
//             onChange={(e) => setProfilePicture(e.target.value)}
//             placeholder="Profile Picture URL (optional)"
//             className="border p-2 mb-4 w-full rounded-lg bg-transparent"
//           />
//           <button type="submit" className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 w-full">
//             Sign Up with Email
//           </button>
//           <div className="text-center mt-4">
//             <p className="mb-2">or</p>
//             <button onClick={handleGoogleSignIn} className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 w-full">
//               Sign Up with Google
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Toggle for switching between login and signup */}
//       <div className="toggle-container">
//         <div className="toggle">
//           <div className="toggle-panel toggle-left">
//             <h1 className="text-5xl m-4">Hello, Friend!</h1>
//             <h3>Enter your personal details and start journey with us</h3>
//             <button onClick={() => setIsLogin(true)} className="bg-transparent text-2xl border-white p-2 rounded">
//               Log In
//             </button>
//           </div>
//           <div className="toggle-panel toggle-right">
//           <h1 className="text-5xl m-4">Welcome Back!</h1>
//             <h3>To keep connected with us please login with your personal info</h3>
//             <button onClick={() => setIsLogin(false)} className="bg-transparent text-2xl border-white p-2 rounded">
//             Sign In
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//     </>
//   );
// };

// export default LoginSignUp;
import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, provider, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../components/ThemeContext";
import './LoginSignUp.css';

const LoginSignUp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Add entrance animation on component mount
  useEffect(() => {
    document.querySelector('.container').classList.add('fade-in');
  }, []);

  // Handle form change with smooth animation
  const toggleForm = (login) => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(login);
      setTimeout(() => {
        setIsAnimating(false);
      }, 600);
    }, 300);
  };

  // Handle Email login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Add some delay for visual feedback
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      console.error("Error logging in with email", error);
      setIsLoading(false);
      // Show error animation
      const form = document.querySelector('.sign-in form');
      if (form) {
        form.classList.add('shake');
        setTimeout(() => {
          form.classList.remove('shake');
        }, 500);
      }
    }
  };

  // Handle Email sign-up
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) return;
    
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "students", email), {
        email,
        name,
        profile_picture: profilePicture,
        created_at: serverTimestamp(),
      });

      // Add some delay for visual feedback
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      console.error("Error signing up with email", error);
      setIsLoading(false);
      // Show error animation
      const form = document.querySelector('.sign-up form');
      if (form) {
        form.classList.add('shake');
        setTimeout(() => {
          form.classList.remove('shake');
        }, 500);
      }
    }
  };

  // Handle Google login/sign-up
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      const userRef = doc(db, "students", user.email);
      const userSnapshot = await getDoc(userRef);
  
      if (userSnapshot.exists()) {
        await setDoc(
          userRef,
          {
            name: name || user.displayName,
            profile_picture: profilePicture || user.photoURL,
            updated_at: serverTimestamp(),
          },
          { merge: true }
        );
      } else {
        await setDoc(userRef, {
          email: user.email,
          name: name || user.displayName,
          profile_picture: profilePicture || user.photoURL,
          created_at: serverTimestamp(),
        });
      }
  
      // Add some delay for visual feedback
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      console.error("Error signing in with Google", error);
      setIsLoading(false);
    }
  };

  return (
    <div className={`page-wrapper ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className="theme-toggle-wrapper">
        <ThemeToggle />
      </div>
      
      <div className="logo-section">
    {/* Logo image will go here */}
    <img 
      src="https://img.freepik.com/free-vector/open-magic-book-with-fantasy-blue-light-vector_107791-31843.jpg" 
      alt="EduQuest Logo" 
      className="w-20 h-20 rounded-full object-cover shadow-md"
    />
  <h3 className={`app-logo ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
    EduQuest
  </h3>
  <p className={`app-tagline ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
    Your personal learning companion
  </p>
</div>
      
      <div
        className={`container ${isLogin ? "" : "active"} ${isAnimating ? "animating" : ""} ${
          theme === "dark" ? "dark-theme" : "light-theme"
        }`}
      >
        {/* Login Form */}
        <div className={`form-container sign-in`}>
          <form onSubmit={handleLogin}>
            <h2 className="form-title">Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <a href="#" className="forgot-password">Forgot your password?</a>
            <button 
              type="submit" 
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login with Email'}
            </button>
            
            <div className="divider">
              <span>or</span>
            </div>
            
            <button 
              type="button"
              onClick={handleGoogleSignIn} 
              className={`google-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              <svg className="google-icon" viewBox="0 0 24 24">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
              </svg>
              {isLoading ? 'Processing...' : 'Continue with Google'}
            </button>
          </form>
        </div>

        {/* Sign-Up Form */}
        <div className={`form-container sign-up`}>
          <form onSubmit={handleSignUp}>
            <h2 className="form-title">Sign Up</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <input
              type="text"
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
              placeholder="Profile Picture URL (optional)"
            />
            <button 
              type="submit" 
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up with Email'}
            </button>
            
            <div className="divider">
              <span>or</span>
            </div>
            
            <button 
              type="button"
              onClick={handleGoogleSignIn} 
              className={`google-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              <svg className="google-icon" viewBox="0 0 24 24">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
              </svg>
              {isLoading ? 'Processing...' : 'Sign Up with Google'}
            </button>
          </form>
        </div>

        {/* Toggle for switching between login and signup */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Hello, Friend!</h1>
              <h3>Enter your personal details and start your journey with us</h3>
              <button 
                onClick={() => toggleForm(true)} 
                className="toggle-button"
              >
                Log In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Welcome Back!</h1>
              <h3>To keep connected with us please login with your personal info</h3>
              <button 
                onClick={() => toggleForm(false)} 
                className="toggle-button"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
