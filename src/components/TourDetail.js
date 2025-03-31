import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import "./TourDetailStyle.css";
import { bhutan1, bhutan2 } from "./TourDetailItems.js";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import ContactPage from './ContactPage';
import Tours from "./Tours"; // Import component Tours

Modal.setAppElement('#root');

const TourDetail = () => {
  const { tourId } = useParams(); // Lấy tourId từ URL
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lấy dữ liệu tour tương ứng
  const tourData = tourId === "bhutan1" ? bhutan1[0] : bhutan2[0];
  const slides = tourId === "bhutan1" ? bhutan1.filter((item) => item.image) : bhutan2.filter((item) => item.image);
  const totalSlides = slides.length;

  // Xác định địa điểm hiện tại
  const currentDestination = tourId.includes("bhutan") ? "bhutan" : "việt nam";

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
  };

  useEffect(() => {
    setCurrentSlide(0); // Đặt lại slide đầu tiên khi tourId thay đổi
  }, [tourId]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="tour-detail-page">
      <div className="tour-details">
        <h1>{tourData.title}</h1>
        <p className="intro">{tourData.intro}</p>

        {tourData.days.map((day, index) => (
          <div key={index} className="day-details">
            <h2>{day.title}</h2>
            <ul>
              {day.content.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}

        <div className="tour-slider">
          <Slider ref={sliderRef} {...settings}>
            {slides.map((slide, index) => (
              <div key={index}>
                <img src={slide.image} alt={slide.alt} />
              </div>
            ))}
          </Slider>
          <div className="slide-number">
            {currentSlide + 1}/{totalSlides}
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
              disabled={currentSlide === totalSlides - 1}
            >
              &#8594;
            </button>
          </div>
        </div>
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
            X
          </button>
          <ContactPage /> {/* Hiển thị nội dung của ContactPage */}
        </Modal>

        {/* Related Tours */}
        <div className="related-tours">
          <h2>Các tour liên quan</h2>
          <Tours selectedDestination={currentDestination} /> {/* Truyền địa điểm hiện tại */}
        </div>
      </div>
    </div>
  );
};

export default TourDetail;

