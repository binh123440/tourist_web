import React, { useEffect, useRef } from 'react';
import { destinations } from './DestinationsItems.js';
import './DestinationsStyle.css';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext'; // Vẫn cần cho Text component
import Text from './Text';

const Destinations = ({ onDestinationSelect }) => {
  // const { t } = useLanguage(); // Không cần t trực tiếp ở đây nếu chỉ điều hướng bằng key
  const navigate = useNavigate();
  const destinationsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = document.querySelectorAll('.destination-item');
    items.forEach((item) => {
      observer.observe(item);
    });

    return () => {
      items.forEach((item) => {
        observer.unobserve(item);
      });
    };
  }, []);

  const handleDestinationClick = (destination) => {
    // Sử dụng trực tiếp destination.nameKey vì nó luôn được cung cấp
    // từ DestinationsItems.js (ví dụ: 'vietnam', 'france', 'bhutan')
    const keyForURL = destination.nameKey;

    if (!keyForURL) {
      console.error("Destination item is missing a nameKey:", destination);
      // Bạn có thể muốn xử lý lỗi này, ví dụ, không điều hướng
      return;
    }

    if (onDestinationSelect) {
      onDestinationSelect(keyForURL); // Truyền nameKey nếu component cha cần
    } else {
      // Điều hướng với nameKey đã được chuyển thành chữ thường
      // Ví dụ: /tour?destination=vietnam
      navigate(`/tour?destination=${keyForURL.toLowerCase()}`);
    }
  };

  return (
    <div className="featured-destinations" ref={destinationsRef}>
      <div className="section-header light">
        <Text tag="span" className="section-subtitle" translationKey="destinationsSubtitle" />
        <Text tag="h2" className="section-title" translationKey="destinationsTitle" />
      </div>

      <div className="destinations-grid">
        {destinations.map((destination, index) => (
          <div
            className="destination-item"
            // Sử dụng destination.nameKey cho key của React nếu nó là duy nhất,
            // hoặc một id ổn định khác nếu có. index không phải là lựa chọn tốt nhất nếu list có thể thay đổi.
            key={destination.nameKey || index}
            onClick={() => handleDestinationClick(destination)}
            style={{
              backgroundImage: `url(${destination.image})`,
              animationDelay: `${index * 0.2}s`
            }}
          >
            <div className="destination-overlay"></div>
            <div className="destination-content">
              {/* Text component sẽ sử dụng nameKey để dịch và hiển thị tên điểm đến */}
              <Text tag="h3" className="destination-name" translationKey={destination.name} />
              <div className="destination-explore">
                <Text tag="span" translationKey="explore" />
                <i className="fas fa-long-arrow-alt-right"></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Destinations;