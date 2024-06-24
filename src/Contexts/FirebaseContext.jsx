import { createContext, useContext } from 'react';
import { db, ref, set, onDisconnect, serverTimestamp } from '../firebase'; // Adjust path as needed

const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => (
  <FirebaseContext.Provider value={{ db, ref, set, onDisconnect, serverTimestamp }}>
    {children}
  </FirebaseContext.Provider>
);
