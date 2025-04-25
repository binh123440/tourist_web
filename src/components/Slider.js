import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState } from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import './SliderStyle.css';

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
    // Thêm các tùy chọn accessibility 
    accessibility: true,
    focusOnSelect: false
  };

  const slides = [
    {
      id: 1,
      image: "1.jpg",
      title: "KHÁM PHÁ THIÊN NHIÊN",
      description: "Hành trình về với thiên nhiên và văn hóa bản địa",
    },
    {
      id: 2,
      image: "2.webp",
      title: "TRẢI NGHIỆM BẢN SẮC",
      description: "Những điểm đến độc đáo và khó quên",
    },
    {
      id: 3,
      image: "3.jpg",
      title: "DU LỊCH XANH",
      description: "Cam kết vì một hành tinh xanh và du lịch bền vững",
    },
  ];

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id} className="slide-item" role="group" aria-roledescription="slide">
            <div className="slide-overlay"></div>
            <img src={slide.image} alt={`Slide ${slide.id}`} />
            <div className={`slider-text ${activeSlide === slide.id - 1 ? 'active' : ''}`}>
              <h1>{slide.title}</h1>
              <p>{slide.description}</p>
              <div className="slider-buttons">
                <button 
                  className="primary-btn" 
                  onClick={() => navigate('/tour')}
                  tabIndex={activeSlide === slide.id - 1 ? 0 : -1}
                >
                  Đặt Lịch Ngay <i className="fas fa-arrow-right"></i>
                </button>
                <button 
                  className="secondary-btn" 
                  onClick={() => navigate('/contact')}
                  tabIndex={activeSlide === slide.id - 1 ? 0 : -1}
                >
                  Liên Hệ Tư Vấn
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

