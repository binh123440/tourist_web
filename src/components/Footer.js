import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FooterStyle.css';

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
              <p className="footer-tagline">
                Hành trình đẳng cấp - Trải nghiệm xanh
              </p>
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
              
              <p className="license-info">
                GPKD Dịch Vụ Lữ Hành Quốc Tế số 48-361/2023 được Tổng cục Du Lịch Việt Nam tại Hà Nội cấp ngày 24/04/2023
              </p>
            </div>
            
            <div className="footer-column">
              <h4>Liên Hệ</h4>
              <ul className="contact-list">
                <li>
                  <i className="fas fa-map-marker-alt"></i>
                  <span>K285/43 Lê Duẩn, Tân Chính, Thanh Khê, Đà Nẵng, Việt Nam</span>
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
                  <span>Thứ Hai - Thứ Bảy: 9:00 - 17:30</span>
                </li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Liên Kết Nhanh</h4>
              <ul className="quick-links">
                <li>
                  <Link to="/">
                    <i className="fas fa-chevron-right"></i>Trang Chủ
                  </Link>
                </li>
                <li>
                  <Link to="/tour">
                    <i className="fas fa-chevron-right"></i>Tour Du Lịch
                  </Link>
                </li>
                <li>
                  <Link to="/#team-member-section">
                    <i className="fas fa-chevron-right"></i>Về Chúng Tôi
                  </Link>
                </li>
                <li>
                  <Link to="/contact">
                    <i className="fas fa-chevron-right"></i>Liên Hệ
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Phần đăng ký nhận tin đã được loại bỏ */}
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-container">
            <p>&copy; {new Date().getFullYear()} LOTUS VOYAGES. All Rights Reserved.</p>
            <p>Mã số thuế: 0402162459</p>
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