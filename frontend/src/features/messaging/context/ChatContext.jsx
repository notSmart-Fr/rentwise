import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [chat, setChat] = useState(null); // { contextType, contextId, title, subtitle }

  const openChat = (contextType, contextId, title, subtitle = null, receiverId = null) => {
    setChat({ contextType, contextId, title, subtitle, receiverId });
  };

  const closeChat = () => setChat(null);

  return (
    <ChatContext.Provider value={{ chat, openChat, closeChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
