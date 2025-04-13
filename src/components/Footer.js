import React from 'react';
import './FooterStyle.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <img src="/icon.png" alt="Lotus Voyages" className="footer-logo" />
          <p>CÔNG TY TNHH DỊCH VỤ & DU LỊCH QUỐC TẾ LOTUS VOYAGES</p>
          <p>Mã số thuế: 0402162459</p>
          <p>Địa chỉ: K285/43 Lê Duẩn, Phường Tân Chính, Quận Thanh Khê, Thành phố Đà Nẵng, Việt Nam</p>
          <p>GPKD Dịch Vụ Lữ Hành Quốc Tế số 48 -361/2023 được Tổng cục Du Lịch Việt Nam tại Hà Nội cấp ngày 24/04/2023</p>
        </div>
        <div className="footer-right">
          <p>Ms. Đặng Thị Liên - CEO</p>
          <p>Hotline: +84 905 99 39 45</p>
          <p>Email: liendang@lotusvoyages.com.vn</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;