import { useEffect } from 'react';
import { ref, set, onDisconnect,db, serverTimestamp } from '../../firebase'; // Adjust path as needed

const usePresence = (user) => {
 
  useEffect(() => {
    if (!user) return;

    const userStatusRef = ref(db, `/status/${user.uid}`);
    const isOffline = {
      online: false,
      last_changed: serverTimestamp(),
    };

    const isOnline = {
      online: true,
      last_changed: serverTimestamp(),
    };

    onDisconnect(userStatusRef).set(isOffline).then(() => {
      set(userStatusRef, isOnline);
    });

    return () => {
      set(userStatusRef, isOffline); // Ensure user is marked offline on component unmount
    };
  }, [user, ref, set, onDisconnect, serverTimestamp]);

  return null; // Or any other value you need
};

export default usePresence;
