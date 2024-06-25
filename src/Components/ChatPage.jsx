import React, { useState, useEffect } from "react";
import { useChat } from "../Contexts/ChatContext";
import useActiveUsers from "./Utils/useActiveUsers";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ref, onValue, update, off } from "firebase/database";
import { db } from '../firebase';

const ChatComponent = () => {
  const { messages, selectedUser, setSelectedUser, handleSendMessage,markMessageAsRead } = useChat();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const { activeUsers, inactiveUsers } = useActiveUsers();

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin");
    } catch (error) {
      console.error("Failed to log out:", error.message);
    }
  };

  const handleMessageSend = () => {
    if (newMessage.trim() !== "") {
      handleSendMessage(newMessage, setNewMessage); // Pass setNewMessage to clear input
    }
  };



  const renderMessageStatus = (message) => {
    if(message.sender===currentUser.uid){
    return (
      <span className="text-xs text-gray-600">
       
        {message.status === "sent" && <span> <i>✔</i> </span>}
        {message.status === "delivered" && <span> <i>✔✔</i> </span>}
        {message.status === "read" && <span className="colour-blue-500"> <i>✔✔✔</i> </span>}
      </span>
    );
  };
}

  // useEffect(() => {
  //   const messagesRef = ref(db, 'messages');
  //   const handleUpdateStatus = (snapshot) => {
  //     const messagesData = snapshot.val();
  //     if (messagesData) {
  //       Object.keys(messagesData).forEach((key) => {
  //         const message = messagesData[key];
  //         if (message.receiver === currentUser.uid && !message.read) {
  //           updateMessageStatus(message.id, 'delivered', false);
  //         }
  //       });
  //     }
  //   };

  //   onValue(messagesRef, handleUpdateStatus);

  //   return () => off(messagesRef, handleUpdateStatus);
  // }, [currentUser]);

  useEffect(() => {
    if (selectedUser) {
      messages
        .filter(
          (message) =>
            message.receiver === currentUser.uid && 
            message.sender === selectedUser.uid && 
            message.status === "delivered"
        )
        .forEach((message) => {
          markMessageAsRead(message.id);
        });
    }
  }, [selectedUser, messages]);

  // const updateMessageStatus = (messageId, status, read) => {
  //   const messageRef = ref(db, `messages/${messageId}`);
  //   update(messageRef, { status, read })
  //     .then(() => console.log(`Message ${messageId} updated to ${status}`))
  //     .catch((error) => console.error('Error updating message status:', error));
  // };

  return (
    <div className="flex h-screen">
      {/* User List */}
      <div className="w-1/4 bg-gray-200 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <span>{currentUser?.email}</span>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded">
            Logout
          </button>
        </div>
        <h2 className="text-lg font-bold mb-4">Users</h2>
        {/* Active Users */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Active Users</h3>
          {activeUsers &&
            activeUsers
              .filter((user) => user.uid !== currentUser.uid)
              .map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded mb-2 ${
                    selectedUser && selectedUser.id === user.id ? "bg-gray-300" : ""
                  }`}
                  onClick={() => handleUserClick(user)}
                >
                  <span className="w-2 h-2 rounded-full mr-2 bg-green-500"></span>
                  <span>{user.email}</span>
                </div>
              ))}
        </div>
        {/* Inactive Users */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-2">Inactive Users</h3>
          {inactiveUsers &&
            inactiveUsers
              .filter((user) => user.uid !== currentUser.uid)
              .map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded mb-2 ${
                    selectedUser && selectedUser.id === user.id ? "bg-gray-300" : ""
                  }`}
                  onClick={() => handleUserClick(user)}
                >
                  <span className="w-2 h-2 rounded-full mr-2 bg-gray-400"></span>
                  <span>{user.email}</span>
                </div>
              ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Selected User Info */}
        {selectedUser && (
          <div className="bg-gray-100 p-4 mb-4">
            <h2 className="text-lg font-bold">{selectedUser.email}</h2>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex flex-col flex-1 overflow-y-auto p-4">
          {selectedUser ? (
            Object.values(messages)
              .filter(
                (message) =>
                  (message.sender === currentUser.uid && message.receiver === selectedUser.uid) ||
                  (message.sender === selectedUser.uid && message.receiver === currentUser.uid)
              )
              .map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === currentUser.uid ? "justify-end" : "justify-start"
                  } mb-2`}
                >
                  <div
                    className={`${
                      message.sender === currentUser.uid ? "bg-blue-300" : "bg-gray-300"
                    } p-2 rounded`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-sm">{new Date(message.timestamp).toLocaleString()}</p>
                    {renderMessageStatus(message)}
                  </div>
                </div>
              ))
          ) : (
            <p className="text-center text-gray-500">Select a user to start chatting</p>
          )}
        </div>

        {/* Message Input */}
        {selectedUser && (
          <form onSubmit={(e) => e.preventDefault()} className="flex p-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="border rounded p-2 flex-1 mr-2"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              onClick={handleMessageSend}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;

