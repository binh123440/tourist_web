import React, { useState, useEffect } from 'react';
import Destinations from '../components/Destinations';
import Tours from '../components/Tours';
import { useLocation } from 'react-router-dom';

function Tour() {
  const [selectedDestination, setSelectedDestination] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const destination = params.get('destination');
    if (destination) {
      setSelectedDestination(destination);
    }
  }, [location]);

  const handleDestinationSelect = (destination) => {
    setSelectedDestination(destination.toLowerCase());
  };

  const handleBackToDestinations = () => {
    setSelectedDestination(null);
  };

  return (
    <div className="Tour-menu" style={{ padding: "100px 0", backgroundColor: "black" }}>
      {!selectedDestination ? (
        <Destinations onDestinationSelect={handleDestinationSelect} />
      ) : (
        <div className="tours-section">
          <div className="back-button-container">
            <button
              onClick={handleBackToDestinations}
              className="back-button"
            >Quay lại</button>
          </div>
          <Tours selectedDestination={selectedDestination} />
        </div>
      )}
    </div>
  );
}

export default Tour;