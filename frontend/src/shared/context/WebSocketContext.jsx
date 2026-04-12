import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../features/auth';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const listenersRef = useRef({}); // type -> Set of callbacks

  const connect = () => {
    if (!token) return;

    // Derived WebSocket URL (assuming same host as API)
    const wsUrl = `ws://localhost:8000/ws?token=${token}`;
    
    console.log('Connecting to WebSocket...');
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const { type, data } = message;
        
        console.log('WS Message Received:', type, data);
        
        // Notify all listeners for this message type
        if (listenersRef.current[type]) {
          listenersRef.current[type].forEach(callback => callback(data));
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
      // Attempt reconnect after 5 seconds if still logged in
      if (token) {
        setTimeout(connect, 5000);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket Error:', err);
      ws.close();
    };

    socketRef.current = ws;
  };

  useEffect(() => {
    if (token) {
      connect();
    } else {
      if (socketRef.current) {
        socketRef.current.close();
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [token]);

  const subscribe = (type, callback) => {
    if (!listenersRef.current[type]) {
      listenersRef.current[type] = new Set();
    }
    listenersRef.current[type].add(callback);
    
    // Return unsubscribe function
    return () => {
      listenersRef.current[type].delete(callback);
    };
  };

  const value = {
    isConnected,
    subscribe
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export default WebSocketContext;
