import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState } from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import './SliderStyle.css';
import { useLanguage } from '../context/LanguageContext';
import Text from './Text'; // Import Text component

const SliderComponent = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 900,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    fade: true,
    autoplaySpeed: 5500,
    beforeChange: (current, next) => setActiveSlide(next),
    customPaging: i => (
      <div className={`custom-dot ${i === activeSlide ? 'active' : ''}`} />
    ),
    accessibility: true,
    focusOnSelect: false
  };

  const slides = [
    { id: 1, image: "1.jpg", titleKey: "slide1Title", descriptionKey: "slide1Desc" },
    { id: 2, image: "2.webp", titleKey: "slide2Title", descriptionKey: "slide2Desc" },
    { id: 3, image: "3.jpg", titleKey: "slide3Title", descriptionKey: "slide3Desc" },
  ];

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={slide.id} className="slide-item" role="group" aria-roledescription="slide">
            <div className="slide-overlay"></div>
            <img src={slide.image} alt={`Slide ${slide.id}`} />
            <div className={`slider-text ${activeSlide === index ? 'active' : ''}`}>
              <Text tag="h1" translationKey={slide.titleKey} />
              <Text tag="p" translationKey={slide.descriptionKey} />
              <div className="slider-buttons">
                <button
                  className="primary-btn"
                  onClick={() => navigate('/tour')}
                  tabIndex={activeSlide === index ? 0 : -1}
                >
                  <Text translationKey="bookNowSlider" /> <i className="fas fa-arrow-right"></i>
                </button>
                <button
                  className="secondary-btn"
                  onClick={() => navigate('/contact')}
                  tabIndex={activeSlide === index ? 0 : -1}
                >
                  <Text translationKey="contactSupport" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SliderComponent;

