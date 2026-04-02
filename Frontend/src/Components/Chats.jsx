import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './Chats.css';

const Chats = ({ user, onLogout }) => {
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);

  useEffect(() => {
    // Load chats from localStorage on component mount
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (err) {
      console.log('Logout error:', err);
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('chats');
    onLogout && onLogout();
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newChat = {
        id: Date.now(),
        sender: user?.username || 'You',
        message,
        timestamp: new Date().toLocaleTimeString(),
      };
      const updatedChats = [...chats, newChat];
      setChats(updatedChats);
      localStorage.setItem('chats', JSON.stringify(updatedChats));
      setMessage('');
    }
  };

  return (
    <div className="chats-container">
      <div className="chats-header">
        <h1>Chat Application</h1>
        <div className="chats-user-info">
          <span>Welcome, {user?.username}!</span>
          <button onClick={handleLogout} className="chats-logout-button">
            Logout
          </button>
        </div>
      </div>

      <div className="chats-messages-container">
        {chats.length === 0 ? (
          <p className="chats-empty-state">No messages yet. Start chatting!</p>
        ) : (
          chats.map((chat) => (
            <div key={chat.id} className="chats-message sent">
              <div className="chats-message-sender">{chat.sender}</div>
              <div className="chats-message-text">{chat.message}</div>
              <div className="chats-message-timestamp">{chat.timestamp}</div>
            </div>
          ))
        )}
      </div>

      <div className="chats-input-container">
        <form onSubmit={handleSendMessage} className="chats-input-form">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="chats-input"
          />
          <button type="submit" className="chats-send-button">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chats;
