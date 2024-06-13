// src/components/Welcome.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/interests');
  };

  return (
    <div className="welcome-container">
      <h2>Welcome to Echo News!</h2>
      <p>We’re glad to have you here. Let’s get started by selecting your interests.</p>
      <button onClick={handleContinue}>Continue</button>
    </div>
  );
};

export default Welcome;
