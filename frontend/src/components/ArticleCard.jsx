import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import './styles/ArticleCard.css';

const ArticleCard = ({ article, onClick, onRemove, onUpdatePosition }) => {
  const cardRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: article.position?.x || 0, y: article.position?.y || 0 });
  const [dragStart, setDragStart] = useState(null);

  const handleStart = (e, data) => {
    setDragStart({ x: data.x, y: data.y });
    setIsDragging(false);
  };

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleStop = (e, data) => {
    const vx = data.lastX - data.x;
    const vy = data.lastY - data.y;
    const friction = 0.95; // Adjust this value for more or less friction

    const move = () => {
      const currentX = parseFloat(cardRef.current.style.left || 0);
      const currentY = parseFloat(cardRef.current.style.top || 0);

      const newVx = vx * friction;
      const newVy = vy * friction;

      const newX = currentX + newVx;
      const newY = currentY + newVy;

      cardRef.current.style.left = `${newX}px`;
      cardRef.current.style.top = `${newY}px`;

      setPosition({ x: newX, y: newY });

      // Check if the card is out of bounds
      const cardWidth = cardRef.current.offsetWidth;
      const cardHeight = cardRef.current.offsetHeight;
      const outOfBounds = (
        newX < -cardWidth / 2 ||
        newX > window.innerWidth - cardWidth / 2 ||
        newY < -cardHeight / 2 ||
        newY > window.innerHeight - cardHeight / 2
      );

      if (outOfBounds) {
        onRemove(article.url);
      } else if (Math.abs(newVx) > 0.1 || Math.abs(newVy) > 0.1) {
        requestAnimationFrame(move);
      } else {
        onUpdatePosition(article.url, { x: newX, y: newY });
        setIsDragging(false);
      }
    };

    move();

    if (dragStart) {
      const dx = Math.abs(dragStart.x - data.x);
      const dy = Math.abs(dragStart.y - data.y);
      if (dx < 5 && dy < 5) {
        onClick();
      } else {
        setIsDragging(true);
      }
    }
  };

  return (
    <Draggable
      nodeRef={cardRef}
      onStart={handleStart}
      onDrag={handleDrag}
      onStop={handleStop}
      position={position}
    >
      <div
        className="card"
        ref={cardRef}
        style={{ top: `${position.y}px`, left: `${position.x}px` }}
      >
        <h3>{article.title}</h3>
        <p>{article.content}</p>
      </div>
    </Draggable>
  );
};

export default ArticleCard;
