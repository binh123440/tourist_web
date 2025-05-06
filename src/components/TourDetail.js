import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import "./TourDetailStyle.css";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import ContactPage from './ContactPage';
import Tours from "./Tours";
import { getTourDetail } from "../services/api"; // Keep this
import { useAuth } from '../context/AuthContext';
import Text from './Text'; // Use Text for static translations
import { useLanguage } from '../context/LanguageContext';
import parse from 'html-react-parser'; // Import parser

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

Modal.setAppElement('#root');

const TourDetail = () => {
  // Use 't' for static text, 'currentLanguage' for selecting dynamic content
  const { currentLanguage, t } = useLanguage();
  const { tourId } = useParams();
  const [tourData, setTourData] = useState(null); // Will hold the full object with {vi, en, fr}
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // Keep if needed for edit button etc.

  // Fetching logic remains the same
  useEffect(() => {
    const fetchTourDetail = async () => {
      try {
        setLoading(true);
        setCurrentSlide(0); // Reset slide when tourId changes
        const data = await getTourDetail(tourId); // Fetches the object with {vi, en, fr}
        setTourData(data);
        setLoading(false);
      } catch (err) {
        // Use static translation key for error
        setError(t('errorLoadingTourDetails') || 'Could not load tour details.');
        setLoading(false);
        console.error('Error fetching tour details:', err);
      }
    };
    fetchTourDetail();
  }, [tourId, t]); // Add t dependency

  // Slider settings (keep as is)
  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
  };
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleEdit = () => {
    // Ensure tourData and _id exist before navigating
    // Use tourData._id which should be the TourDetail's _id from the API
    // Or if your API returns { tour: { _id: ... }, detail: { _id: ... } }, use tourData.tour._id
    const idToEdit = tourData?.tour?._id || tourData?._id; // Adjust based on your API response structure
    if (idToEdit) {
      navigate(`/admin/tours?edit=${idToEdit}`);
    } else {
      console.error("Cannot edit: Tour data or ID is missing.", tourData);
      // Optionally show a user notification
    }
  };


  // --- Render Logic ---
  if (loading) {
    return (
      <div className="tour-detail-page">
        <div className="tour-details loading-container">
          <Text translationKey="loadingTourDetails" />
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error || !tourData) {
    return (
      <div className="tour-detail-page">
        <div className="tour-details">
          <div className="error">
            <Text>{error || t('tourNotFound')}</Text>
          </div>
        </div>
      </div>
    );
  }

  // Helper to get the correct language string or fallback
  const getLang = (fieldObject, lang = currentLanguage) => {
    // Check if fieldObject itself is the language object (like day.content items)
    if (typeof fieldObject === 'object' && fieldObject !== null && ('vi' in fieldObject || 'en' in fieldObject || 'fr' in fieldObject)) {
       return fieldObject?.[lang] || fieldObject?.vi || '';
    }
    // Otherwise, assume fieldObject is the parent and contains the language object
    // This case might not be needed if data structure is consistent
    return '';
  };

  // Helper specifically for top-level fields like title, intro
  const getTopLevelLang = (fieldObject, lang = currentLanguage) => {
      return fieldObject?.[lang] || fieldObject?.vi || '';
  };


  // Determine destination for related tours (use Vietnamese name for consistency)
  const currentDestinationNameVi = tourData?.tour?.destination?.vi || '';
  const currentDestination = currentDestinationNameVi.toLowerCase(); // Use lowercase for matching

  return (
    <div className="tour-detail-page">
      <div className="tour-details">
        {/* --- Title --- */}
        <h1>{getTopLevelLang(tourData.title)}</h1>

        {/* --- Introduction --- */}
        <div className="tour-intro">
           <h2><Text translationKey="tourIntroduction" /></h2>
           {/* Use parser for HTML content */}
           <div>{parse(getTopLevelLang(tourData.intro))}</div>
        </div>


        {/* --- Itinerary --- */}
        <div className="tour-itinerary">
           <h2><Text translationKey="tourItinerary" /></h2>
           {(tourData.days && tourData.days.length > 0) ? (
              tourData.days.map((day, index) => (
                <div key={index} className="day-details">
                  {/* Day Title */}
                  <h3>{getLang(day.title)}</h3>
                  <div className="day-content">
                    {/* Day Content Items */}
                    {(day.content || []).map((item, idx) => (
                      <div key={idx} className="content-item-html">
                        {/* Use parser for HTML content - item is the language object */}
                        {parse(getLang(item))}
                      </div>
                    ))}
                  </div>
                </div>
              ))
           ) : (
              <p><Text translationKey="noItineraryAvailable" /></p>
           )}
        </div>


        {/* --- Image Slider --- */}
        {tourData.images && tourData.images.length > 0 && (
          <div className="tour-slider">
            <Slider ref={sliderRef} {...settings}>
              {tourData.images.map((image, index) => (
                <div key={index}>
                  {/* Image URL is not translated */}
                  <img
                    src={image.image?.startsWith('http') ? image.image : `http://localhost:5000${image.image}`}
                    // Alt text is translated
                    alt={getLang(image.alt)}
                  />
                </div>
              ))}
            </Slider>
            <div className="slide-number">
              {currentSlide + 1}/{tourData.images.length}
            </div>
            {/* Navigation Buttons (keep as is) */}
            <div className="slider-navigation">
               <button className="prev-button" onClick={() => sliderRef.current.slickPrev()} disabled={currentSlide === 0}>&#8592;</button>
               <button className="next-button" onClick={() => sliderRef.current.slickNext()} disabled={currentSlide === tourData.images.length - 1}>&#8594;</button>
            </div>
          </div>
        )}

        {/* --- Booking Button & Modal (Keep as is) --- */}
        <div className="slider-button-container">
          <button className="schedule-button" onClick={openModal}>
            <Text translationKey="bookNow" />
          </button>
        </div>
        <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel={t('bookNow')} className="modal" overlayClassName="overlay">
          <button className="close-modal" onClick={closeModal}><i className="fas fa-times"></i></button>
          <ContactPage />
        </Modal>

        {/* --- Related Tours (Pass the Vietnamese destination name) --- */}
        <div className="related-tours">
          <h2><Text translationKey="relatedTours" /></h2>
          {/* Pass the Vietnamese destination name for filtering */}
          <Tours selectedDestination={currentDestinationNameVi} />
        </div>

         {/* --- Optional Edit Button --- */}
         {isAuthenticated && (
            <button onClick={handleEdit} className="admin-edit-button">
               <i className="fas fa-edit"></i> <Text translationKey="editTour" />
            </button>
         )}

      </div>
    </div>
  );
};

export default TourDetail;

