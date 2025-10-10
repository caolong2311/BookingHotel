import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CheckOut.css";

const CheckOut = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupData, setPopupData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // 🔹 Lấy danh sách phòng
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get("https://localhost:7182/api/Room");
        setRooms(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu phòng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setRooms((prev) => [...prev]);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleRoomClick = async (room) => {
    const today = new Date().toISOString().split("T")[0];
    const checkoutDate = room.checkOutDate
      ? new Date(room.checkOutDate).toISOString().split("T")[0]
      : null;

    if (room.status === "Còn phòng") {
      alert(`Phòng ${room.roomNumber} chưa có người đặt!`);
      return;
    }


    try {
      const res = await axios.get(
        `https://localhost:7182/api/room/service?roomNumber=${room.roomNumber}`
      );
      setPopupData(res.data);
      setShowPopup(true);
    } catch (err) {
      console.error("Lỗi khi gọi API dịch vụ phòng:", err);
      alert("Không thể tải thông tin phòng này!");
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupData(null);
  };

  const handleAddService = () => {
    alert(`Thêm dịch vụ cho phòng ${popupData.roomNumber}`);
  };

  const handleCheckout = () => {
    alert(`Tiến hành trả phòng ${popupData.roomNumber}`);
  };

  if (loading) return <p>Đang tải dữ liệu phòng...</p>;

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">CheckOut</h2>

      <div className="room-grid">
        {rooms.map((room, index) => {
          const today = new Date().toISOString().split("T")[0];
          const checkoutDate = room.checkOutDate
            ? new Date(room.checkOutDate).toISOString().split("T")[0]
            : null;
          let cardClass = "room-card";
          let displayStatus = room.status;

          if (room.status === "Hết phòng") {
            if (checkoutDate === today) {
              cardClass += " today-checkout";
              displayStatus = "Trả phòng";
            } else {
              cardClass += " booked";
            }
          } else {
            cardClass += " available";
          }

          return (
            <div
              key={index}
              className={cardClass}
              onClick={() => handleRoomClick(room)}
            >
              <h3>Phòng {room.roomNumber}</h3>
              <p>{displayStatus}</p>
            </div>
          );
        })}
      </div>


      {showPopup && popupData && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closePopup}>
              ✖
            </button>

            <h3>
              Phòng {popupData.roomNumber} - {popupData.fullName}
            </h3>
            <p>
              <strong>Ngày nhận phòng:</strong>{" "}
              {new Date(popupData.checkInDate).toLocaleDateString("vi-VN")}
              
            </p>
            <p>
              <strong>Ngày trả phòng:</strong>{" "}
              {new Date(popupData.checkOutDate).toLocaleDateString("vi-VN")}
            </p>

            <h4>Dịch vụ đã sử dụng</h4>
            <div className="service-table-container">
              <table className="service-table">
                <thead>
                  <tr>
                    <th>Tên dịch vụ</th>
                    <th>Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {popupData.serviceList.map((s, i) => (
                    <tr key={i}>
                      <td>{s.serviceName}</td>
                      <td>{s.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="popup-actions">
              <button className="btn add-btn" onClick={handleAddService}>
                + Thêm dịch vụ
              </button>
              <button className="btn checkout-btn" onClick={handleCheckout}>
                ✔ Trả phòng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckOut;
