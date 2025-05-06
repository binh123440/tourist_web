import React from 'react';
// Assuming items are now defined with translation keys
import { items } from './WhyChooseUsItem.js';
import './WhyChooseUsStyle.css';
import { useInView } from 'react-intersection-observer';
// Remove TranslatedText import
// import TranslatedText from './TranslatedText';
import { useLanguage } from '../context/LanguageContext';
import Text from './Text'; // Import Text component

const WhyChooseUs = () => {
  // Get t function
  const { t } = useLanguage();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <div className="why-choose-us">
      <div className="why-choose-container">
        <div className="section-header">
          {/* Use Text component */}
          <Text tag="span" className="section-subtitle" translationKey="whyChooseUsSubtitle" />
          <Text tag="h2" className="section-title" translationKey="whyChooseUsTitle" />
        </div>

        <div
          ref={ref}
          className="items-container"
        >
          {/* Assuming items array now has titleKey and descriptionKey */}
          {items.map((item, index) => (
            <div
              className={`item ${inView ? 'fade-in' : ''}`}
              key={index}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="item-image">
                {/* Use t() for alt text if item.titleKey exists */}
                <img src={item.image} alt={item.titleKey ? t(item.titleKey) : item.title} />
              </div>
              <div className="item-content">
                {/* Use Text component with keys */}
                <Text tag="h3" translationKey={item.titleKey || item.title} />
                <Text tag="p" translationKey={item.descriptionKey || item.description} />
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