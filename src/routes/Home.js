import SliderComponent from '../components/Slider';
import Introduction from '../components/Introduction';
import WhyChooseUs from '../components/WhyChooseUs';
import Gallery from '../components/Gallery';
import TeamMember from '../components/TeamMember';
import Destinations from '../components/Destinations';
import Tours from '../components/Tours';
import Reviews from '../components/Reviews';


function Home(){
    return(
         <div className="Home">     
            <SliderComponent />
            <Introduction />
            <WhyChooseUs />
            <Gallery />
            <TeamMember/>
            <Destinations/>
            <Tours/>
            <Reviews />
        </div>
    );
}

export default Home;