import React, { useState } from 'react';
import './ChatApp.css';

const Chatapp = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedUser, setSelectedUser] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, user: 'me', text: 'Hey! How are you?', time: '10:30 AM' },
    { id: 2, user: 'other', text: 'I\'m doing great! How about you?', time: '10:31 AM' },
    { id: 3, user: 'me', text: 'All good, just working on some projects', time: '10:32 AM' },
    { id: 4, user: 'other', text: 'That\'s awesome! Let me know if you need any help', time: '10:33 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Mock user data
  const users = [
    { id: 1, name: 'Raj Kumar', lastChat: '28/10/2024', online: true, avatar: '🧑' },
    { id: 2, name: 'Priya Singh', lastChat: '27/10/2024', online: false, avatar: '👩‍💼' },
    { id: 3, name: 'Amit Patel', lastChat: '26/10/2024', online: true, avatar: '🧑' },
    { id: 4, name: 'Neha Sharma', lastChat: '25/10/2024', online: true, avatar: '👩‍💻' },
    { id: 5, name: 'Vikram Singh', lastChat: '24/10/2024', online: false, avatar: '🧑' },
  ];

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        user: 'me',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`chat-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Header with theme toggle */}
      <header className="chat-header">
        <h1 className="app-title">Flash Chat</h1>
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      <div className="chat-wrapper">
        {/* Sidebar - User List */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>Flash Chat</h2>
          </div>

          {/* Search Users */}
          <div className="search-box">
            <input
              type="text"
              placeholder="Search users"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* User List */}
          <div className="user-list">
            {filteredUsers.map((user, index) => (
              <div
                key={user.id}
                className={`user-item ${selectedUser === index ? 'active' : ''}`}
                onClick={() => setSelectedUser(index)}
              >
                <div className="user-avatar">
                  <span className="avatar-emoji">{user.avatar}</span>
                  <span className={`online-indicator ${user.online ? 'online' : 'offline'}`}></span>
                </div>
                <div className="user-info">
                  <p className="user-name">{user.name}</p>
                  <p className="last-chat">Last chatdate</p>
                  <p className="status-text">
                    {user.online ? '🟢 online' : '⚪ offline'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="chat-main">
          {/* Chat Header */}
          <div className="chat-header-bar">
            <div className="selected-user-info">
            <div className="info-user-img">
              <span className="avatar-emoji">{filteredUsers[selectedUser]?.avatar}</span>
              <h3>{filteredUsers[selectedUser]?.name || 'Select a user'}</h3>
            </div>
              <p className="user-status">
                {filteredUsers[selectedUser]?.online ? '🟢 Online' : '⚪ Offline'}
              </p>
            </div>
            <button className="more-options"
            
              title="More options"

            >⋮</button>
          </div>

          {/* Messages Area */}
          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={msg.id} className={`message ${msg.user}`} style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="message-bubble">
                  <p className="message-text">{msg.text}</p>
                  <span className="message-time">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Area */}
          <div className="message-input-wrapper">
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter messages..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="message-input"
              />
              <button className="send-btn" onClick={handleSendMessage} title="Send message">
                Send
              </button>
              <button className="voice-btn" title="Voice to text" >
                🎤
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chatapp;