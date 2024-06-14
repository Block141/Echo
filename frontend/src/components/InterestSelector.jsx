// src/components/InterestSelector.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import axios from 'axios';
import getCsrfToken from '../csrf'; // Function to get the CSRF token from cookies
import './styles/InterestSelector.css';

const InterestSelector = () => {
  const navigate = useNavigate();
  const [interests, setInterests] = useState([]);
  const [currentInterestIndex, setCurrentInterestIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [animate, setAnimate] = useState(true);
  const [completed, setCompleted] = useState(false);
  const availableInterests = [
    'Politics', 'Technology', 'Automotive', 'Sports', 'Health', 'Travel',
    'Science', 'Entertainment', 'Fashion', 'Finance', 'Food', 'Gaming', 
    'History', 'Music', 'Nature', 'Photography', 'Space', 'Startup', 'World News'
  ];

  const SWIPE_RESET_DELAY = 500; 

  const handleSwipe = (direction) => {
    setSwipeDirection(direction);
    setAnimate(false); // Disable animation
    setTimeout(async () => {
      if (direction === 'right') {
        setInterests([...interests, availableInterests[currentInterestIndex]]);
      }
      const nextIndex = currentInterestIndex + 1;
      if (nextIndex < availableInterests.length) {
        setCurrentInterestIndex(nextIndex);
      } else {
        await handleSubmit();
        setCompleted(true);
      }
      setSwipeDirection(null);
      setPosition({ x: 0, y: 0 });
      setOffset({ x: 0, y: 0 });
      setAnimate(true); // Re-enable animation
    }, SWIPE_RESET_DELAY); // Delay to match the animation duration
  };

  const handleDragStart = (e) => {
    setDragging(true);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleDrag = (e) => {
    if (dragging) {
      const x = e.clientX - offset.x;
      const y = e.clientY - offset.y;
      setPosition({ x, y });
    }
  };

  const handleDragEnd = (e) => {
    setDragging(false);
    const threshold = window.innerWidth / 4;
    if (position.x > threshold) {
      handleSwipe('right');
    } else if (position.x < -threshold) {
      handleSwipe('left');
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleSubmit = async () => {
    try {
      const csrfToken = getCsrfToken(); // Get the CSRF token
      const token = localStorage.getItem('accessToken'); // Get the JWT token from localStorage
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/save-interests/`, 
      { 
        interests 
      }, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-CSRFToken': csrfToken
        },
        withCredentials: true // Include credentials to send cookies
      });
      console.log(response.data);
      if (response.data.success) {
        setCompleted(true); // Mark as completed if the response is successful
      }
    } catch (error) {
      console.error(error);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  if (completed) {
    return (
      <div className="completion-message">
        <h1>✅</h1>
        <h2>Thanks, choosing your interests helps us make a more tailored news dashboard.</h2>
        <button onClick={() => navigate('/dashboard')}>Go to My Dashboard</button>
      </div>
    );
  }

  return (
    <div
      className={`interest-selector-container ${swipeDirection === 'left' ? 'bg-red' : swipeDirection === 'right' ? 'bg-green' : ''}`}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      <div className={`background-half left-half ${swipeDirection === 'right' ? 'hidden' : ''}`}>
        <div className="label-left">Hate It</div>
      </div>
      <div className={`background-half right-half ${swipeDirection === 'left' ? 'hidden' : ''}`}>
        <div className="label-right">Love It</div>
      </div>
      {availableInterests[currentInterestIndex] && (
        <div
          {...swipeHandlers}
          key={currentInterestIndex}
          className={`interest-card ${animate ? '' : 'no-animation'} ${swipeDirection === 'left' ? 'swipe-left' : ''} ${swipeDirection === 'right' ? 'swipe-right' : ''}`}
          style={{ transform: `translate(${position.x}px, ${position.y}px)`, cursor: dragging ? 'grabbing' : 'grab' }}
          onMouseDown={handleDragStart}
        >
          <h3>{availableInterests[currentInterestIndex]}</h3>
        </div>
      )}
      {currentInterestIndex >= availableInterests.length && (
        <button onClick={handleSubmit}>Save Interests</button>
      )}
    </div>
  );
};

export default InterestSelector;
