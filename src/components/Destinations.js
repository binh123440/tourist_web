import React, { useEffect, useRef } from 'react';
import { destinations } from './DestinationsItems.js';
import './DestinationsStyle.css';
import { useNavigate } from 'react-router-dom';

const Destinations = ({ onDestinationSelect }) => {
  const navigate = useNavigate();
  const destinationsRef = useRef(null);

  // Thêm animation khi scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = document.querySelectorAll('.destination-item');
    items.forEach((item) => {
      observer.observe(item);
    });

    return () => {
      items.forEach((item) => {
        observer.unobserve(item);
      });
    };
  }, []);

  const handleDestinationClick = (destination) => {
    if (onDestinationSelect) {
      onDestinationSelect(destination.name);
    } else {
      navigate(`/tour?destination=${destination.name.toLowerCase()}`);
    }
  };

  return (
    <div className="featured-destinations" ref={destinationsRef}>
      <div className="section-header light">
        <span className="section-subtitle">Khám phá điểm đến</span>
        <h2 className="section-title">ĐIỂM ĐẾN ĐẶC TRƯNG</h2>
      </div>
      
      <div className="destinations-grid">
        {destinations.map((destination, index) => (
          <div
            className="destination-item"
            key={index}
            onClick={() => handleDestinationClick(destination)}
            style={{ 
              backgroundImage: `url(${destination.image})`,
              animationDelay: `${index * 0.2}s`
            }}
          >
            <div className="destination-overlay"></div>
            <div className="destination-content">
              <h3 className="destination-name">{destination.name}</h3>
              <div className="destination-explore">
                <span>Khám phá</span>
                <i className="fas fa-long-arrow-alt-right"></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Destinations;