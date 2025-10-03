import './Home.css'
import { assets } from '../../assets/assets'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext'
import RoomType from '../../components/RoomType/RoomType';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";       
import "slick-carousel/slick/slick-theme.css"; 

const Home = () => {
    const images = [assets.khachsan, assets.list1, assets.list4, assets.list5];

    const settings = {
        dots: false,            
        infinite: true,       
        speed: 2500,            
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,         
        autoplaySpeed: 3000,    
        cssEase: "ease-in-out",
        pauseOnHover: false,
        pauseOnFocus: false 
    };

    return (
        <div className="home-container">
            <Slider {...settings}>
                {images.map((img, i) => (
                    <div key={i}>
                        <img
                            src={img}
                            alt={`slide-${i}`}
                            className="home-image-top"
                        />
                    </div>
                ))}
            </Slider>

            <div className="home-content">
                <div className="home-text">
                    <h2 className="welcome-text">Chào mừng đến với Khách sạn Dragon</h2>
                    <p>
                        Khách sạn Dragon là điểm đến lý tưởng cho những ai tìm kiếm sự sang trọng, tiện nghi hiện đại và dịch vụ hoàn hảo.
                        Tọa lạc tại vị trí thuận lợi, khách sạn cung cấp các phòng nghỉ rộng rãi với thiết kế tinh tế, kết hợp hài hòa giữa phong cách hiện đại và nét truyền thống đặc trưng.
                    </p>
                    <p>
                        Chúng tôi tự hào mang đến trải nghiệm ẩm thực độc đáo tại nhà hàng cao cấp, không gian thư giãn tại spa, cùng các tiện ích giải trí phong phú. Đội ngũ nhân viên tận tâm luôn sẵn sàng phục vụ, đảm bảo mỗi kỳ nghỉ tại Khách sạn Dragon là một trải nghiệm khó quên.
                    </p>
                    <p>
                        Dù là chuyến công tác hay kỳ nghỉ gia đình, Khách sạn Dragon cam kết đem đến sự thoải mái, an toàn và hài lòng tối đa cho mọi khách hàng.
                    </p>
                </div>
                <div className="home-image-container">
                    <img src={assets.khachsan3} alt="Khách sạn bổ sung" className="home-image" />
                </div>
            </div>

            <div className="room-text">
                <h2>Phòng khách sạn cao cấp và sang trọng</h2>
            </div>
            <RoomType />

            <div className="room-text">
                <h2>Tiện ích đẳng cấp</h2>
            </div>
            <div className="amenities-container">
                <div className="amenity-card">
                    <img src={assets.wifi} alt="Wifi" />
                    <p>Wifi miễn phí</p>
                </div>
                <div className="amenity-card">
                    <img src={assets.xeduadon} alt="Xe đưa đón" />
                    <p>Xe đưa đón</p>
                </div>
                <div className="amenity-card">
                    <img src={assets.buffet} alt="Buffet" />
                    <p>Buffet sáng</p>
                </div>
            </div>
        </div>
    )
}

export default Home
