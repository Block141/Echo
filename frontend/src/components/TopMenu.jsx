import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ArticleCard from './ArticleCard'; 
import './styles/TopMenu.css';
import getCsrfToken from '../csrf';

const TopMenu = () => {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [cards, setCards] = useState([]);
  const [userCity, setUserCity] = useState('Chicago'); 

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const csrfToken = getCsrfToken(); 
        const token = localStorage.getItem('accessToken'); 
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/profile/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-CSRFToken': csrfToken
          },
          withCredentials: true
        });
        if (response.status === 200) {
          setUserCity(response.data.location);
        } else {
          console.error('Failed to fetch user profile:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); 
    sessionStorage.removeItem('accessToken'); 
    localStorage.removeItem('user'); 
    navigate('/login'); 
  };

  const toggleWeather = async () => {
    const existingWeatherCardIndex = cards.findIndex(card => card.url === 'weather');

    if (!weatherData && !loading && !error) {
      const endpoint = `${process.env.REACT_APP_API_BASE_URL}/api/weather/${userCity}/`;
      try {
        setLoading(true);
        const response = await axios.get(endpoint);
        if (response.status === 200) {
          setWeatherData(response.data);
          if (existingWeatherCardIndex === -1) {
            addWeatherCard(response.data);
          } else {
            updateWeatherCard(response.data, existingWeatherCardIndex);
          }
        } else {
          console.error('Failed to fetch weather data:', response.statusText);
          setError(true);
        }
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    } else if (existingWeatherCardIndex === -1) {
      addWeatherCard(weatherData);
    }
  };

  const addWeatherCard = (data) => {
    const article = {
      title: `Weather in ${data.city}, ${data.country}`,
      content: `Description: ${data.description}\nTemperature: ${data.temperature} °F\nHumidity: ${data.humidity}%\nWind Speed: ${data.wind_speed} mph`,
      url: 'weather', 
      position: { x: 0, y: 0 }
    };
    setCards(prevCards => [...prevCards, { ...article, id: new Date().getTime() }]);
  };

  const updateWeatherCard = (data, index) => {
    const updatedCards = [...cards];
    updatedCards[index] = {
      ...updatedCards[index],
      title: `Weather in ${data.city}, ${data.country}`,
      content: `Description: ${data.description}\nTemperature: ${data.temperature} °F\nHumidity: ${data.humidity}%\nWind Speed: ${data.wind_speed} mph`
    };
    setCards(updatedCards);
  };

  const handleRemoveCard = (url) => {
    setCards(prevCards => prevCards.filter(card => card.url !== url));
  };

  const handleUpdatePosition = (url, position) => {
    setCards(prevCards => prevCards.map(card => (card.url === url ? { ...card, position } : card)));
  };

  return (
    <div className="top-menu">
      <div className="logo">
        <img src="/images/logo.png" alt="Logo" />
        <span>NewsFling</span>
      </div>
      <nav className="nav-links">
        <button className="nav-link" onClick={toggleWeather}>Weather</button>
        <button className="nav-link" onClick={() => navigate('/dashboard')}>Dashboard</button>
      </nav>
      <div className="profile">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      <div className="cards-container">
        {cards.map(card => (
          <ArticleCard
            key={card.id}
            article={card}
            onRemove={handleRemoveCard}
            onUpdatePosition={handleUpdatePosition}
            isWeatherCard={card.url === 'weather'}
          />
        ))}
      </div>
    </div>
  );
};

export default TopMenu;
