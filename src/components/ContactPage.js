import React from 'react';
import './ContactStyle.css';

const ContactPage = () => {
  return (
    <div className="contact-page">
      <div className="contact-info">
        <h2>Liên hệ</h2>
        <p>Hotline (WhatsApp, Zalo): +84 905 99 39 45</p>
        <p>Facebook chat: <a href="https://www.facebook.com/lotusvoyagesdanang">https://www.facebook.com/lotusvoyagesdanang</a></p>
        <p>Email: liendang@lotusvoyages.com.vn</p>
        <p>K285/43 Lê Duẩn, Phường Tân Chính, Quận Thanh Khê, Thành phố Đà Nẵng, Việt Nam</p>
      </div>
      <div className="contact-form">
        <form>
          <div className="form-group">
          
            <input placeholder='Tên' type="text" id="name" name="name" />
          </div>
          <div className="form-group">
           
            <input placeholder='Điện thoại' type="text" id="phone" name="phone" />
          </div>
          <div className="form-group">
          
            <input placeholder='Email' type="email" id="email" name="email" />
          </div>
          <div className="form-group">
           
            <input placeholder='Chủ đề' type="text" id="subject" name="subject" />
          </div>
          <div className="form-group">
          
            <textarea placeholder='Ghi nội dung tại đây...' id="message" name="message"></textarea>
          </div>
          <button type="submit" className="submit-btn">Gửi đi</button>
        </form>
        <div className="social-media">
        <a href="https://www.pinterest.com/lotusvoyages"><i className="fab fa-pinterest"></i></a>
        <a href="https://www.facebook.com/lotusvoyagesdanang"><i className="fab fa-facebook-f"></i></a>
        <a href="https://www.instagram.com/lotusvoyages"><i className="fab fa-instagram"></i></a>
      </div>
      </div>
      
    </div>
  );
};

export default ContactPage;