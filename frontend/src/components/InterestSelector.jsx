// src/components/InterestSelector.jsx
import React, { useState } from 'react';
import axios from 'axios';

const InterestSelector = () => {
  const [interests, setInterests] = useState([]);
  const [currentInterestIndex, setCurrentInterestIndex] = useState(0);
  const availableInterests = ['Politics', 'Technology', 'Automotive']; // Example interests

  const handleSwipe = (direction) => {
    if (direction === 'right') {
      setInterests([...interests, availableInterests[currentInterestIndex]]);
    }
    setCurrentInterestIndex(currentInterestIndex + 1);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/save-interests/`, { interests });
      console.log(response.data);
    } catch (error) {
      console.error('Error saving interests:', error);
    }
  };

  return (
    <div>
      {currentInterestIndex < availableInterests.length ? (
        <div>
          <p>{availableInterests[currentInterestIndex]}</p>
          <button onClick={() => handleSwipe('left')}>Swipe Left</button>
          <button onClick={() => handleSwipe('right')}>Swipe Right</button>
        </div>
      ) : (
        <div>
          <p>You have selected your interests.</p>
          <button onClick={handleSubmit}>Save Interests</button>
        </div>
      )}
    </div>
  );
};

export default InterestSelector;
