import React from 'react';
import { destinations } from './DestinationsItems.js';
import './DestinationsStyle.css';
import { useNavigate } from 'react-router-dom';

const Destinations = ({ onDestinationSelect }) => {
  const navigate = useNavigate();

  const handleDestinationClick = (destination) => {
    if (onDestinationSelect) {
      onDestinationSelect(destination.name);
    } else {
      navigate(`/tour?destination=${destination.name.toLowerCase()}`);
    }
  };

  return (
    <div className="featured-destinations">
      <h2>ĐIỂM ĐẾN ĐẶC TRƯNG CỦA LOTUS VOYAGES</h2>
      <div className="destinations-grid">
        {destinations.map((destination, index) => (
          <div
            className="destination-item"
            key={index}
            onClick={() => handleDestinationClick(destination)}
            style={{ cursor: "pointer" }}
          >
            <img src={destination.image} alt={destination.name} />
            <div className="destination-name">{destination.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Destinations;