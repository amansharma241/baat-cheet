// src/components/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-4 text-center">Welcome to Our Chat App!</h2>
                <div className="flex flex-col space-y-4">
                    <Link to="/signin" className="block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-center">
                        Sign In
                    </Link>
                    <Link to="/signup" className="block bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-center">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
