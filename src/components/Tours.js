import React, { useState } from 'react';
import { tours } from './ToursItems.js';
import './ToursStyle.css';

const Tours = () => {
  const [selectedDestination, setSelectedDestination] = useState('all');

  const handleDestinationChange = (destination) => {
    setSelectedDestination(destination);
  };

  const filteredTours = selectedDestination === 'all'
    ? tours
    : tours.filter(tour => tour.destination.toLowerCase().includes(selectedDestination));

  return (
    <div className="tours-section">
      <hr></hr>
      <h2>CHƯƠNG TRÌNH TRẢI NGHIỆM</h2>
      <div className="tours-menu">
        <a href="#all" onClick={() => handleDestinationChange('all')}>All Posts</a>
        <a href="#bhutan" onClick={() => handleDestinationChange('bhutan')}>Bhutan</a>
        <a href="#vietnam" onClick={() => handleDestinationChange('vietnam')}>Vietnam</a>
        <a href="#france" onClick={() => handleDestinationChange('france')}>France</a>
      </div>
      <div className="tours-grid">
        {filteredTours.map((tour, index) => (
          <div className="tour-item" key={index}>
            <img src={tour.image} alt={tour.title} />
            <div className="tour-content">
              <p className="date">{tour.date}</p>
              <p className="destination">{tour.destination}</p>
              <h3>{tour.title}</h3>
              <p className="description">{tour.description}</p>
              <a href={tour.link} className="continue-reading">Xem tour</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tours;