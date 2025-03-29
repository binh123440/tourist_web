import React from 'react';
import SliderComponent from '../components/Slider';
import Introduction from '../components/Introduction';
import WhyChooseUs from '../components/WhyChooseUs';
import Gallery from '../components/Gallery';
import TeamMember from '../components/TeamMember';
import Destinations from '../components/Destinations';
import Tours from '../components/Tours';
import Reviews from '../components/Reviews';

function Home() {
  return (
    <div className="Home">
      <SliderComponent />
      <Introduction />
      <WhyChooseUs />
      <Gallery />
      <div id="team-member-section">
        <TeamMember />
      </div>
      <Destinations /> {/* Hiển thị Destinations */}
      <Tours selectedDestination="all" /> {/* Hiển thị tất cả các tour */}
      <Reviews />
    </div>
  );
}

export default Home;