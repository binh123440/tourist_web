import React, { useState, useEffect } from 'react';
import './ToursStyle.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getTours } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext'; // Import useLanguage
import Text from './Text';
import axios from 'axios';

const Tours = ({ selectedDestination = 'all' }) => {
  const { t, currentLanguage } = useLanguage(); // Get currentLanguage
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Helper function to get the correct language string or fallback
  const getLang = (fieldObject, lang = currentLanguage) => {
    return fieldObject?.[lang] || fieldObject?.vi || ''; // Fallback to Vietnamese, then empty string
  };

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        // Adjust API call if needed based on how selectedDestination is handled (key vs name)
        const destinationQuery = selectedDestination === 'all' ? null : selectedDestination;
        const data = await getTours(destinationQuery);
        setTours(data);
        setLoading(false);
      } catch (err) {
        setError(t('errorLoadingTours'));
        setLoading(false);
        console.error('Error fetching tours:', err);
      }
    };

    fetchTours();
    // Update selectedCategory based on prop/URL if needed
    setSelectedCategory(selectedDestination === 'all' ? 'all' : selectedDestination.toLowerCase());

  }, [selectedDestination, t]); // Dependency array

  // --- getDaysRemaining function (keep as is) ---
  const getDaysRemaining = (dateString) => {
    // ... (keep existing logic) ...
    if (!dateString) return null;

    // Try parsing format "DD/MM/YYYY - DD/MM/YYYY" or just "DD/MM/YYYY"
    const parts = dateString.split(' - ');
    const endDateString = parts.length > 1 ? parts[1] : parts[0]; // Use end date if range, else the single date

    // Split date and time if present (e.g., "20/12/2024 14:00")
    const dateParts = endDateString.split(' ')[0].split('/');
    if (dateParts.length !== 3) return null; // Invalid format

    // Assuming DD/MM/YYYY
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
    const year = parseInt(dateParts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

    try {
      const endDate = new Date(year, month, day);
      // Check if the constructed date is valid
      if (isNaN(endDate.getTime())) {
          throw new Error("Invalid date created");
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today's date

      // Ensure endDate is also normalized if time is not relevant
      endDate.setHours(0, 0, 0, 0);

      const diffTime = endDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays >= 0 ? diffDays : null; // Return null if the date is in the past
    } catch (parseError) {
      console.error("Error parsing date:", dateString, parseError);
      return null;
    }
  };


  const handleCategoryChange = (category) => {
    setSelectedCategory(category.toLowerCase());
    // Optionally navigate or update parent state if Tours component is reused elsewhere
    // navigate(`/tour?destination=${category.toLowerCase()}`);
  };

  const handleEdit = (e, tourId) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/admin/tours?edit=${tourId}`);
  };

  const handleDelete = async (e, tourId) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm(t('confirmDeleteTour'))) {
      try {
        const token = localStorage.getItem('token');
        // Use the integrated route for deletion
        await axios.delete(`http://localhost:5000/api/admin/integrated-tours/${tourId}`, {
          headers: {
            'x-auth-token': token
          }
        });
        setTours(tours.filter(tour => tour._id !== tourId));
      } catch (err) {
        console.error('Error deleting tour:', err);
        alert(t('deleteTourError'));
      }
    }
  };

  // Filter tours based on selectedCategory (using Vietnamese destination name for matching)
  const filteredTours = tours.filter(tour => {
    if (selectedCategory === 'all') return true;
    // Match against the Vietnamese destination name, case-insensitive
    return getLang(tour.destination, 'vi').toLowerCase() === selectedCategory.toLowerCase();
  });


  if (loading) {
    // ... loading state JSX ...
    return (
      <div className="tours-section">
        <div className="section-header">
          <Text tag="h2" className="section-title" translationKey="experiencePrograms" />
          <div className="title-underline"></div>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <Text tag="p" translationKey="loadingTours" />
        </div>
      </div>
    );
  }

  if (error) {
    // ... error state JSX ...
     return (
      <div className="tours-section">
        <div className="section-header">
          <Text tag="h2" className="section-title" translationKey="experiencePrograms" />
          <div className="title-underline"></div>
        </div>
        <div className="error-container">
          <i className="fas fa-exclamation-circle"></i>
          <Text tag="p">{error}</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="tours-section">
      <div className="section-header">
        <Text tag="h2" className="section-title" translationKey="experiencePrograms" />
        <div className="title-underline"></div>
      </div>

      {/* Filter Buttons - Match onClick with Vietnamese names */}
      {location.pathname === '/tour' && ( // Only show filters on /tour page
        <div className="tours-filter">
          <button
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('all')}
          >
            <i className="fas fa-globe-asia"></i> <Text translationKey="allDestinations" />
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'bhutan' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('bhutan')} // Use lowercase name
          >
            <i className="fas fa-mountain"></i> <Text translationKey="bhutan" />
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'việt nam' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('việt nam')} // Use lowercase name
          >
            <i className="fas fa-map-marker-alt"></i> <Text translationKey="vietnam" />
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'pháp' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('pháp')} // Use lowercase name
          >
            <i className="fas fa-landmark"></i> <Text translationKey="france" />
          </button>
        </div>
      )}

      <div className="tours-grid">
        {filteredTours.length > 0 ? (
          filteredTours.map((tour, index) => {
            const daysRemaining = getDaysRemaining(tour.date);
            // Get translated fields using the helper
            const tourTitle = getLang(tour.title);
            const tourDestination = getLang(tour.destination);
            const tourDescription = getLang(tour.description);

            return (
              <div
                className="tour-card animate-card"
                key={tour._id || index} // Use tour._id from MongoDB
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Use tour.link for navigation */}
                <Link to={`/tour-detail/${tour.link}`} className="tour-link">
                  <div className="tour-image-container">
                    <div className="image-overlay"></div>
                    {/* Use translated title for alt text */}
                    <img src={tour.image.startsWith('http') ? tour.image : `http://localhost:5000${tour.image}`} alt={tourTitle} loading="lazy" />
                    <div className="tour-destination-tag">
                      {/* Use translated destination */}
                      <i className="fas fa-map-marker-alt"></i> {tourDestination}
                    </div>
                    {daysRemaining !== null && daysRemaining < 30 && (
                      <div className="tour-special-tag">
                        <i className="fas fa-calendar-alt"></i>
                        {t('daysLeft', { days: daysRemaining })}
                      </div>
                    )}
                    {isAuthenticated && (
                      <div className="tour-admin-controls">
                        <button
                          className="tour-edit-btn"
                          onClick={(e) => handleEdit(e, tour._id)} // Pass tour._id
                          title={t('editTour')}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="tour-delete-btn"
                          onClick={(e) => handleDelete(e, tour._id)} // Pass tour._id
                          title={t('deleteTour')}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="tour-content">
                    <div className="tour-meta">
                      <p className="tour-date">
                        <i className="far fa-calendar"></i> {tour.date}
                      </p>
                    </div>
                    {/* Use translated title */}
                    <h3 className="tour-title">{tourTitle}</h3>
                    {/* Use translated description */}
                    <p className="tour-description">{tourDescription}</p>
                    <div className="tour-footer">
                      <Text tag="span" className="tour-view-btn" translationKey="viewDetails">
                         <i className="fas fa-long-arrow-alt-right"></i>
                      </Text>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        ) : (
          <div className="no-tours">
            <i className="far fa-frown"></i>
            <Text tag="p" translationKey="noToursFound" />
            {/* Ensure 'all' category resets correctly */}
            <button
              className="reset-filter-btn"
              onClick={() => handleCategoryChange('all')}
            >
              <Text translationKey="viewAllTours" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tours;