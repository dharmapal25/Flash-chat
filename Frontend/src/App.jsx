import React, { useState, useEffect } from 'react';
import Register from './Components/Register';
import Login from './Components/Login';
import Chats from './Components/Chats';
import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');

    if (savedUser && accessToken) {
      setUser(JSON.parse(savedUser));
      setCurrentPage('chats');
    }
  }, []);

  const handleAuthSuccess = (page, userData = null) => {
    if (userData) {
      setUser(userData);
    }
    setCurrentPage(page);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    setUser(null);
    setCurrentPage('login');
  };

  return (
    <div className="app-container">
      {currentPage === 'register' && (
        <Register onSuccess={handleAuthSuccess} />
      )}
      {currentPage === 'login' && (
        <Login onSuccess={handleAuthSuccess} />
      )}
      {currentPage === 'chats' && user && (
        <Chats user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;