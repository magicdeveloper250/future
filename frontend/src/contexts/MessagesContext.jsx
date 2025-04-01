import { createContext, useState } from "react";

const MessagesContext = createContext(null);

export const MessagesProvider = ({ children }) => {
  const [newMessage, setMessage] = useState([]);
  const setNewMessage = (message) => {
    setMessage((prev) => {
      const isDuplicate = prev.some(msg => 
        JSON.stringify(msg) === JSON.stringify(message)
      );
      return isDuplicate ? prev : [...prev, message];
    });
  };
  const clearMessages = () => {
    setMessage([]);
  };
  return (
    <MessagesContext.Provider value={{ newMessage, setNewMessage, clearMessages }}>
      {children}
    </MessagesContext.Provider>
  );
};

export default MessagesContext;
