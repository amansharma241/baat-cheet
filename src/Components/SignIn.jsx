// src/components/SignIn.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'; // Import Firebase functions for authentication
import { auth, googleProvider } from '../firebase';

const SignIn = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


      const handleGoogleSignIn = async () => {
        try {
          const res = await signInWithPopup(auth, googleProvider);
          console.log("res",res)
          if(res) navigate('/chat');
          else setError(res.error);
        } catch (error) {
          console.error(error.message);
        }
      };

    const handleSignInWithEmail = async (e) => {
        e.preventDefault();
        try {
            const res = await signInWithEmailAndPassword(auth,email, password);
            if(res) navigate('/chat'); 
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
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
                        Sign In with Email
                    </button>
                </form>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div className="mt-4">
                    <button onClick={handleGoogleSignIn} className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center">
                        
                        Sign In with Google
                    </button>
                </div>
                <p className="text-center mt-4">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-500 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
