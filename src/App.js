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
import Login from './routes/Login';
import Admin from './routes/Admin';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <ScrollToTop /> 
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tour" element={<Tour />} />
          <Route path="/contact" element={<Contactp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tour-detail/:tourId" element={<TourDetail />} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          } />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
