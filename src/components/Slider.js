import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import './SliderStyle.css';

const SliderComponent = () => {
  const navigate = useNavigate();
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 900,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    fade: true,
    autoplaySpeed: 4500,
  };

  const slides = [
    {
      id: 1,
      image: "1.jpg",
      title: "LOTUS VOYAGES",
      description: "Vì một hành tinh xanh",
    },
    {
      id: 2,
      image: "2.webp",
      title: "LOTUS VOYAGES",
      description: "Vì một hành tinh xanh",
    },
    {
      id: 3,
      image: "3.jpg",
      title: "LOTUS VOYAGES",
      description: "Vì một hành tinh xanh",
    },
  ];

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id}>
            <img src={slide.image} alt={`Slide ${slide.id}`} />
            <div className="slider-text">
              <h1>LOTUS VOYAGES</h1>
              <p>Vì một hành tinh xanh</p>
              <button onClick={() => navigate('/tour')}>Đặt lịch ngay</button>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SliderComponent;

