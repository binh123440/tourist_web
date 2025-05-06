import React, { useEffect, useRef } from 'react';
// Assuming destinations have keys now
import { destinations } from './DestinationsItems.js';
import './DestinationsStyle.css';
import { useNavigate } from 'react-router-dom';
// Remove TranslatedText import
// import TranslatedText from './TranslatedText';
import { useLanguage } from '../context/LanguageContext';
import Text from './Text'; // Import Text component

const Destinations = ({ onDestinationSelect }) => {
  // Get t function
  // const { t } = useLanguage(); // t is not directly needed if using Text component
  const navigate = useNavigate();
  const destinationsRef = useRef(null);

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
    // Assuming destination object has a nameKey
    const destinationName = destination.nameKey || destination.name;
    if (onDestinationSelect) {
      onDestinationSelect(destinationName); // Pass key or name
    } else {
      // Use lowercase key or name for URL
      navigate(`/tour?destination=${destinationName.toLowerCase()}`);
    }
  };

  return (
    <div className="featured-destinations" ref={destinationsRef}>
      <div className="section-header light">
        {/* Use Text component */}
        <Text tag="span" className="section-subtitle" translationKey="destinationsSubtitle" />
        <Text tag="h2" className="section-title" translationKey="destinationsTitle" />
      </div>

      <div className="destinations-grid">
        {/* Assuming destinations array has nameKey */}
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
              {/* Use Text component */}
              <Text tag="h3" className="destination-name" translationKey={destination.nameKey || destination.name} />
              <div className="destination-explore">
                {/* Use Text component */}
                <Text tag="span" translationKey="explore" />
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