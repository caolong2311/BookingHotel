import './RoomType.css'
import React, { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { Link } from 'react-router-dom';
const RoomType = () => {
    const { rooms } = useContext(StoreContext)
    return (
        <div className="room-list">
            {rooms.map(room => (
                <div key={room.roomTypeId} className="room-card">
                    <img src={room.image} alt={room.typeName} />
                    <div className="room-price">
                        Từ {room.basePrice.toLocaleString()} VND / ngày
                    </div>
                    <div className="room-quantity">
                        {room.totalRooms} phòng
                    </div>
                    <h3>Phòng {room.typeName}</h3>
                    <p> {room.area} m²</p>
                    <p> {room.bedDescription}</p>
                    <Link
                        to={`/${encodeURIComponent(room.typeName)}`}
                        state={{ room }}
                        className="book-btn"
                    >
                        Chi tiết
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default RoomType
