import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { ref, onValue, update,off } from "firebase/database";
import { useAuth } from "../../Contexts/AuthContext";
import useActiveUsers from "./useActiveUsers";

const useRealtimeMessageStatus = () => {
  const { currentUser } = useAuth();
  const { activeUsers, inactiveUsers } = useActiveUsers();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const messagesRef = ref(db, "messages");
    onValue(messagesRef, (snapshot) => {
      const messagesData = snapshot.val();
      if (messagesData) {
        const messagesList = Object.keys(messagesData).map((key) => ({
          id: key,
          ...messagesData[key],
        }));
        setMessages(messagesList);

        // Update statuses based on active users
        messagesList.forEach((message) => {
          if (message.receiver === currentUser.uid && message.status === "sent") {
            if (activeUsers.some((user) => user.uid === message.sender)) {
              update(ref(db, `messages/${message.id}`), { status: "delivered" });
            }
          }
          if (message.receiver === currentUser.uid && message.status === "delivered") {
            // Assuming the message is read when delivered for simplicity
            update(ref(db, `messages/${message.id}`), { status: "read", read: true });
          }
        });
      } else {
        setMessages([]);
      }
    });

    return () => off(messagesRef);
  }, [currentUser, activeUsers]);

  return messages;
};

export default useRealtimeMessageStatus;
