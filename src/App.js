
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './routes/Home';
import Tour from './routes/Tour';
import Contactp from './routes/Contact';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TourDetail from './components/TourDetail';
import ScrollToTop from './components/ScrollToTop';
import Tours from './components/Tours';


function App() {
  return (
    <div className="App">
      <ScrollToTop /> 
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tour" element={<Tour />} />
        <Route path="/contact" element={<Contactp />} />
        <Route path="/" element={<Tours />} />
        <Route path="/tour-detail/:tourId" element={<TourDetail />} /> {/* Route động */}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
