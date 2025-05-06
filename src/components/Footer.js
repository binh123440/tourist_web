import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FooterStyle.css';
import { useLanguage } from '../context/LanguageContext';
import Text from './Text'; // Import Text component

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-container">
            <div className="footer-column">
              <div className="footer-logo">
                <img src="/icon.png" alt="Lotus Voyages" />
                <h3>LOTUS VOYAGES</h3>
              </div>
              <Text tag="p" className="footer-tagline" translationKey="footerTagline" />
              <div className="social-media">
                <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
              
              <Text tag="p" className="license-info" translationKey="licenseInfo" />
            </div>
            
            <div className="footer-column">
              <Text tag="h4" translationKey="contactFooter" />
              <ul className="contact-list">
                <li>
                  <i className="fas fa-map-marker-alt"></i>
                  <Text tag="span" translationKey="addressFooter" />
                </li>
                <li>
                  <i className="fas fa-phone-alt"></i>
                  <span>+84 905 99 39 45</span>
                </li>
                <li>
                  <i className="fas fa-envelope"></i>
                  <span>liendang@lotusvoyages.com.vn</span>
                </li>
                <li>
                  <i className="fas fa-clock"></i>
                  <Text tag="span" translationKey="workingHours" />
                </li>
              </ul>
            </div>
            
            <div className="footer-column">
              <Text tag="h4" translationKey="quickLinks" />
              <ul className="quick-links">
                <li>
                  <Link to="/">
                    <i className="fas fa-chevron-right"></i>
                    <Text translationKey="home" />
                  </Link>
                </li>
                <li>
                  <Link to="/tour">
                    <i className="fas fa-chevron-right"></i>
                    <Text translationKey="toursLink" />
                  </Link>
                </li>
                <li>
                  <Link to="/#team-member-section">
                    <i className="fas fa-chevron-right"></i>
                    <Text translationKey="aboutUsLink" />
                  </Link>
                </li>
                <li>
                  <Link to="/contact">
                    <i className="fas fa-chevron-right"></i>
                    <Text translationKey="contactLink" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-container">
            <p>&copy; {new Date().getFullYear()} LOTUS VOYAGES. All Rights Reserved.</p>
            <Text tag="p" translationKey="taxCode" />
          </div>
        </div>
      </footer>
      
      {showBackToTop && (
        <button className="back-to-top" onClick={scrollToTop}>
          <i className="fas fa-chevron-up"></i>
        </button>
      )}
    </>
  );
};

export default Footer;