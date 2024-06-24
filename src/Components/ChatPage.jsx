import { useState } from "react";
import { useChat } from "../Contexts/ChatContext";
import useActiveUsers from "./Utils/useActiveUsers";
import { useAuth } from "../Contexts/AuthContext";

const ChatComponent = () => {
  const { messages, users, selectedUser, setSelectedUser, handleSendMessage } = useChat();
  const {currentUser} = useAuth()

  const [newMessage, setNewMessage] = useState("");
  const { activeUsers, inactiveUsers } = useActiveUsers();

  const handleUserClick = (user) => {
    setSelectedUser(user); // Set selected user
  };

  return (
    <div className="flex h-screen">
      {/* User List */}
      <div className="w-1/4 bg-gray-200 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Users</h2>
        {/* Active Users */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Active Users</h3>
          {activeUsers?.filter(user => user?.uid !== currentUser?.uid)?.map((user) => (
              <div
                key={user.id}
                className={`flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded mb-2 ${
                  selectedUser && selectedUser.id === user.id
                    ? "bg-gray-300"
                    : ""
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
          {inactiveUsers.filter(user => user.uid !== currentUser.uid).map((user) => (
              <div
                key={user.id}
                className={`flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded mb-2 ${
                  selectedUser && selectedUser.id === user.id
                    ? "bg-gray-300"
                    : ""
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
            messages
              .filter(
                (message) =>
                  message.sender === selectedUser.id ||
                  message.receiver === selectedUser.id
              )
              .map((message) => (
                <div
                  key={message.id}
                  className={`flex items-${
                    message.sender === selectedUser.id ? "end" : "start"
                  } mb-2`}
                >
                  <div
                    className={`bg-${
                      message.sender === selectedUser.id ? "blue" : "gray"
                    }-300 p-2 rounded`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs text-gray-600">
                      {new Date(message.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-center text-gray-500">
              Select a user to start chatting
            </p>
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
              onClick={() => {
                handleSendMessage(newMessage);
                setNewMessage("");
              }}
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