import './CheckIn.css'
import React, { useState } from 'react'
import axios from 'axios'

const CheckIn = () => {
  const [phone, setPhone] = useState('')
  const [customer, setCustomer] = useState(null)
  const [expanded, setExpanded] = useState({})
  const [selectedRooms, setSelectedRooms] = useState({})
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem("token");
  const handleSearch = async () => {
    if (!phone.trim()) return alert('Vui lòng nhập số điện thoại')

    setLoading(true)
    setCustomer(null)

    try {
      const res = await axios.get(
        `https://localhost:7182/api/booking/check-in?phone=${phone}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data

      if (!data || !data.customerBookingDTOs || data.customerBookingDTOs.length === 0) {
        setCustomer({ notFound: true })
      } else {
        setCustomer({
          fullName: data.fullName,
          bookingsByDate: data.customerBookingDTOs.map(b => ({
            bookingId: b.bookingId,
            checkInDate: b.checkInDate.split('T')[0],
            checkOutDate: b.checkOutDate.split('T')[0],
            details: null,
          })),
        })
      }
    } catch (err) {
      console.error('Lỗi khi gọi API check-in:', err)
      alert('Không thể lấy dữ liệu khách hàng')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setPhone('')
    setCustomer(null)
    setExpanded({})
    setSelectedRooms({})
  }

  const toggleRoom = (dateKey, typeRoom, room, quantity) => {
    const key = `${dateKey}_${typeRoom}`
    setSelectedRooms(prev => {
      const current = prev[key] || []
      if (current.includes(room)) {
        return { ...prev, [key]: current.filter(r => r !== room) }
      }
      if (current.length < quantity) {
        return { ...prev, [key]: [...current, room] }
      }
      return prev
    })
  }

  const handleToggleDetail = async (dateKey, bookingId) => {
    setExpanded(prev => ({ ...prev, [dateKey]: !prev[dateKey] }))

    if (expanded[dateKey] || !customer) return

    try {
      const res = await axios.get(`https://localhost:7182/api/booking/detail-booking`, {
        params: { bookingID: bookingId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = res.data

      setCustomer(prev => ({
        ...prev,
        bookingsByDate: prev.bookingsByDate.map(b =>
          b.bookingId === bookingId
            ? {
              ...b,
              details: data.map(d => ({
                roomTypeId: d.roomTypeId,
                typeRoom: d.typeName,
                quantity: d.quantity,
                rooms: d.roomDTOs.map(r => r.roomNumber),
              })),
            }
            : b
        ),
      }))
    } catch (err) {
      console.error('Lỗi khi gọi API detail-booking:', err)
      alert('Không thể tải chi tiết đặt phòng')
    }
  }

  const isBookingReady = (day) => {
    if (!day.details) return false
    return day.details.every((b) => {
      const key = `${day.checkInDate}_${day.checkOutDate}_${b.typeRoom}`
      const selected = selectedRooms[key] || []
      return selected.length === b.quantity
    })
  }

  const handleBook = async (day) => {
    try {
      const body = day.details.map((b) => {
        const key = `${day.checkInDate}_${day.checkOutDate}_${b.typeRoom}`
        const selected = selectedRooms[key] || []
        return {
          RoomTypeId: b.roomTypeId,
          roomDTOs: selected.map(r => ({ RoomNumber: r }))
        }
      })

      await axios.put(
        `https://localhost:7182/api/booking/update-room`,
        body,
        {
          params: { bookingID: day.bookingId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },

      )

      alert('Đặt phòng thành công!')

      handleReset()

    } catch (err) {
      console.error('Lỗi khi đặt phòng:', err)
      alert('Không thể đặt phòng. Vui lòng thử lại.')
    }
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
        <button className="btn-checkin btn-search" onClick={handleSearch} disabled={loading}>
          {loading ? 'Đang tìm...' : 'Tìm kiếm'}
        </button>
        <button className="btn-checkin btn-reset" onClick={handleReset}>Đặt lại</button>
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
                      <p>
                        <strong>{day.checkInDate}</strong> → <strong>{day.checkOutDate}</strong>
                      </p>
                      <button
                        className="btn btn-detail"
                        onClick={() => handleToggleDetail(dateKey, day.bookingId)}
                      >
                        {isOpen ? 'Ẩn chi tiết' : 'Chi tiết'}
                      </button>
                    </div>

                    {isOpen && (
                      <div className="booking-detail">
                        {day.details ? (
                          <>
                            {day.details.map((b, i) => {
                              const key = `${dateKey}_${b.typeRoom}`
                              const selected = selectedRooms[key] || []
                              return (
                                <div key={i} className="room-type">
                                  <p>
                                    Loại phòng: <b>{b.typeRoom}</b> (Số lượng: {b.quantity})
                                  </p>
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
                                    Đã chọn: {selected.length}/{b.quantity}
                                  </p>
                                </div>
                              )
                            })}

                            <button
                              className="btn btn-book"
                              disabled={!isBookingReady(day)}
                              onClick={() => handleBook(day)}
                            >
                              Đặt phòng
                            </button>
                          </>
                        ) : (
                          <p>Đang tải chi tiết...</p>
                        )}
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
