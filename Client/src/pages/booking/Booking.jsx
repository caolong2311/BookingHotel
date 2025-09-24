import './Booking.css'
import React, { useState, useContext } from 'react'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const Booking = () => {
  const { rooms } = useContext(StoreContext)

  const today = new Date().toISOString().split("T")[0]
  const getNextDay = (date) => {
    const d = new Date(date)
    d.setDate(d.getDate() + 1)
    return d.toISOString().split("T")[0]
  }

  const [checkIn, setCheckIn] = useState(today)
  const [checkOut, setCheckOut] = useState(getNextDay(today))
  const [selectedRooms, setSelectedRooms] = useState({})

  const calcNights = () => {
    const inDate = new Date(checkIn)
    const outDate = new Date(checkOut)
    const diffTime = outDate - inDate
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
  const nights = calcNights()

  const handleSelect = (roomTypeId, value) => {
    setSelectedRooms((prev) => ({
      ...prev,
      [roomTypeId]: Number(value),
    }))
  }

  const totalPrice = rooms.reduce((sum, room) => {
    const qty = selectedRooms[room.roomTypeId] || 0
    return sum + qty * room.basePrice * nights
  }, 0)

  const totalRooms = Object.values(selectedRooms).reduce((a, b) => a + b, 0)

  return (
    <div>
      <img
        src={assets.list4}
        alt="Khách sạn"
        className="home-image-top-booking"
      />

      <div className="booking-form">
        <label>
          Ngày nhận phòng:
          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => {
              setCheckIn(e.target.value)
              if (checkOut && e.target.value >= checkOut) {
                setCheckOut(getNextDay(e.target.value))
              }
            }}
          />
        </label>

        <label>
          Ngày trả phòng:
          <input
            type="date"
            value={checkOut}
            min={getNextDay(checkIn)}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </label>
      </div>

      <div className="booking-container">
        <div className="room-booking-list">
          {rooms.map((room) => (
            <div key={room.roomTypeId} className="room-info">
              <img
                src={room.image}
                alt={room.typeName}
                className="room-image"
              />

              <div className="room-details">
                <h2>Phòng {room.typeName}</h2>
                <p>{room.description}</p>

                <div className="room-meta">
                  <span>
                    <b>Giường:</b> {room.bedDescription}
                  </span>
                  <span>
                    <b>Diện tích:</b> {room.area} m²
                  </span>
                  <span>
                    <b>Tối đa:</b> {room.maxOccupancy} khách
                  </span>
                </div>

                <div className="room-footer">
                  <div>
                    <span className="room-price">
                      {room.basePrice.toLocaleString("vi-VN")} VND
                    </span>{" "}
                    <span className="per-night">/ đêm</span>
                  </div>

                  <select
                    value={selectedRooms[room.roomTypeId] || 0}
                    onChange={(e) =>
                      handleSelect(room.roomTypeId, e.target.value)
                    }
                  >
                    {[...Array(room.totalRooms + 1).keys()].map((num) => (
                      <option key={num} value={num}>
                        {num} phòng
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="summary-box">
          <h3>ĐẶT NGAY</h3>
          <p>
            {totalRooms} phòng / {nights} đêm
          </p>
          <p className="total-price">
            {totalPrice.toLocaleString("vi-VN")} VND
          </p>
          <button className="btn-book" disabled={totalRooms === 0}>
            Đặt ngay
          </button>
        </div>
      </div>
    </div>
  )
}

export default Booking
