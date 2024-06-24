import { useEffect, useState } from 'react';
import { ref, onValue, off, onDisconnect, update } from 'firebase/database';
import { db } from '../../firebase';
import { useAuth } from '../../Contexts/AuthContext';

const useActiveUsers = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const usersRef = ref(db, 'users');
    const statusRef = ref(db, 'status');

    const handleUserStatus = (snapshot) => {
      const usersData = snapshot.val();
      const allUsers = Object.keys(usersData).map(key => ({
        uid: key,
        ...usersData[key],
      }));

      onValue(statusRef, (statusSnapshot) => {
        const statusData = statusSnapshot.val();
        const active = [];
        const inactive = [];

        allUsers.forEach(user => {
          if (statusData[user.uid] && statusData[user.uid].online) {
            active.push(user);
          } else {
            inactive.push(user);
          }
        });

        setActiveUsers(active);
        setInactiveUsers(inactive);
      });
    };

    onValue(usersRef, handleUserStatus);

    // Set up the disconnect handler for the current user
    if (currentUser) {
      const currentUserStatusRef = ref(db, `status/${currentUser.uid}`);
      onDisconnect(currentUserStatusRef).update({ online: false });
    }

    return () => {
      off(usersRef, handleUserStatus);
      off(statusRef);
    };
  }, [activeUsers,inactiveUsers]);

  return { activeUsers, inactiveUsers };
};

export default useActiveUsers;
