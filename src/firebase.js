import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { getDatabase, ref, set, onDisconnect, serverTimestamp } from 'firebase/database';


const firebase = {
  apiKey: "AIzaSyChcN6pEqi_LI_ZE4-_iejFLAHQftqVAVc",
  authDomain: "fir-chat-app-f8276.firebaseapp.com",
  projectId: "fir-chat-app-f8276",
  storageBucket: "fir-chat-app-f8276.appspot.com",
  messagingSenderId: "949520734683",
  appId: "1:949520734683:web:d7095eb496c80a100d6ffe",
  databaseURL: "https://fir-chat-app-f8276-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebase);
export const googleProvider = new GoogleAuthProvider();
export const auth = getAuth(app);
 const db = getDatabase(app);

export { db, ref, set, onDisconnect, serverTimestamp };