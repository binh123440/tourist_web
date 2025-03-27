import React, { useRef } from 'react';
import './ContactStyle.css';
import emailjs from 'emailjs-com';

const ContactPage = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    // Gửi email đến người dùng
    emailjs.sendForm('service_rna3ece', 'template_g6ctpdk', form.current, 'WMZ4FkXbGkt6pzVER')
      .then((result) => {
          console.log('Email đến người dùng:', result.text);
          alert('Gửi email đến người dùng thành công!');
      }, (error) => {
          console.log('Lỗi khi gửi email đến người dùng:', error.text);
          alert('Gửi email đến người dùng thất bại!');
      });

    // Gửi email đến chính bạn (admin)
    const adminEmailData = {
      admin_email: 'binhgolden123@gmail.com', // Thay bằng email của bạn
      user_name: form.current.name.value,
      user_phone: form.current.phone.value,
      user_email: form.current.email.value,
      user_subject: form.current.subject.value,
      user_message: form.current.message.value,
    };

    emailjs.send('service_rna3ece', 'template_3bgb7fs', adminEmailData, 'WMZ4FkXbGkt6pzVER')
      .then((result) => {
          console.log('Email đến admin:', result.text);
          alert('Gửi email đến admin thành công!');
      }, (error) => {
          console.log('Lỗi khi gửi email đến admin:', error.text);
          alert('Gửi email đến admin thất bại!');
      });
  };

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
        <form ref={form} onSubmit={sendEmail}>
          <div className="form-group">
            <input placeholder='Tên' type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <input placeholder='Điện thoại' type="text" id="phone" name="phone" required />
          </div>
          <div className="form-group">
            <input placeholder='Email' type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <input placeholder='Chủ đề' type="text" id="subject" name="subject" required />
          </div>
          <div className="form-group">
            <textarea placeholder='Ghi nội dung tại đây...' id="message" name="message" required></textarea>
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