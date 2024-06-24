// useActiveUsers.js
import { useEffect, useState } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../../firebase';

const useActiveUsers = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);

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

    return () => {
      off(usersRef, handleUserStatus);
      off(statusRef);
    };
  }, []);

  return { activeUsers, inactiveUsers };
};

export default useActiveUsers;
