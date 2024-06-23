// src/components/SignUp.js
import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { ref, set } from 'firebase/database';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log(user);
            // Save user information to the database
            await set(ref(db, 'users/' + user.uid), {
                email: user.email,
                active: true,
                lastActive: Date.now(),
            });

            setSuccess('Sign up successful! You can now log in.');
            navigate('/signin')
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="w-80 p-4 bg-white rounded shadow-md">
                <h2 className="text-2xl mb-4">Sign Up</h2>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full p-2 mb-4 border rounded"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-2 mb-4 border rounded"
                    required
                />
                <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">Sign Up</button>
                {error && <p className="mt-4 text-red-500">{error}</p>}
                {success && <p className="mt-4 text-green-500">{success}</p>}
                <div>
                    <span>
                        Already have an account?
                    </span>
                    <Link to='/signin'>Sign-in</Link>
                </div>
            </form>
        </div>
    );
};

export default SignUp;
