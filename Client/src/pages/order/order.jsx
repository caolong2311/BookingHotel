import './order.css'
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Order = () => {
  const { state } = useLocation()
  const {
    selectedRoomDetails = [],
    nights,
    totalPrice,
    checkIn,
    checkOut
  } = state || {}

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setCustomer((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault() 

    if (!customer.name || !customer.phone || !customer.email) {
      alert("Vui lòng nhập đầy đủ thông tin khách hàng!")
      return
    }
    alert("Thanh toán thành công!")
  }

  return (
    <div>
      <img
        src={assets.list3}
        alt="Khách sạn"
        className="home-image-top-booking"
      />

      <div className="order-container">
        <div className="order-box">
          <h3>PHÒNG</h3>
          {selectedRoomDetails.map((room, index) => (
            <div key={index} className="order-room">
              <img src={room.image} alt={room.name} className="order-room-img" />
              <div className="order-room-info">
                <h4>{room.name}</h4>
                <p>
                  Giá phòng:{" "}
                  <span className="price">
                    {room.price.toLocaleString("vi-VN")} VND
                  </span>
                </p>
                <p>Số lượng: {room.quantity}</p>
              </div>
            </div>
          ))}

          <div className="order-detail">
            <p>
              Ngày Đến <span>{checkIn}</span>
            </p>
            <p>
              Ngày Đi <span>{checkOut}</span>
            </p>
            <p>
              Đêm <span>{nights}</span>
            </p>
          </div>

          <div className="order-total">
            <b>Tổng tiền:</b>{" "}
            <span className="total">
              {totalPrice.toLocaleString("vi-VN")} VND
            </span>
          </div>
        </div>

        <div className="customer-box">
          <h3>Thông tin khách hàng</h3>

          <form onSubmit={handleSubmit}>
            <label>Họ và tên</label>
            <input
              type="text"
              name="name"
              value={customer.name}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              required
            />

            <label>Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              value={customer.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              required
              pattern="[0-9]{10}" 
              title="Vui lòng nhập số điện thoại hợp lệ"
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={customer.email}
              onChange={handleChange}
              placeholder="Nhập email"
              required
            />

            <button type="submit" className="btn-pay">
              XÁC NHẬN THANH TOÁN
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Order
