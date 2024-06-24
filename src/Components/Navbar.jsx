import React from "react";
import { useAuth } from "../Contexts/AuthContext"; // Assuming you have an AuthContext for managing authentication
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { currentUser, logout, isLoggedIn } = useAuth(); // Assuming you have a custom hook or context for authentication

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // Logout function from your authentication context
      setIsLoggedIn(false);
      navigate("/signin"); // Redirect to sign-in page after logout
    } catch (error) {
      console.error("Failed to log out:", error.message);
    }
  };

  console.log("isloggedin", isLoggedIn);

  if (!isLoggedIn) return <></>;

  return (
    <nav className="flex justify-between items-center bg-gray-800 text-white p-4">
      <div>
        <span className="font-bold text-lg">
          {currentUser && currentUser.email}
        </span>
        {/* <span className="ml-2 text-sm">{currentUser && currentUser.displayName}</span> */}
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;