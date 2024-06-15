import React, { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import FullScreenArticle from './FullScreenArticle';
import TopMenu from './TopMenu';
import { fetchArticles } from '../api'; 
import './styles/Dashboard.css';

const Dashboard = () => {
  const [articles, setArticles] = useState([]);
  const [fullscreenArticle, setFullscreenArticle] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true); 
      try {
        const fetchedArticles = await fetchArticles();
        if (fetchedArticles.error && fetchedArticles.code === 'rateLimited') {
          setErrorMessage('API rate limit exceeded. Please try again later.');
          setLoading(false); 
          return;
        }

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const cardWidth = 1000; 
        const cardHeight = 700; 

        setArticles(fetchedArticles.map(article => {
          const offsetX = (Math.random() - 0.5) * 200; 
          const offsetY = (Math.random() - 0.5) * 200; 

          return {
            ...article,
            position: {
              x: centerX - (cardWidth / 2) + offsetX,
              y: centerY - (cardHeight / 2) + offsetY
            }
          };
        }));
        setLoading(false);
      } catch (error) {
        console.error('Failed to load articles:', error);
        setErrorMessage('Failed to load articles. Please try again later.');
        setLoading(false); 
      }
    };

    loadArticles();
  }, []); 
  const handleCardClick = (article) => {
    setFullscreenArticle(article);
  };

  const handleDismiss = () => {
    setFullscreenArticle(null);
  };

  const handleUpdatePosition = (id, position) => {
    setArticles(prevArticles =>
      prevArticles.map(article =>
        article.url === id ? { ...article, position } : article
      )
    );
  };

  const handleRemoveArticle = (id) => {
    setArticles(prevArticles => prevArticles.filter(article => article.url !== id));
  };

  useEffect(() => {
    console.log('Current articles:', articles.length); 
  }, [articles]); 

  return (
    <div className="dashboard">
      <TopMenu  />
      {loading ? (
        <div className="loading-message">Loading articles...</div>
      ) : errorMessage ? (
        <div className="error-message">{errorMessage}</div>
      ) : articles.length === 0 ? (
        <div className="caught-up-message">You're all caught up! 📰</div>
      ) : (
        articles.map(article => (
          <ArticleCard
            key={article.url}
            article={article}
            onClick={() => handleCardClick(article)}
            onRemove={() => handleRemoveArticle(article.url)}
            onUpdatePosition={(position) => handleUpdatePosition(article.url, position)}
            style={{ top: `${article.position.y}px`, left: `${article.position.x}px` }}
          />
        ))
      )}
      {fullscreenArticle && (
        <FullScreenArticle article={fullscreenArticle} onDismiss={handleDismiss} />
      )}
    </div>
  );
};

export default Dashboard;
