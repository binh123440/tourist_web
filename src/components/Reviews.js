import React from 'react';
import Slider from 'react-slick';
import './ReviewsStyle.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// Remove TranslatedText import
// import TranslatedText from './TranslatedText';
import { useLanguage } from '../context/LanguageContext';
import Text from './Text'; // Import Text component

// Assuming reviews might have translation keys if needed
const reviews = [
  { name: 'Dang Nguyen', date: '28/12/2019', review: 'Bhutan has been in my bucket list for such a long time...', image: 'D', link: '#' },
  { name: 'Bao Hoa', date: '17/09/2019', review: 'Dịch vụ cực kỳ tốt. Các bạn luôn nhiệt tình tư vấn, trả lời...', image: 'B', link: '#' },
  { name: 'Nguyen Le', date: '04/09/2019', review: 'Awesome journey where I had such a great time with...', image: 'N', link: '#' }
];

const Reviews = () => {
  // Get t function
  // const { t } = useLanguage(); // t is not directly needed if using Text component
  const settings = {
    infinite: true,
    speed: 200,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <div className="reviews-section">
      {/* Use Text component */}
      <Text tag="h2" translationKey="reviewsTitle" />
      <Slider {...settings}>
        {reviews.map((review, index) => (
          <div className="review-item" key={index}>
            <div className="review-image">{review.image}</div>
            {/* Use Text component */}
            <Text tag="p" className="recommend" translationKey="recommends" />
            {/* Review text might be dynamic or need a key */}
            <p className="review-text">"{review.review}"</p>
            {/* Use Text component */}
            <Text tag="a" href={review.link} className="read-more" translationKey="readReview" />
            {/* Reviewer name/date likely dynamic */}
            <p className="reviewer">{review.name} - {review.date}</p>
          </div>
        ))}
      </Slider>
      <div className='facebook-link'>
        {/* Use Text component */}
        <Text tag="p" translationKey="followUsSocial" />
        <img src="fb.png" alt="Reviews" className='fb-img'/>
        <a className="fb-text" href="https://www.facebook.com/lotusvoyagesdanang">LOTUS VOYAGES</a>
        <img src="instagram.png" alt="Reviews" className='insta-img'/>
        {/* Link corrected to Instagram */}
        <a className="insta-text" href="https://www.instagram.com/lotusvoyages">LOTUS VOYAGES</a>
      </div>
    </div>
  );
};

export default Reviews;