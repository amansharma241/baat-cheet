import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { ref, onValue, off, update } from "firebase/database";
import { useAuth } from "../../Contexts/AuthContext";
import useActiveUsers from "./useActiveUsers";

const useRealtimeMessageStatus = () => {
  const { currentUser } = useAuth();
  const { activeUsers } = useActiveUsers();
  const [messages, setMessages] = useState([]);

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

        // Update statuses based on active users
        messagesList.forEach((message) => {
          if (message.receiver === currentUser.uid && message.status === "sent") {
            if (activeUsers.some((user) => user.uid === message.sender)) {
              update(ref(db, `messages/${message.id}`), { status: "delivered" });
            }
          }
        });

        setMessages(messagesList);
      } else {
        setMessages([]);
      }
    });

    return () => {
      off(messagesRef, listener);
    };
  }, [currentUser, activeUsers]);

  return messages;
};

export default useRealtimeMessageStatus;
