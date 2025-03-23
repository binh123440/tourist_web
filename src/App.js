
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
    </div>
  );
}

export default App;
