
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './routes/Home';
import Tour from './routes/Tour';
import Contactp from './routes/Contact';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TourDetail from './components/TourDetail';
import ScrollToTop from './components/ScrollToTop';


function App() {
  return (
    <div className="App">
      <ScrollToTop /> 
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tour" element={<Tour />} />
        <Route path="/contact" element={<Contactp />} />
        <Route path="/tour-detail" element={<TourDetail />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
