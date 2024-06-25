import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { ref, update,get,set } from "firebase/database";
import { auth, googleProvider, db } from "../firebase";
import { useAuth } from "../Contexts/AuthContext";

const SignIn = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const updateUserPresence = (uid, isOnline) => {
    const userStatusRef = ref(db, `/status/${uid}`);
    update(userStatusRef, {
      online: isOnline,
      last_changed: Date.now(),
    });
  };

  // const handleGoogleSignIn = async () => {
  //   try {
  //     const res = await signInWithPopup(auth, googleProvider);
  //     if (res.user) {
  //       updateUserPresence(res.user.uid, true);
  //       navigate("/chat");
  //       setIsLoggedIn(true);
  //     } else {
  //       setError(res.error);
  //     }
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // };

  const handleGoogleSignIn = async () => {
    
  
    try {
      const res = await signInWithPopup(auth, googleProvider);
  
      if (res.user) {
        // Check if the user already exists in the database
        const userRef = ref(db, `users/${res.user.uid}`);
        const snapshot = await get(userRef);
  
        if (!snapshot.exists()) {
          // User does not exist in the database, save their entry
          await set(userRef, {
            uid: res.user.uid,
            displayName: res.user.displayName,
            email: res.user.email,
            photoURL: res.user.photoURL,
            // Add any other relevant user data you want to save
          });
        }
  
        // Update user presence
        updateUserPresence(res.user.uid, true);
  
        // Navigate to chat page or any other destination
        navigate("/chat");
  
        // Set logged-in state if necessary
        setIsLoggedIn(true);
      } else {
        // Handle error if user is not returned
        setError(res.error);
      }
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  const handleSignInWithEmail = async (e) => {
    e.preventDefault();
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      if (res.user) {
        updateUserPresence(res.user.uid, true);
        navigate("/chat");
        setIsLoggedIn(true);
      } else {
        setError(res.error);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-center">Sign In</h2>
        <form onSubmit={handleSignInWithEmail} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
          >
            Sign In with Email
          </button>
        </form>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="mt-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center"
          >
            Sign In with Google
          </button>
        </div>
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
