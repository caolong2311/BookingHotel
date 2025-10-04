import './CheckIn.css'
import React, { useState } from 'react'

// JSON mock data (thêm quantity)
const bookingData = [
  {
    fullName: "Long",
    checkInDate: "2025-10-04T00:00:00",
    checkOutDate: "2025-10-05T00:00:00",
    bookingDetailId: 13,
    typeRoom: "Superior",
    quantity: 1,
    rooms: [{ roomNumber: "202" }, { roomNumber: "203" }, { roomNumber: "204" }]
  },
  {
    fullName: "Long",
    checkInDate: "2025-10-04T00:00:00",
    checkOutDate: "2025-10-05T00:00:00",
    bookingDetailId: 14,
    typeRoom: "Deluxe",
    quantity: 2,
    rooms: [{ roomNumber: "301" }, { roomNumber: "302" }, { roomNumber: "303" }]
  },
  {
    fullName: "Long",
    checkInDate: "2025-10-03T00:00:00",
    checkOutDate: "2025-10-06T00:00:00",
    bookingDetailId: 15,
    typeRoom: "Superior",
    quantity: 1,
    rooms: [{ roomNumber: "205" }, { roomNumber: "206" }]
  },
  {
    fullName: "Long",
    checkInDate: "2025-10-03T00:00:00",
    checkOutDate: "2025-10-06T00:00:00",
    bookingDetailId: 16,
    typeRoom: "Executive",
    quantity: 3,
    rooms: [{ roomNumber: "401" }, { roomNumber: "402" }, { roomNumber: "403" }, { roomNumber: "404" }]
  }
]

// Gom dữ liệu theo ngày
const groupByDate = (data) => {
  const grouped = {}

  data.forEach(item => {
    const key = `${item.checkInDate}_${item.checkOutDate}`

    if (!grouped[key]) {
      grouped[key] = {
        fullName: item.fullName,
        checkInDate: item.checkInDate.split('T')[0],
        checkOutDate: item.checkOutDate.split('T')[0],
        bookings: []
      }
    }

    grouped[key].bookings.push({
      typeRoom: item.typeRoom,
      quantity: item.quantity,
      rooms: item.rooms.map(r => r.roomNumber)
    })
  })

  return Object.values(grouped)
}

const CheckIn = () => {
  const [phone, setPhone] = useState('')
  const [customer, setCustomer] = useState(null)
  const [expanded, setExpanded] = useState({})
  const [selectedRooms, setSelectedRooms] = useState({})

  const handleSearch = () => {
    if (phone === '0901234567') {
      const grouped = groupByDate(bookingData)
      setCustomer({ fullName: "Long", bookingsByDate: grouped })
    } else {
      setCustomer({ notFound: true })
    }
  }

  const handleReset = () => {
    setPhone('')
    setCustomer(null)
    setExpanded({})
    setSelectedRooms({})
  }

  // toggle room với quantity limit
  const toggleRoom = (dateKey, typeRoom, room, quantity) => {
    const key = `${dateKey}_${typeRoom}`
    setSelectedRooms(prev => {
      const current = prev[key] || []

      // nếu đã chọn rồi thì bỏ chọn
      if (current.includes(room)) {
        return { ...prev, [key]: current.filter(r => r !== room) }
      }

      // nếu chưa đủ số lượng thì thêm
      if (current.length < quantity) {
        return { ...prev, [key]: [...current, room] }
      }

      return prev
    })
  }

  return (
    <div className="checkin-wrapper">
      <div className="checkin-header">
        <input
          type="text"
          placeholder="Nhập số điện thoại..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button className="btn btn-search" onClick={handleSearch}>Tìm kiếm</button>
        <button className="btn btn-reset" onClick={handleReset}>Đặt lại</button>
      </div>

      <div className="checkin-result">
        {customer ? (
          customer.notFound ? (
            <p>Không tìm thấy khách hàng.</p>
          ) : (
            <div>
              <h3>Khách hàng: {customer.fullName}</h3>
              {customer.bookingsByDate.map((day, idx) => {
                const dateKey = `${day.checkInDate}_${day.checkOutDate}`
                const isOpen = expanded[dateKey]

                return (
                  <div key={idx} className="booking-card">
                    <div className="booking-summary">
                      <p><strong>{day.checkInDate}</strong> → <strong>{day.checkOutDate}</strong></p>
                      <button 
                        className="btn btn-detail"
                        onClick={() => setExpanded(prev => ({ ...prev, [dateKey]: !isOpen }))}
                      >
                        {isOpen ? "Ẩn chi tiết" : "Chi tiết"}
                      </button>
                    </div>

                    {isOpen && (
                      <div className="booking-detail">
                        {day.bookings.map((b, i) => {
                          const key = `${dateKey}_${b.typeRoom}`
                          const selected = selectedRooms[key] || []
                          return (
                            <div key={i} className="room-type">
                              <p>Loại phòng: <b>{b.typeRoom}</b> (Số lượng: {b.quantity})</p>
                              <div className="room-list">
                                {b.rooms.map(r => (
                                  <button
                                    key={r}
                                    className={`room-btn ${selected.includes(r) ? 'selected' : ''}`}
                                    onClick={() => toggleRoom(dateKey, b.typeRoom, r, b.quantity)}
                                  >
                                    {r}
                                  </button>
                                ))}
                              </div>
                              <p className="selected-info">
                                ✅ Đã chọn: {selected.length}/{b.quantity}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        ) : (
          <p>Thông tin khách hàng sẽ hiển thị ở đây...</p>
        )}
      </div>
    </div>
  )
}

export default CheckIn
