import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut} from "firebase/auth";
import { ref, update,onDisconnect } from "firebase/database";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
        // Set user status to online
        const userStatusRef = ref(db, `/status/${user.uid}`);
        update(userStatusRef, { online: true });
      } else {
        setCurrentUser(null);
        setIsLoggedIn(false);
      }
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    const userStatusRef = ref(db, `/status/${currentUser.uid}`);
    await update(userStatusRef, { online: false });
    await signOut(auth);
  };

  const value = {
    currentUser,
    isLoggedIn,
    setIsLoggedIn,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
