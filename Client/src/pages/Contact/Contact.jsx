import './Contact.css'
import React from 'react'
import { assets } from '../../assets/assets'
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'

const Contact = () => {
    return (
        <div>
           
            <img
                src={assets.list4}
                alt="Khách sạn"
                className="home-image-top-booking"
            />

            <div className="contact-page">
    
                <div className="contact-cards">
                    <div className="contact-card">
                        <FaPhoneAlt className="card-icon" />
                        <h3>Hotline 24/7</h3>
                        <p>0123456789</p>
                        <p>0999999999</p>
                    </div>
                    <div className="contact-card">
                        <FaEnvelope className="card-icon" />
                        <h3>Email us</h3>
                        <p>contact@dragonhotel.com</p>
                    </div>
                    <div className="contact-card">
                        <FaMapMarkerAlt className="card-icon" />
                        <h3>Văn phòng</h3>
                        <p>123 Nguyễn Đức Cảnh, An Biên, TP. Hải Phòng</p>
                    </div>
                    <div className="contact-card">
                        <FaClock className="card-icon" />
                        <h3>Giờ làm việc</h3>
                        <p>T2 – CN</p>
                        <p>07:00 – 22:00</p>
                    </div>
                </div>

           
                <div className="contact-main">
                
                    <div className="contact-form">
                        <h2>Liên hệ với chúng tôi</h2>
                        <p>Để lại lời nhắn</p>
                        <form>
                            <input type="text" placeholder="Tên của bạn" />
                            <input type="email" placeholder="Email" />
                            <textarea placeholder="Nội dung tin nhắn" rows="5"></textarea>
                            <button type="submit">Submit</button>
                        </form>

                        <div className="social-links">
                            <a href="https://facebook.com" target="_blank" rel="noreferrer">
                                <FaFacebook /> Facebook
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer">
                                <FaInstagram /> Instagram
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer">
                                <FaTwitter /> Twitter
                            </a>
                        </div>
                    </div>

            
                    <div className="contact-map">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.858441989301!2d106.68216377503177!3d20.844911780803457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a7aea9f62a9df%3A0x2fa70edc14f4a4d!2zTmjDoCBow6FjaCBUUC4gSMOyYSBQaMOybmc!5e0!3m2!1svi!2s!4v1695809999999"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            title="Google Maps Hải Phòng"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
