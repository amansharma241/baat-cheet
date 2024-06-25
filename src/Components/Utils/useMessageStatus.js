import { useEffect } from "react";
import { ref, update } from "firebase/database";
import { db } from "../../firebase";

const useMessageStatus = (currentUser, selectedUser, messages) => {
  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    const handleMessageRead = (messageId) => {
      const message = messages[messageId];
      if (message && message.receiver === currentUser.uid && !message.read) {
        const messageRef = ref(db, `messages/${messageId}`);
        update(messageRef, { read: true })
          .then(() => {
            console.log("Message marked as read:", messageId);
          })
          .catch((error) => {
            console.error("Error updating message read status:", error);
          });
      }
    };

    Object.keys(messages).forEach((messageId) => {
      handleMessageRead(messageId);
    });
  }, [currentUser, messages]);

  return null; // Custom hook returns nothing to render
};

export default useMessageStatus;
