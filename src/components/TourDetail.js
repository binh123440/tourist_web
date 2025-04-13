import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import "./TourDetailStyle.css";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import ContactPage from './ContactPage';
import Tours from "./Tours";
import { getTourDetail } from "../services/api";
import { useAuth } from '../context/AuthContext';

Modal.setAppElement('#root');

const TourDetail = () => {
  const { tourId } = useParams();
  const [tourData, setTourData] = useState(null);
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
        setCurrentSlide(0); // Reset slide when tourId changes
        const data = await getTourDetail(tourId);
        setTourData(data);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải chi tiết tour. Vui lòng thử lại sau.');
        setLoading(false);
        console.error('Error fetching tour details:', err);
      }
    };

    fetchTourDetail();
  }, [tourId]);

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleEdit = () => {
    navigate(`/admin/tours?edit=${tourData._id}`);
  };

  if (loading) {
    return (
      <div className="tour-detail-page">
        <div className="tour-details">
          <div className="loading">Đang tải chi tiết tour...</div>
        </div>
      </div>
    );
  }

  if (error || !tourData) {
    return (
      <div className="tour-detail-page">
        <div className="tour-details">
          <div className="error">{error || 'Không tìm thấy dữ liệu tour này.'}</div>
        </div>
      </div>
    );
  }

  // Xác định destination từ tourId
  const currentDestination = tourId.includes("bhutan") ? "bhutan" : 
                            tourId.includes("vietnam") ? "việt nam" : 
                            tourId.includes("phap") ? "pháp" : "all";

  return (
    <div className="tour-detail-page">
      <div className="tour-details">
        
        
        <h1>{tourData.title}</h1>
        <p className="intro" dangerouslySetInnerHTML={{ __html: tourData.intro }}></p>

        {tourData.days.map((day, index) => (
          <div key={index} className="day-details">
            <h2>{day.title}</h2>
            <div className="day-content">
              {day.content.map((item, idx) => (
                <div key={idx} className="content-item-html" dangerouslySetInnerHTML={{ __html: item }}></div>
              ))}
            </div>
          </div>
        ))}

        {tourData.images && tourData.images.length > 0 && (
          <div className="tour-slider">
            <Slider ref={sliderRef} {...settings}>
              {tourData.images.map((image, index) => (
                <div key={index}>
                  <img src={image.image} alt={image.alt} />
                </div>
              ))}
            </Slider>
            <div className="slide-number">
              {currentSlide + 1}/{tourData.images.length}
            </div>

            {/* Navigation Buttons */}
            <div className="slider-navigation">
              <button
                className="prev-button"
                onClick={() => sliderRef.current.slickPrev()}
                disabled={currentSlide === 0}
              >
                &#8592;
              </button>
              <button
                className="next-button"
                onClick={() => sliderRef.current.slickNext()}
                disabled={currentSlide === tourData.images.length - 1}
              >
                &#8594;
              </button>
            </div>
          </div>
        )}

        <div className="slider-button-container">
          <button className="schedule-button" onClick={openModal}>
            Đặt lịch ngay
          </button>
        </div>
        
        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Đặt lịch ngay"
          className="modal"
          overlayClassName="overlay"
        >
          <button className="close-modal" onClick={closeModal}>
            <i className="fas fa-times"></i>
          </button>
          <ContactPage />
        </Modal>

        {/* Related Tours */}
        <div className="related-tours">
          <h2>Các tour liên quan</h2>
          <Tours selectedDestination={currentDestination} />
        </div>
      </div>
    </div>
  );
};

export default TourDetail;

