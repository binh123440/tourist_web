import React from 'react';
import './IntroductionStyle.css';
import { useInView } from 'react-intersection-observer';

const Introduction = () => {
  const { ref: textRef, inView: textVisible } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const { ref: imageRef, inView: imageVisible } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  return (
    <div className="introduction">
      <div className="introduction-container">
        <div className="content">
          <div 
            ref={imageRef} 
            className={`image ${imageVisible ? 'fade-in-left' : ''}`}
          >
            <div className="image-frame">
              <img src="founder.jpg" alt="Founder" />
            </div>
          </div>
          <div 
            ref={textRef} 
            className={`text ${textVisible ? 'fade-in-right' : ''}`}
          >
            <h3 className="subtitle">Thư ngỏ</h3>
            <h2 className="title">VÌ MỘT HÀNH TINH XANH</h2>
            <p>Bạn thân mến,</p>
            <p>
              Với nguyện ước đóng góp phần mình cho đất nước đẹp tươi, thông qua việc tổ chức những chuyến du lịch khám phá đầy ý nghĩa, trong sự lựa chọn lối sống xanh và lành, chúng tôi đã bắt đầu thực hiện dự án thành lập <strong>CÔNG TY TNHH DỊCH VỤ & DU LỊCH QUỐC TẾ LOTUS VOYAGES</strong>.
            </p>
            <p>
              Chúng tôi thật sự hạnh phúc khi mà dự án ấp ủ bấy lâu nay của chúng tôi đã thành hiện thực.
            </p>
            <p>
              Ước mơ tổ chức các chuyến du lịch chăm sóc sức khoẻ và phát triển những tài năng của bản thân, chúng tôi sẽ tổ chức các tour du lịch gồm workshop yoga, thiền tập, nấu ăn thuần chay, hội họa…
            </p>
            
            <div className="signature">
              <p>Ms. Đặng Thị Liên</p>
              <p>Founder</p>
            </div>
            
            <a href="/contact" className="learn-more-btn">
              Tìm hiểu thêm <i className="fas fa-long-arrow-alt-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;