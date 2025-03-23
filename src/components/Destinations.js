import React from 'react';
import { destinations } from './DestinationsItems.js';
import './DestinationsStyle.css';


const Destinations = () => {
  return (
    <div className="featured-destinations">
      <h2>ĐIỂM ĐẾN ĐẶC TRƯNG CỦA LOTUS VOYAGES</h2>
      <div className="destinations-grid">
        {destinations.map((destination, index) => (
          <div className="destination-item" key={index}>
            <img src={destination.image} alt={destination.name} />
            <div className="destination-name">{destination.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Destinations;