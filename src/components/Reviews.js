import React from 'react';
import Slider from 'react-slick';
import './ReviewsStyle.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const reviews = [
  {
    name: 'Dang Nguyen',
    date: '28/12/2019',
    review: 'Bhutan has been in my bucket list for such a long time...',
    image: 'D',
    link: '#'
  },
  {
    name: 'Bao Hoa',
    date: '17/09/2019',
    review: 'Dịch vụ cực kỳ tốt. Các bạn luôn nhiệt tình tư vấn, trả lời...',
    image: 'B',
    link: '#'
  },
  {
    name: 'Nguyen Le',
    date: '04/09/2019',
    review: 'Awesome journey where I had such a great time with...',
    image: 'N',
    link: '#'
  }
];

const Reviews = () => {
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
      <h2>Cảm nghĩ của khách hàng về chúng tôi</h2>
      <Slider {...settings}>
        {reviews.map((review, index) => (
          <div className="review-item" key={index}>
            <div className="review-image">{review.image}</div>
            <p className="recommend">Recommends</p>
            <p className="review-text">"{review.review}"</p>
            <a href={review.link} className="read-more">Xem bài đánh giá</a>
            <p className="reviewer">{review.name} - {review.date}</p>
          </div>
        ))}
      </Slider>
      <div className='facebook-link'>
        <p>Hãy theo dõi chúng tôi trên FaceBook và Instagram để nắm bắt những đánh giá và cập nhật mới mới nhất</p>
        <img src="fb.png" alt="Reviews" className='fb-img'/>
        <a className="fb-text" href="https://www.facebook.com/lotusvoyagesdanang">LOTUS VOYAGES</a>
        <img src="instagram.png" alt="Reviews" className='insta-img'/>
        <a className="insta-text" href="https://www.facebook.com/lotusvoyagesdanang">LOTUS VOYAGES</a>
      </div>
      
    </div>
  );
};

export default Reviews;