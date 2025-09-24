import './RoomDetail.css'
import React, { useState } from 'react';
import { useParams, useLocation } from "react-router-dom";
import { assets } from '../../assets/assets';
import { FaArrowLeft, FaArrowRight, FaBed, FaRulerCombined, FaUserFriends, FaHotel } from 'react-icons/fa';
import RoomType from '../../components/RoomType/RoomType';

const RoomDetail = () => {
    const { roomName } = useParams();
    const location = useLocation();
    const { room } = location.state || {};
    const images = [assets[roomName + '1'], assets[roomName + '2']];
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevImage = () => {
        setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    };

    const nextImage = () => {
        setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
    };

    return (
        <div className="room-detail-container">
            <img src={assets.phong} alt="Khách sạn" className="image-top-booking" />
            <div className="image-slider">
                <button onClick={prevImage} className="arrow">
                    <FaArrowLeft size={24} />
                </button>
                <img
                    src={images[currentIndex]}
                    alt="Khách sạn"
                    className="image-room"
                />
                <button onClick={nextImage} className="arrow">
                    <FaArrowRight size={24} />
                </button>
            </div>

            {room && (
                <div className="room-info-detail">
                    <div className="room-header-detail">
                        <h2>Phòng {room.typeName}</h2>
                        <p className="room-price-detail">
                            Từ <span>{room.basePrice.toLocaleString()} VND</span> / đêm
                        </p>
                    </div>

                    <h3 className="service-title-detail">Dịch vụ phòng</h3>
                    <div className="room-services-detail">
                        <div className="service-card-detail">
                            <FaBed size={28} />
                            <div>
                                <strong>Loại giường</strong>
                                <p>{room.bedDescription}</p>
                            </div>
                        </div>

                        <div className="service-card-detail">
                            <FaRulerCombined size={28} />
                            <div>
                                <strong>Kích cỡ phòng</strong>
                                <p>{room.area} m²</p>
                            </div>
                        </div>

                        <div className="service-card-detail">
                            <FaUserFriends size={28} />
                            <div>
                                <strong>Số người</strong>
                                <p>{room.maxOccupancy}</p>
                            </div>
                        </div>

                        <div className="service-card-detail">
                            <FaHotel size={28} />
                            <div>
                                <strong>Số lượng phòng</strong>
                                <p>{room.totalRooms}</p>
                            </div>
                        </div>
                    </div>
                    <p className="room-description-detail">{room.description}</p>
                </div>
            )}
            <div className="room-text-detail">
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
            <div className="room-text">
                <h2>Các phòng đặc biệt khác</h2>
            </div>
            <RoomType></RoomType>
        </div>
    );
};

export default RoomDetail;
