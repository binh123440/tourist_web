import React from 'react';
import { items } from './WhyChooseUsItem.js';
import './WhyChooseUsStyle.css';
import { useInView } from 'react-intersection-observer';

const WhyChooseUs = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  return (
    <div className="why-choose-us">
      <div className="why-choose-container">
        <div className="section-header">
          <span className="section-subtitle">Lý do chọn chúng tôi</span>
          <h2 className="section-title">VÌ SAO CHỌN LOTUS VOYAGES</h2>
        </div>
        
        <div
          ref={ref}
          className="items-container"
        >
          {items.map((item, index) => (
            <div 
              className={`item ${inView ? 'fade-in' : ''}`} 
              key={index}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="item-image">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="item-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="item-border"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default WhyChooseUs;