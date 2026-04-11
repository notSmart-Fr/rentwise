import { useState, useEffect, useRef } from 'react';
import messageService from './messageService';
import { useAuth } from '../auth/AuthContext';
import './ChatBox.css';

const ChatBox = ({ contextType, contextId, receiverId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const data = await messageService.getMessages(contextType, contextId, receiverId);
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Auto-polling every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [contextType, contextId, receiverId]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Optimistic update
    const optimisticMsg = {
      id: Date.now().toString(),
      sender_id: user.id,
      content: newMessage,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setNewMessage('');

    try {
      await messageService.sendMessage(contextType, contextId, optimisticMsg.content, receiverId);
      fetchMessages(); // refresh to get actual db record
    } catch (error) {
      console.error("Failed to send message:", error);
      // Ideally remove optimistic update on failure, but keeping simple for MVP
    }
  };

  if (loading) {
    return <div className="chatbox-container loading">Loading chat...</div>;
  }

  return (
    <div className="chatbox-container">
      <div className="chatbox-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender_id && user?.id && String(msg.sender_id).replace(/-/g, '').toLowerCase() === String(user.id).replace(/-/g, '').toLowerCase();
            const showSender = !isMe && (index === 0 || messages[index-1].sender_id !== msg.sender_id);
            
            return (
              <div key={msg.id} className={`chat-message ${isMe ? 'message-sent' : 'message-received'}`}>
                {showSender && <span className="message-sender">Other Participant</span>}
                <div className="message-content">{msg.content}</div>
                <div className="message-time">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="chatbox-input-area" onSubmit={handleSend}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button type="submit" className="btn btn-primary" disabled={!newMessage.trim()}>Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
