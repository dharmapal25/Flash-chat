import React, { useState } from 'react';
import apiService from '../services/api';
import './Login.css';

const Login = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiService.login(formData.email, formData.password);

      if (!response.accessToken) {
        setError(response.message || 'Login failed');
        return;
      }

      // Store access token in localStorage
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      setFormData({
        email: '',
        password: '',
      });

      onSuccess && onSuccess('chats', response.user);
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Welcome Back</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-form-group">
          <label className="login-label">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="login-input"
            placeholder="Enter your email"
          />
        </div>

        <div className="login-form-group">
          <label className="login-label">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="login-input"
            placeholder="Enter your password"
          />
        </div>

        {error && <div className="login-error">{error}</div>}

        <button type="submit" disabled={loading} className="login-button">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="login-link">
        Don't have an account?{' '}
        <button
          onClick={() => onSuccess('register')}
          className="login-link-button"
        >
          Register here
        </button>
      </p>
    </div>
  );
};

export default Login;
