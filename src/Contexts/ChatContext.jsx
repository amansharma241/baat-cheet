import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth   } from "./AuthContext";
import { db } from "../firebase";
import { ref, push, update, onValue, off } from "firebase/database";
import useRealTimeStatus from "../Components/Utils/useRealTimeStatus";
import useActiveUsers from "../Components/Utils/useActiveUsers";

const ChatContext = createContext();

export const useChat = () => {
  return useContext(ChatContext);
};

const ChatProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const messages = useRealTimeStatus();
  const { activeUsers } = useActiveUsers();

  const handleSendMessage = (newMessage, setNewMessage) => {
    if (!currentUser || newMessage.trim() === "" || !selectedUser) return;

    const message = {
      sender: currentUser.uid,
      receiver: selectedUser.uid,
      text: newMessage,
      timestamp: Date.now(),
      status: "sent",
      read: false,
    };

    const isRecipientActive = activeUsers.some((user) => user.uid === selectedUser.uid);

    if (isRecipientActive) {
      message.status = "delivered";
    }

    const messagesRef = ref(db, "messages");
    push(messagesRef, message)
      .then(() => {
        setNewMessage("");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  useEffect(() => {
    if (!currentUser) return;

    const messagesRef = ref(db, "messages");
    const listener = onValue(messagesRef, (snapshot) => {
      const messagesData = snapshot.val();
      if (messagesData) {
        const messagesList = Object.keys(messagesData).map((key) => ({
          id: key,
          ...messagesData[key],
        }));

        messagesList.forEach((msg) => {
          if (msg.receiver === currentUser.uid && msg.status === "sent") {
            const senderIsActive = activeUsers.some((user) => user.uid === msg.sender);
            if (senderIsActive) {
              update(ref(db, `messages/${msg.id}`), { status: "delivered" });
            }
          }
        });
      }
    });

    return () => off(messagesRef, listener);
  }, [currentUser, activeUsers]);

  const markMessageAsRead = (messageId) => {
    const messageRef = ref(db, `messages/${messageId}`);
    update(messageRef, { status: "read", read: true })
      .then(() => console.log(`Message ${messageId} marked as read`))
      .catch((error) => console.error('Error marking message as read:', error));
  };

  const values = {
    messages,
    selectedUser,
    setSelectedUser,
    handleSendMessage,
    markMessageAsRead,
  };

  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
};

export default ChatProvider;