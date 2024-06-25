// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useAuth } from "./AuthContext";
// import { db } from "../firebase";
// import { ref, onValue, push, set,off, onDisconnect, update } from "firebase/database";
// import useMessageStatus from "../Components/Utils/useMessageStatus";
// import useRealtimeMessageStatus from "../Components/Utils/useRealTimeStatus";

// const ChatContext = createContext();

// export const useChat = () => {
//   return useContext(ChatContext);
// };

// const ChatProvider = ({ children }) => {
//   const { currentUser } = useAuth();
//   const [messages, setMessages] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null); // Track selected user

//   const realtimeMessages = useRealtimeMessageStatus();

//   useEffect(() => {
//     // Fetch messages from Firebase
//     const messagesRef = ref(db, "messages");
//     onValue(messagesRef, (snapshot) => {
//       const messagesData = snapshot.val();
//       if (messagesData) {
//         const messagesList = Object.keys(messagesData).map((key) => ({
//           id: key,
//           ...messagesData[key],
//         }));
//         setMessages(messagesList);
//       } else {
//         setMessages([]);
//       }
//     });

//   }, [currentUser]);


//   const handleSendMessage = (newMessage,setNewMessage) => {
//     if (newMessage.trim() === "" || !selectedUser) return;

//     const message = {
//       sender: currentUser.uid,
//       receiver: selectedUser.uid,
//       text: newMessage,
//       timestamp: Date.now(),
//       status: 'sent',
//       read: false,
//     };

//     // Fetch the recipient's status directly from Firebase
//     const recipientStatusRef = ref(db, `/status/${selectedUser.uid}`);
//     onValue(recipientStatusRef, (snapshot) => {
//       const recipientStatus = snapshot.val() || { online: false };
//       console.log(recipientStatus)
//       if (recipientStatus.online) {
//         message.status = 'delivered';
//       }
//       // console.log("message-status--",message.status)
//       const messagesRef = ref(db, "messages");
//       push(messagesRef, message)
//       .then(() => {
//         setNewMessage(""); // Clear input field after sending message
//       })
//       .catch((error) => {
//         console.error("Error sending message:", error);
//       });
//     });
//   };

//   useEffect(() => {
//     const messagesRef = ref(db, 'messages');
//     const handleUpdateStatus = (snapshot) => {
//       const messagesData = snapshot.val();
//       if (messagesData) {
//         Object.keys(messagesData).forEach((key) => {
//           const message = messagesData[key];
//           if (message.receiver === currentUser.uid && !message.read) {
//             updateMessageStatus(message.id, 'delivered', false);
//           }
//         });
//       }
//     };

//     onValue(messagesRef, handleUpdateStatus);

//     return () => off(messagesRef, handleUpdateStatus);
//   }, [currentUser]);

//   const updateMessageStatus = (messageId, status, read) => {
//     const messageRef = ref(db, `messages/${messageId}`);
//     update(messageRef, { status, read })
//       .then(() => console.log(`Message ${messageId} updated to ${status}`))
//       .catch((error) => console.error('Error updating message status:', error));
//   };

//   // useMessageStatus(currentUser, selectedUser, realtimeMessages);

//   const values = {
//     messages: realtimeMessages,
//     users,
//     selectedUser,
//     setSelectedUser,
//     handleSendMessage,
//   };

//   return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
// };

// export default ChatProvider;

// ------------------------------------------------

// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useAuth } from "./AuthContext";
// import { db } from "../firebase";
// import { ref, onValue, update, off, push } from "firebase/database";
// import useRealtimeMessageStatus from "../Components/Utils/useRealTimeStatus";
// import useActiveUsers from "../Components/Utils/useActiveUsers";

// const ChatContext = createContext();

// export const useChat = () => {
//   return useContext(ChatContext);
// };

// const ChatProvider = ({ children }) => {
//   const { currentUser } = useAuth();
//   const [messages, setMessages] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const { activeUsers, inactiveUsers } = useActiveUsers();
//   const realtimeMessages = useRealtimeMessageStatus();

//   useEffect(() => {
//     if (!currentUser) return;

//     const messagesRef = ref(db, "messages");
//     onValue(messagesRef, (snapshot) => {
//       const messagesData = snapshot.val();
//       if (messagesData) {
//         const messagesList = Object.keys(messagesData).map((key) => ({
//           id: key,
//           ...messagesData[key],
//         }));
//         setMessages(messagesList);
//       } else {
//         setMessages([]);
//       }
//     });

//     return () => off(messagesRef);
//   }, [currentUser]);

//   const handleSendMessage = (newMessage, setNewMessage) => {
//     if (!currentUser || newMessage.trim() === "" || !selectedUser) return;
//     console.log("active users" , activeUsers);
//     const message = {
//       sender: currentUser.uid,
//       receiver: selectedUser.uid,
//       text: newMessage,
//       timestamp: Date.now(),
//       status: "sent",
//       read: false,
//     };

//     const isRecipientActive = activeUsers.some((user) => user.id === selectedUser.uid);
//     console.log("isRecipientActive---",isRecipientActive);

//     if (isRecipientActive) {
//       message.status = "delivered";
//     }

//     const messagesRef = ref(db, "messages");
//     push(messagesRef, message)
//       .then(() => {
//         setNewMessage("");
//       })
//       .catch((error) => {
//         console.error("Error sending message:", error);
//       });
//   };

//   useEffect(() => {
//     if (!currentUser) return;

//     activeUsers.forEach((activeUser) => {
//       const recipientMessages = messages.filter(
//         (msg) =>
//           msg.receiver === activeUser.uid &&
//           msg.sender === currentUser.id &&
//           msg.status !== "read" &&
//           msg.status !== "delivered"
//       );

//       recipientMessages.forEach((msg) => {
//         const messageRef = ref(db, `messages/${msg.id}`);
//         update(messageRef, { status: "delivered", read: false }).catch((error) =>
//           console.error("Error updating message status:", error)
//         );
//       });
//     });
//   }, [activeUsers, currentUser, messages]);

//   const updateMessageStatus = (messageId, status, read) => {
//     const messageRef = ref(db, `messages/${messageId}`);
//     update(messageRef, { status, read })
//       .then(() => console.log(`Message ${messageId} updated to ${status}`))
//       .catch((error) => console.error('Error updating message status:', error));
//   };

//   const values = {
//     messages: realtimeMessages,
//     selectedUser,
//     setSelectedUser,
//     handleSendMessage,
//   };

//   return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
// };

// export default ChatProvider;


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
    onValue(messagesRef, (snapshot) => {
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

    return () => off(messagesRef);
  }, [currentUser, activeUsers]);

  const values = {
    messages,
    selectedUser,
    setSelectedUser,
    handleSendMessage,
  };

  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
