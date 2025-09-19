import React from 'react';
import './Footer.css';
import { FaFacebookF, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-about">
          <h3>Khách sạn Dragon</h3>
          <p>
            Khách sạn Dragon mang đến trải nghiệm nghỉ dưỡng sang trọng với phòng nghỉ tiện nghi, dịch vụ đẳng cấp và ẩm thực độc đáo.
          </p>
        </div>

        <div className="footer-contact">
          <h4>Liên hệ</h4>
          <p><FaMapMarkerAlt /> 123 Đường Nguyễn Đức Cảnh, An Biên, TP. Hải Phòng</p>
          <p><FaPhoneAlt /> +84 123 456 789</p>
          <p><FaEnvelope /> contact@dragonhotel.com</p>
        </div>

        <div className="footer-social">
          <h4>Mạng xã hội</h4>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
          </div>
        </div>

      </div>
      <div className="footer-bottom">
        <p>© 2025 Khách sạn Dragon. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
