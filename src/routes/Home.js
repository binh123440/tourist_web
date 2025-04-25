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

function Home() {
  // Thêm smooth scroll behavior cho toàn trang
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="Home">
      <SliderComponent />
      
      {/* Thêm CTA Banner */}
      <div className="cta-banner">
        <div className="cta-container">
          <div className="cta-item">
            <i className="fas fa-map-marked-alt"></i>
            <h3>Điểm Đến Độc Đáo</h3>
            <p>Khám phá những địa điểm du lịch độc đáo nhất</p>
          </div>
          <div className="cta-item">
            <i className="fas fa-leaf"></i>
            <h3>Du Lịch Xanh</h3>
            <p>Cam kết với môi trường và phát triển bền vững</p>
          </div>
          <div className="cta-item">
            <i className="fas fa-user-friends"></i>
            <h3>Hướng Dẫn Chuyên Nghiệp</h3>
            <p>Đội ngũ hướng dẫn viên chuyên nghiệp và thân thiện</p>
          </div>
          <div className="cta-item">
            <i className="fas fa-heart"></i>
            <h3>Dịch Vụ Tận Tâm</h3>
            <p>Chăm sóc và hỗ trợ khách hàng tận tình</p>
          </div>
        </div>
      </div>
      
      <Introduction />
      <WhyChooseUs />
      
    
      
      <Destinations />
      <Tours selectedDestination="all" />
      
      <Gallery />
      <div id="team-member-section">
        <TeamMember />
      </div>
      <Reviews />
    </div>
  );
}

export default Home;