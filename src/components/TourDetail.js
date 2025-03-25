import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import './TourDetailStyle.css';
import { bhutan1, bhutan2 } from './TourDetailItems.js';
import { useLocation } from 'react-router-dom';

const TourDetail = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const location = useLocation();

  const getSlides = (tour) => {
    switch (tour) {
      case '/bhutan1':
        return bhutan1;
      case '/bhutan2':
        return bhutan2;
      default:
        return [];
    }
  };

  const params = new URLSearchParams(location.search);
  const tour = params.get('tour');
  console.log(tour);
  const slideIndex = parseInt(params.get('slide'), 10);
  const slides = getSlides(tour);
  const totalSlides = slides.length;

  useEffect(() => {
    if (!isNaN(slideIndex) && slideIndex >= 0 && slideIndex < totalSlides) {
      setCurrentSlide(slideIndex);
      sliderRef.current.slickGoTo(slideIndex);
    }
  }, [slideIndex, totalSlides]);

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
  };

  const handlePrevious = () => {
    sliderRef.current.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current.slickNext();
    
  };

  return (
    <div className="tour-detail-container">
      <Slider ref={sliderRef} {...settings}>
        {slides.map((slide, index) => (
          <div key={index}>
            <img src={slide.image} alt={slide.alt} />
          </div>
        ))}
      </Slider>
      <div className="slide-number">{currentSlide + 1}/{totalSlides}</div>
      <div className="slider-navigation">
        <button onClick={handlePrevious}>&lt; Previous</button>
        <button onClick={handleNext}>Next &gt;</button>
      </div>
    </div>
  );
};

export default TourDetail;

