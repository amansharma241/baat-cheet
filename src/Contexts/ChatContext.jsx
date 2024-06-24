import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../firebase";
import { ref, onValue, push, set, onDisconnect } from "firebase/database";

const ChatContext = createContext();

export const useChat = () => {
  return useContext(ChatContext);
};

const ChatProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user

  useEffect(() => {
    // Fetch messages from Firebase
    const messagesRef = ref(db, "messages");
    onValue(messagesRef, (snapshot) => {
      const messagesData = snapshot.val();
      if (messagesData) {
        const messagesList = Object.keys(messagesData).map((key) => ({
          id: key,
          ...messagesData[key],
        }));
        console.log("messages--", messagesList)
        setMessages(messagesList);
      } else {
        setMessages([]);
      }
    });

    // Fetch active/inactive users
    const activeUsersRef = ref(db, "/status");
    onValue(activeUsersRef, (snapshot) => {
      const usersStatus = snapshot.val();
      const updatedUsers = users.map((user) => ({
        ...user,
        status: usersStatus[user.id] || { online: false },
      }));
      // Sort users: active users first, then inactive
      updatedUsers.sort((a, b) => {
        if (a.status.online === b.status.online) return 0;
        if (a.status.online) return -1;
        return 1;
      });
      setUsers(updatedUsers);
    });
  }, []);

  useEffect(() => {
    // Fetch users from Firebase and track presence status
      const usersRef = ref(db, "users");
      onValue(usersRef, (snapshot) => {
        const usersData = snapshot.val();
        console.log(usersData);

        if (usersData) {
          const usersList = Object.keys(usersData)
            .map((key) => ({
              id: key,
              ...usersData[key],
            }))
            .filter((user) => user.id !== currentUser.uid); // Exclude current user
          setUsers(usersList);
        } else {
          setUsers([]);
        }
      });

      // Set user presence in Firebase
      const userStatusRef = ref(db, `/status/${currentUser?.uid}`);
      set(userStatusRef, { online: true })
        .then(() => {
          // Set offline status when user disconnects
          onDisconnect(userStatusRef).set({ online: false });
        })
        .catch((error) => {
          console.error("Error setting user status:", error);
        });

  }, [currentUser]);

  const handleSendMessage = (newMessage, setNewMessage) => {
    if (newMessage.trim() === "" || !selectedUser) return;

    const message = {
      sender: currentUser.uid,
      receiver: selectedUser.uid,
      text: newMessage,
      timestamp: Date.now(),
      status: 'sent', 
      read: false 
    };

    const messagesRef = ref(db, "messages");
    push(messagesRef, message)
      .then(() => {})
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  const values = {
    messages,
    users,
    selectedUser,
    setSelectedUser,
    handleSendMessage,
  };

  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
};

export default ChatProvider;