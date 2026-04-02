import React, { useState } from 'react';
import apiService from '../services/api';
import './Register.css';

const Register = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'Male',
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
      const response = await apiService.register(formData);

      if (!response.message.includes('successfully')) {
        setError(response.message);
        return;
      }

      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: 'Male',
      });

      onSuccess && onSuccess('login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Create Account</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label className="form-label">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter your username"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter password"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Confirm password"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="form-input"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {error && <div className="form-error">{error}</div>}

        <button type="submit" disabled={loading} className="register-button">
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="register-link">
        Already have an account?{' '}
        <button
          onClick={() => onSuccess('login')}
          className="register-link-button"
        >
          Login here
        </button>
      </p>
    </div>
  );
};

export default Register;
