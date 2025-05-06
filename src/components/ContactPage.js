import React, { useRef } from 'react';
import './ContactStyle.css';
import emailjs from 'emailjs-com';
// Remove TranslatedText import
// import TranslatedText from './TranslatedText';
import { useLanguage } from '../context/LanguageContext';
import Text from './Text'; // Import the Text component

const ContactPage = () => {
  // Get the t function from the context
  const { t } = useLanguage();
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    // Show loading/sending state (optional)
    const submitButton = e.target.querySelector('.submit-btn');
    if (submitButton) submitButton.disabled = true; // Disable button

    // Combine promises for better feedback
    const userEmailPromise = emailjs.sendForm('service_rna3ece', 'template_g6ctpdk', form.current, 'WMZ4FkXbGkt6pzVER');
    const adminEmailPromise = emailjs.send('service_rna3ece', 'template_3bgb7fs', {
      admin_email: 'ngdhai131003@gmail.com',
      user_name: form.current.name.value,
      user_phone: form.current.phone.value,
      user_email: form.current.email.value,
      user_subject: form.current.subject.value,
      user_message: form.current.message.value,
    }, 'WMZ4FkXbGkt6pzVER');

    Promise.allSettled([userEmailPromise, adminEmailPromise])
      .then(results => {
        let userSuccess = false;
        let adminSuccess = false;

        if (results[0].status === 'fulfilled') {
          console.log('Email đến người dùng:', results[0].value.text);
          userSuccess = true;
        } else {
          console.log('Lỗi khi gửi email đến người dùng:', results[0].reason.text);
        }

        if (results[1].status === 'fulfilled') {
          console.log('Email đến admin:', results[1].value.text);
          adminSuccess = true;
        } else {
          console.log('Lỗi khi gửi email đến admin:', results[1].reason.text);
        }

        if (userSuccess && adminSuccess) {
          alert(t('emailSuccess')); // Use translation key for alert
          form.current.reset(); // Reset form on success
        } else {
          alert(t('emailError')); // Use translation key for alert
        }
      })
      .finally(() => {
        // Re-enable button
        if (submitButton) submitButton.disabled = false;
      });
  };

  return (
    <div className="contact-page">
      <div className="contact-info">
        {/* Use Text component with translationKey */}
        <Text tag="h2" translationKey="contactUs" />
        {/* Keep phone number as is, or add key if needed */}
        <p>Hotline (WhatsApp, Zalo): +84 905 99 39 45</p>
        <p>
          {/* Use Text component */}
          <Text translationKey="otherPlatforms" />: {/* Add colon if needed */}
          <a href="https://www.pinterest.com/lotusvoyages" target="_blank" rel="noopener noreferrer" className="social-icon">
            <i className="fab fa-pinterest"></i>
          </a>
          <a href="https://www.facebook.com/lotusvoyagesdanang" target="_blank" rel="noopener noreferrer" className="social-icon">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.instagram.com/lotusvoyages" target="_blank" rel="noopener noreferrer" className="social-icon">
            <i className="fab fa-instagram"></i>
          </a>
        </p>
        {/* Keep email as is */}
        <p>Email: liendang@lotusvoyages.com.vn</p>
        {/* Use Text component for address */}
        <Text tag="p" translationKey="address" />
      </div>
      <div className="contact-form">
        <form ref={form} onSubmit={sendEmail}>
          <div className="form-group">
            {/* Use t() for placeholders */}
            <input placeholder={t('name')} type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <input placeholder={t('phoneNumber')} type="text" id="phone" name="phone" required />
          </div>
          <div className="form-group">
            <input placeholder={t('email')} type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <input placeholder={t('subject')} type="text" id="subject" name="subject" required />
          </div>
          <div className="form-group">
            <textarea placeholder={t('message')} id="message" name="message" required></textarea>
          </div>
          <button type="submit" className="submit-btn">
            {/* Use Text component for button text */}
            <Text translationKey="send" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;