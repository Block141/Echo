// src/components/Confirmation.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Confirmation.css';

const Confirmation = () => {
  return (
    <div className="confirmation-container">
      <h2>Account Created Successfully!</h2>
      <p>Your account has been created. You can now log in.</p>
      <Link to="/login">Go to Login</Link>
    </div>
  );
};

export default Confirmation;
