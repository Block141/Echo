// src/components/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api'; // Import the login function
import './styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const data = await login(username, password);
      console.log(data);
      setSuccess('Login successful!');
      
      // Navigate based on initial setup status
      if (data.initial_setup_complete) {
        navigate('/dashboard');
      } else {
        navigate('/interests'); // Redirect to InterestSelector
      }
    } catch (err) {
      console.error("Error response from server:", err.response);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <h2>NewsFling</h2>
      <h3>Login</h3>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete='current-password'
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p className="signup-link">
        Don't have an account? <Link to="/signup">Create Account</Link>
      </p>
    </div>
  );
};

export default Login;
