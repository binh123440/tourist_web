import React from 'react';
import Slider from 'react-slick';
import './ReviewsStyle.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { useLanguage } from '../context/LanguageContext'; // Không cần nếu chỉ dùng Text
import Text from './Text'; // Import Text component

// Dữ liệu reviews mẫu
const reviews = [
  { name: 'Dang Nguyen', date: '28/12/2019', review: 'Bhutan has been in my bucket list for such a long time and I was so lucky to find Lotus Voyages to plan my first trip to this beautiful country. Everything was well-organized and beyond my expectation. Thank you so much for this wonderful experience!', image: 'D', link: '#' },
  { name: 'Bao Hoa', date: '17/09/2019', review: 'Dịch vụ cực kỳ tốt. Các bạn luôn nhiệt tình tư vấn, trả lời các thắc mắc của mình rất nhanh. Chuyến đi rất vui và có nhiều kỷ niệm đáng nhớ. Cảm ơn Lotus Voyages nhiều nhé!', image: 'B', link: '#' },
  { name: 'Nguyen Le', date: '04/09/2019', review: 'Awesome journey where I had such a great time with my family. The tour guide was very knowledgeable and friendly. We enjoyed every moment. Highly recommend Lotus Voyages!', image: 'N', link: '#' }
];

const Reviews = () => {
  const settings = {
    infinite: true,
    speed: 500, // Tăng speed một chút cho mượt hơn
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Tăng thời gian autoplay
    pauseOnHover: true, // Dừng khi hover
    responsive: [
      {
        breakpoint: 1024, // Desktop nhỏ / Tablet lớn
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768, // Tablet nhỏ
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480, // Mobile
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false, // Ẩn mũi tên trên mobile cho gọn
        }
      }
    ]
  };

  return (
    <div className="reviews-section">
      <Text tag="h2" translationKey="reviewsTitle" />
      
      <Slider {...settings}>
        {reviews.map((review, index) => (
          <div className="review-item-wrapper" key={index}> {/* Thêm wrapper nếu cần padding cho slide */}
            <div className="review-item">
              <div className="review-header">
                <div className="review-image">{review.image}</div>
                <div className="reviewer-info">
                  <p className="reviewer">{review.name}</p>
                  {/* <Text tag="p" className="recommend" translationKey="recommends" /> */}
                  <p className="recommend">{review.date}</p> {/* Hiển thị ngày thay vì "recommends" */}
                </div>
              </div>
              <p className="review-text-content">"{review.review}"</p> {/* Đổi class để tránh trùng với class của section */}
              {review.link && review.link !== '#' && ( // Chỉ hiển thị nếu có link
                <Text tag="a" href={review.link} className="read-more" translationKey="readReview" target="_blank" rel="noopener noreferrer"/>
              )}
            </div>
          </div>
        ))}
      </Slider>

      {/* Cấu trúc lại phần social links */}
      <div className="recommendation-section">
        <Text tag="p" className="follow-us-text" translationKey="followUsSocial" />
        <div className="social-links-container">
          <a href="https://www.facebook.com/lotusvoyagesdanang" target="_blank" rel="noopener noreferrer" className="social-link facebook-link">
            <span className="fb-img"> {/* Sử dụng span nếu là icon font, hoặc img nếu là file ảnh */}
              <img src="/fb.png" alt="Facebook" /> {/* Đường dẫn tới ảnh trong public folder */}
            </span>
            <span className="fb-text">LOTUS VOYAGES</span>
          </a>
          <a href="https://www.instagram.com/lotusvoyages" target="_blank" rel="noopener noreferrer" className="social-link instagram-link">
            <span className="insta-img">
              <img src="/instagram.png" alt="Instagram" /> {/* Đường dẫn tới ảnh trong public folder */}
            </span>
            <span className="insta-text">LOTUS VOYAGES</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Reviews;