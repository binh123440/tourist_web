import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from 'react';
import Slider from 'react-slick';
import './SliderStyle.css';

const SliderComponent = () => {
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

  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div>
          <img src="1.jpg" alt="Slide 1" />
          <div className="slider-text">
            <h1>MAKE HAPPINESS OUR DESTINATION</h1>
            <p>Let's "TAN" with us to lands of HAPPINESS</p>
            <button>Liên hệ ngay</button>
          </div>
        </div>
        <div>
          <img src="2.webp" alt="Slide 2" />
          <div className="slider-text">
            <h1>MAKE HAPPINESS OUR DESTINATION</h1>
            <p>Let's "TAN" with us to lands of HAPPINESS</p>
            <button>Liên hệ ngay</button>
          </div>
        </div>
        <div>
          <img src="3.jpg" alt="Slide 3" />
          <div className="slider-text">
            <h1>MAKE HAPPINESS OUR DESTINATION</h1>
            <p>Let's "TAN" with us to lands of HAPPINESS</p>
            <button>Liên hệ ngay</button>
          </div>
        </div>
        {/* Add more slides as needed */}
      </Slider>
    </div>
  );
};

export default SliderComponent;

