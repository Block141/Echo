import React from 'react';
import './styles/FullScreenArticle.css';

const FullScreenArticle = ({ article, onDismiss }) => {
  return (
    <div className="fullscreen-article">
      <button className="close-button" onClick={onDismiss}>Close</button>
      <h1>{article.title}</h1>
      <iframe 
        src={article.url} 
        title={article.title} 
        width="100%" 
        height="80%" 
        style={{ border: 'none' }}
      />
    </div>
  );
};

export default FullScreenArticle;
