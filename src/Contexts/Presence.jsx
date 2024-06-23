// presence.js

import { db } from '..firebase';
import { ref, onDisconnect, set } from 'firebase/database';

const setUserOnlineStatus = (uid) => {
    const userStatusRef = ref(db, `/status/${uid}`);
    
    // Set online status to true when user connects
    set(userStatusRef, { online: true }).then(() => {
        // Set offline status when user disconnects
        onDisconnect(userStatusRef).set({ online: false });
    }).catch((error) => {
        console.error('Error setting user status:', error);
    });
};

export { setUserOnlineStatus };
