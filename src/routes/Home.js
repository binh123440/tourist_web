import React, { useEffect } from 'react';
import SliderComponent from '../components/Slider';
import Introduction from '../components/Introduction';
import WhyChooseUs from '../components/WhyChooseUs';
import Gallery from '../components/Gallery';
import TeamMember from '../components/TeamMember';
import Destinations from '../components/Destinations';
import Tours from '../components/Tours';
import Reviews from '../components/Reviews';
import './HomeStyle.css';
import { useLanguage } from '../context/LanguageContext'; // Import useLanguage
import Text from '../components/Text'; // Import Text component

function Home() {
  // Get t function if needed for other parts, otherwise just use Text
  // const { t } = useLanguage();

  // Thêm smooth scroll behavior cho toàn trang
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="Home">
      <SliderComponent />

      {/* Thêm CTA Banner - Use Text component */}
      <div className="cta-banner">
        <div className="cta-container">
          <div className="cta-item">
            <i className="fas fa-map-marked-alt"></i>
            <Text tag="h3" translationKey="ctaUniqueDestinationsTitle" />
            <Text tag="p" translationKey="ctaUniqueDestinationsDesc" />
          </div>
          <div className="cta-item">
            <i className="fas fa-leaf"></i>
            <Text tag="h3" translationKey="ctaGreenTourismTitle" />
            <Text tag="p" translationKey="ctaGreenTourismDesc" />
          </div>
          <div className="cta-item">
            <i className="fas fa-user-friends"></i>
            <Text tag="h3" translationKey="ctaProGuidesTitle" />
            <Text tag="p" translationKey="ctaProGuidesDesc" />
          </div>
          <div className="cta-item">
            <i className="fas fa-heart"></i>
            <Text tag="h3" translationKey="ctaDedicatedServiceTitle" />
            <Text tag="p" translationKey="ctaDedicatedServiceDesc" />
          </div>
        </div>
      </div>

      <Introduction />
      <WhyChooseUs />
      <div id="team-member-section">
        <TeamMember />
      </div>
      <Destinations />
      <Tours selectedDestination="all" />

      <Gallery />
      
      <Reviews />
    </div>
  );
}

export default Home;