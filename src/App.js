
import './App.css';

import NavBar from './components/Navbar'
import Introduction from './components/Introduction';
import { Route, Routes } from 'react-router-dom';
import Home from './routes/Home';
import About from './routes/About';
import Tour from './routes/Tour';
import Contactp from './routes/Contact';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TourDetail from './components/TourDetail';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/tour" element={<Tour />} />
        <Route path="/contact" element={<Contactp />} />
        <Route path="/tour-detail" element={<TourDetail />} />
      </Routes>
      <Navbar />
      <Footer />
    </div>
  );
}

export default App;
