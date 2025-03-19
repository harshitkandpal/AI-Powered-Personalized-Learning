// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDglzCpwjuRQmfohrWmgrDAuDlZd0mP0UM",
    authDomain: "hack2crack-7b3ad.firebaseapp.com",
    projectId: "hack2crack-7b3ad",
    storageBucket: "hack2crack-7b3ad.firebasestorage.app",
    messagingSenderId: "456634023452",
    appId: "1:456634023452:web:c52839337b3dff6e7429d9",
    measurementId: "G-TJ2XXF1FT5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

