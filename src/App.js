
import './App.css';
import NavBar from './components/Navbar'
import SliderComponent from './components/Slider';
import Introduction from './components/Introduction';
import { Routes } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      
        <NavBar/>
        <SliderComponent />
        <Introduction />

    </div>
  );
}

export default App;
