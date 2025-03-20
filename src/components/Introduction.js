import React from 'react';
import './IntroductionStyle.css';

const Introduction = () => {
  return (
    <div className="introduction">
      <div className="content">
        <div className="image">
          <img src="path/to/your/image.jpg" alt="Founder" />
        </div>
        <div className="text">
          <h3>Xin chào, Kuzuzangpo la, Tashi Delek, Hello...</h3>
          <h2>Chào mừng đến với The Happy Firm</h2>
          <p>
            Là những chuyến đi, hành trình, trải nghiệm đến những vùng đất thú vị đầy năng lượng trên thế giới.
          </p>
          <button>Tìm hiểu thêm</button>
        </div>
      </div>
    </div>
  );
};

export default Introduction;