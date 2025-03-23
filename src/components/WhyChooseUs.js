import React from 'react';
import { items } from './WhyChooseUsItem.js';
import './WhyChooseUsStyle.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const WhyChooseUs = () => {
  return (
    <div className="why-choose-us">
      <h2>VÌ SAO CHỌN THE HAPPY FIRM TEAM</h2>
      <div className="items">
        {items.map((item, index) => (
          <div className="item" key={index}>
            <img src={item.image} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;