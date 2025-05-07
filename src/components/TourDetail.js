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
  const { currentLanguage, t } = useLanguage();
  const { tourId } = useParams();
  const [tourData, setTourData] = useState(null); // Bây giờ sẽ là { tour: {}, detail: {} }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchTourDetail = async () => {
      try {
        setLoading(true);
        setCurrentSlide(0);
        const data = await getTourDetail(tourId); // data bây giờ là { tour: {}, detail: {} }
        setTourData(data);
        setLoading(false);
      } catch (err) {
        setError(t('errorLoadingTourDetails') || 'Could not load tour details.');
        setLoading(false);
        console.error('Error fetching tour details:', err);
      }
    };
    fetchTourDetail();
  }, [tourId, t]);

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
    // ID để edit là _id của tour chính (parentTour)
    const idToEdit = tourData?.tour?._id;
    if (idToEdit) {
      navigate(`/admin/tours?edit=${idToEdit}`);
    } else {
      console.error("Cannot edit: Main tour data or ID is missing.", tourData);
    }
  };

  if (loading) {
    // ... (giữ nguyên)
    return (
      <div className="tour-detail-page">
        <div className="tour-details loading-container">
          <Text translationKey="loadingTourDetails" />
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Quan trọng: Kiểm tra tourData và tourData.detail
  if (error || !tourData || !tourData.detail) { // Thêm kiểm tra !tourData.detail
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

  const getLang = (fieldObject, lang = currentLanguage) => {
    if (typeof fieldObject === 'object' && fieldObject !== null && ('vi' in fieldObject || 'en' in fieldObject || 'fr' in fieldObject)) {
       return fieldObject?.[lang] || fieldObject?.vi || '';
    }
    return '';
  };

  const getTopLevelLang = (fieldObject, lang = currentLanguage) => {
      return fieldObject?.[lang] || fieldObject?.vi || '';
  };

  // Destination lấy từ tourData.tour
  const currentDestinationNameVi = tourData?.tour?.destination?.vi || '';
  const currentTourLink = tourData?.tour?.link || ''; // Lấy link của tour hiện tại

  console.log('Full tourData object from API:', tourData);
  console.log('Extracted currentDestinationNameVi for Related Tours:', currentDestinationNameVi);
  console.log('Current tour link to exclude:', currentTourLink);


  // Truy cập dữ liệu chi tiết qua tourData.detail
  const detail = tourData.detail;

  return (
    <div className="tour-detail-page">
      <div className="tour-details">
        {/* --- Title từ tourData.detail.title --- */}
        <h1 className="tour-title">{getTopLevelLang(detail.title)}</h1>

        {/* --- Introduction từ tourData.detail.intro --- */}
        <div className="tour-intro">
          <h2 className="section-title"><Text translationKey="tourIntroduction" /></h2>
          <div className="intro-content">{parse(getTopLevelLang(detail.intro))}</div>
        </div>

        {/* --- Itinerary từ tourData.detail.days --- */}
        <div className="tour-itinerary">
          <h2 className="section-title"><Text translationKey="tourItinerary" /></h2>
          {(detail.days && detail.days.length > 0) ? (
            detail.days.map((day, index) => (
              <div key={index} className="day-details">
                <h3 className="day-title">{getLang(day.title)}</h3>
                <div className="day-content">
                  {(day.content || []).map((item, idx) => (
                    <div key={idx} className="content-item-html">
                      {parse(getLang(item))}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="no-itinerary"><Text translationKey="noItineraryAvailable" /></p>
          )}
        </div>

        {/* --- Image Slider từ tourData.detail.images --- */}
        {detail.images && detail.images.length > 0 && (
          <div className="tour-slider">
            <Slider ref={sliderRef} {...settings}>
              {detail.images.map((image, index) => (
                <div key={index}>
                  <img
                    src={image.image?.startsWith('http') ? image.image : `http://localhost:5000${image.image}`}
                    alt={getLang(image.alt)}
                  />
                </div>
              ))}
            </Slider>
            <div className="slide-number">
              {currentSlide + 1}/{detail.images.length}
            </div>
            <div className="slider-navigation">
               <button className="prev-button" onClick={() => sliderRef.current.slickPrev()} disabled={currentSlide === 0}>&#8592;</button>
               <button className="next-button" onClick={() => sliderRef.current.slickNext()} disabled={currentSlide === detail.images.length - 1}>&#8594;</button>
            </div>
          </div>
        )}

        {/* --- Booking Button & Modal --- */}
        <div className="slider-button-container">
          <button className="schedule-button" onClick={openModal}>
            <Text translationKey="bookNow" />
          </button>
        </div>
        <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel={t('bookNow')} className="modal" overlayClassName="overlay">
          <button className="close-modal" onClick={closeModal}><i className="fas fa-times"></i></button>
          <ContactPage />
        </Modal>

        {/* --- Related Tours (currentDestinationNameVi đã đúng) --- */}
        <div className="related-tours">
          <h2><Text translationKey="relatedTours" /></h2>
          {/* Truyền thêm currentTourLink vào component Tours */}
          <Tours
            selectedDestination={currentDestinationNameVi}
            excludeTourLink={currentTourLink}
          />
        </div>

         {/* --- Optional Edit Button (sử dụng tourData.tour._id) --- */}
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

