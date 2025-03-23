
import './App.css';
import NavBar from './components/Navbar'
import SliderComponent from './components/Slider';
import Introduction from './components/Introduction';
import WhyChooseUs from './components/WhyChooseUs';
import { Routes } from 'react-router-dom';
import Gallery from './components/Gallery';
import TeamMember from './components/TeamMember';
import Destinations from './components/Destinations';
import Tours from './components/Tours';
import Reviews from './components/Reviews';
import Footer from './components/Footer';


function App() {
  return (
    <div className="App">
      
        <NavBar/>
        <SliderComponent />
        <Introduction />
        <WhyChooseUs />
        <Gallery />
        <TeamMember/>
        <Destinations/>
        <Tours/>
        <Reviews />
        <Footer />
    </div>
  );
}

export default App;
